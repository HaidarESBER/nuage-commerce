import { NextRequest, NextResponse } from 'next/server';
import { SITE_KNOWLEDGE, CHATBOT_PERSONALITY } from '@/lib/chatbot/knowledge';
import { createClient } from '@supabase/supabase-js';

/**
 * Get all products from Supabase
 */
async function getAllProducts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('name');

  return products || [];
}

/**
 * Lookup customer order by email
 */
async function lookupOrder(email: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .order('created_at', { ascending: false })
    .limit(1);

  return orders?.[0] || null;
}

/**
 * Support Chatbot API using Groq
 * Cost: 100% FREE! (Llama 3.3 70B)
 */
export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.GROQ_API_KEY) {
      console.error('[Chatbot] GROQ_API_KEY not set in environment');
      return NextResponse.json({
        message: "Configuration error - API key missing. Contact support.",
        error: true,
      }, { status: 200 });
    }

    const { messages, sessionId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400 }
      );
    }

    // Fetch ALL products from Supabase
    const products = await getAllProducts();


    // Build system prompt with real products + knowledge base
    const productsInfo = products.map(p => {
      const price = typeof p.price === 'number' ? (p.price / 100).toFixed(2) : p.price;
      const comparePrice = p.compare_at_price || p.compareAtPrice;
      const stock = p.stock_level || p.stockLevel || 0;
      const inStock = p.in_stock !== undefined ? p.in_stock : (p.inStock || stock > 0);
      const description = p.short_description || p.shortDescription || p.description || '';

      return `- ${p.name} [slug: ${p.slug}]: ${price}€${comparePrice ? ` (était ${(comparePrice/100).toFixed(2)}€)` : ''} - ${description.substring(0, 100)} ${inStock ? `(${stock} en stock)` : '(RUPTURE DE STOCK)'}`;
    }).join('\n');

    const systemPrompt = `${CHATBOT_PERSONALITY}

PRODUITS RÉELS DU SITE - CATALOGUE COMPLET (${products.length} produits):
Ces produits sont TOUS les produits disponibles. Recommande UNIQUEMENT ceux-ci par leur NOM EXACT.

${productsInfo}

BASE DE CONNAISSANCES NUAGE:

BOUTIQUE:
${JSON.stringify(SITE_KNOWLEDGE.store, null, 2)}

CATÉGORIES GÉNÉRALES:
${JSON.stringify(SITE_KNOWLEDGE.products, null, 2)}

LIVRAISON:
${JSON.stringify(SITE_KNOWLEDGE.shipping, null, 2)}

RETOURS:
${JSON.stringify(SITE_KNOWLEDGE.returns, null, 2)}

PAIEMENT:
${JSON.stringify(SITE_KNOWLEDGE.payment, null, 2)}

SUPPORT:
${JSON.stringify(SITE_KNOWLEDGE.support, null, 2)}

CONSEILS D'UTILISATION:
${JSON.stringify(SITE_KNOWLEDGE.usage, null, 2)}

FAQ:
${SITE_KNOWLEDGE.faq.map(item => `Q: ${item.q}\nR: ${item.a}`).join('\n\n')}

---

Réponds maintenant au message du client en utilisant ces informations.
`;

    // Call Groq API (FREE!)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // FREE Llama 3.3 70B!
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 280, // Warm & helpful!
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Chatbot] Groq error status:', response.status);
      console.error('[Chatbot] Groq error body:', errorText);

      // Return a friendly error to the user
      return NextResponse.json({
        message: "Désolé habibi, j'ai un petit souci technique 😅 Réessaie dans quelques secondes ou contacte support@nuage.fr",
        error: true,
      }, { status: 200 }); // Return 200 so UI doesn't break
    }

    const data = await response.json();
    console.log('[Chatbot] Groq response model:', data.model);

    // Extract response
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    // Parse product recommendations [PRODUCT:slug]
    const productMatches = assistantMessage.matchAll(/\[PRODUCT:([\w-]+)\]/g);
    const productSlugs = Array.from(productMatches).map((match: RegExpMatchArray) => match[1]);
    const recommendedProducts = products
      .filter(p => productSlugs.includes(p.slug))
      .map(p => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        image: Array.isArray(p.images) ? p.images[0] : (p.image_url || p.images || '/placeholder.jpg'),
        url: `/produits/${p.slug}`
      }));

    // Remove [PRODUCT:...] tags from message
    const cleanMessage = assistantMessage
      .replace(/\[PRODUCT:[\w-]+\]/g, '')
      .trim();

    // Check if we should escalate to human (complex issue detection)
    const shouldEscalate = detectEscalation(cleanMessage, messages);

    return NextResponse.json({
      message: cleanMessage,
      products: recommendedProducts,
      escalate: shouldEscalate,
      model: data.model,
      sessionId,
    });

  } catch (error) {
    console.error('[Chatbot] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get response',
        message: "Désolé, j'ai un petit problème technique. Peux-tu réessayer ou contacter support@nuage.fr ?",
      },
      { status: 500 }
    );
  }
}

/**
 * Detect if conversation should be escalated to human support
 */
function detectEscalation(aiResponse: string, messages: any[]): boolean {
  const escalationTriggers = [
    'parler à un humain',
    'contacter le support',
    'cas complexe',
    'je ne peux pas',
    'je ne sais pas',
    'commande perdue',
    'produit défectueux',
    'remboursement',
    'problème grave',
  ];

  const lowerResponse = aiResponse.toLowerCase();

  // Check if AI suggests escalation
  if (escalationTriggers.some(trigger => lowerResponse.includes(trigger))) {
    return true;
  }

  // Check if customer is frustrated (multiple messages without resolution)
  if (messages.length > 6) {
    return true;
  }

  return false;
}
