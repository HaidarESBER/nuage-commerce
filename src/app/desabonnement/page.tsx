import { Container } from "@/components/ui";
import Link from "next/link";
import { UnsubscribeContent } from "./UnsubscribeContent";

export const metadata = {
  title: "Desabonnement - Nuage",
  description: "Gerez votre abonnement a la newsletter Nuage.",
};

interface DesabonnementPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function DesabonnementPage({
  searchParams,
}: DesabonnementPageProps) {
  const params = await searchParams;
  const success = params.success === "true";
  const error = params.error === "invalid";

  return (
    <main className="min-h-screen bg-background py-16">
      <Container size="sm">
        <div className="max-w-md mx-auto text-center">
          {success ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-primary mb-4">
                Desabonnement confirme
              </h1>
              <p className="text-primary/70 mb-8">
                Vous avez ete desabonne(e) de notre newsletter avec succes.
                Vous ne recevrez plus d&apos;emails de notre part.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retour a l&apos;accueil
              </Link>
            </>
          ) : error ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-primary mb-4">
                Lien invalide
              </h1>
              <p className="text-primary/70 mb-4">
                Le lien de desabonnement est invalide ou a expire.
              </p>
              <p className="text-primary/70 mb-8">
                Vous pouvez vous desabonner manuellement ci-dessous ou
                nous contacter a{" "}
                <a
                  href="mailto:contact@nuage.fr"
                  className="text-accent underline"
                >
                  contact@nuage.fr
                </a>
                .
              </p>
              <UnsubscribeContent />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-primary mb-4">
                Se desabonner
              </h1>
              <p className="text-primary/70 mb-8">
                Entrez votre adresse email pour vous desabonner de notre
                newsletter.
              </p>
              <UnsubscribeContent />
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
