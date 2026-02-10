"use client";

import { useState } from "react";
import { Container } from "@/components/ui";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate sending (replace with actual email service)
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <main className="py-16 min-h-screen">
      <Container size="lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-primary mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg text-primary/70 mb-12">
            Une question ? Une remarque ? N'hésitez pas à nous contacter, notre équipe vous répondra dans les plus brefs délais.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-6">
                Envoyez-nous un message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/20 rounded-[--radius-button] bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/20 rounded-[--radius-button] bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="jean.dupont@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-primary mb-2">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/20 rounded-[--radius-button] bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="produit">Question sur un produit</option>
                    <option value="livraison">Problème de livraison</option>
                    <option value="retour">Retour / Remboursement</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/20 rounded-[--radius-button] bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    placeholder="Décrivez votre demande..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full px-6 py-3 bg-primary text-background rounded-[--radius-button] font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
                </button>

                {status === "success" && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-[--radius-button] text-green-800">
                    Message envoyé avec succès ! Nous vous répondrons rapidement.
                  </div>
                )}

                {status === "error" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-[--radius-button] text-red-800">
                    Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-6">
                Informations de contact
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Email</h3>
                    <a href="mailto:contact@nuage.fr" className="text-primary/70 hover:text-accent transition-colors">
                      contact@nuage.fr
                    </a>
                    <p className="text-sm text-primary/50 mt-1">
                      Réponse sous 24-48h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <PhoneIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Téléphone</h3>
                    <a href="tel:+33123456789" className="text-primary/70 hover:text-accent transition-colors">
                      +33 1 23 45 67 89
                    </a>
                    <p className="text-sm text-primary/50 mt-1">
                      Lun-Ven : 9h-18h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <MapPinIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Adresse</h3>
                    <p className="text-primary/70">
                      [Adresse à compléter]<br />
                      [Code postal] [Ville]<br />
                      France
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-accent/5 rounded-[--radius-button] border border-accent/20">
                <h3 className="font-semibold text-primary mb-3">
                  Service client
                </h3>
                <p className="text-sm text-primary/70">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions concernant nos produits, vos commandes ou tout autre sujet.
                </p>
              </div>

              <div className="mt-6 p-6 bg-primary/5 rounded-[--radius-button] border border-primary/10">
                <h3 className="font-semibold text-primary mb-3">
                  Questions fréquentes
                </h3>
                <p className="text-sm text-primary/70 mb-3">
                  Avant de nous contacter, consultez notre page de suivi de commande si vous avez besoin d'informations sur votre livraison.
                </p>
                <a
                  href="/suivi"
                  className="text-sm text-accent hover:underline font-medium"
                >
                  Suivre ma commande →
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
