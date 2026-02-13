"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";

interface NewsletterFormProps {
  variant?: "footer" | "standalone";
}

type FormState = "idle" | "loading" | "success" | "error" | "already";

/**
 * Compact inline newsletter signup form.
 * Footer variant: light text on dark bg. Standalone variant: dark text on light bg.
 */
export function NewsletterForm({ variant = "footer" }: NewsletterFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-reset to idle after 5 seconds on success/already
  useEffect(() => {
    if (state === "success" || state === "already") {
      timerRef.current = setTimeout(() => {
        setState("idle");
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inputRef.current?.value?.trim();
    if (!email) return;

    setState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setErrorMessage(data.error || "Erreur lors de l'inscription");
        return;
      }

      if (data.alreadySubscribed) {
        setState("already");
      } else {
        setState("success");
        if (inputRef.current) inputRef.current.value = "";
      }
    } catch {
      setState("error");
      setErrorMessage("Erreur de connexion. Reessayez plus tard.");
    }
  };

  const isFooter = variant === "footer";

  const inputClasses = isFooter
    ? "bg-transparent border border-background/30 text-background placeholder:text-background/50 focus:border-accent focus:ring-accent/30"
    : "bg-white border border-primary/20 text-primary placeholder:text-primary/50 focus:border-accent focus:ring-accent/30";

  const buttonClasses =
    "bg-accent hover:bg-accent/90 text-white font-medium transition-colors duration-200";

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {(state === "success" || state === "already") ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-2 py-2 ${
              isFooter ? "text-background/90" : "text-primary/90"
            }`}
          >
            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm">
              {state === "success"
                ? "Merci ! Verifiez votre boite mail."
                : "Vous etes deja inscrit(e) !"}
            </span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="email"
              placeholder="Votre email"
              required
              disabled={state === "loading"}
              className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 transition-colors duration-200 ${inputClasses} disabled:opacity-50`}
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${buttonClasses} disabled:opacity-50`}
            >
              {state === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "S'inscrire"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {state === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span className="text-xs text-red-400">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
