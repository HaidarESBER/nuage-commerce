"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Container } from "@/components/ui";
import { UserSession, EmailPreferences } from "@/types/user";

type TabType = "info" | "security" | "preferences";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Info form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Security form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Preferences form
  const [preferences, setPreferences] = useState<EmailPreferences>({
    email_marketing: false,
    email_order_updates: true,
    email_promotions: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (response.status === 401) {
        router.push("/compte");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la récupération du profil");
      }

      setUser(data.user);
      setFirstName(data.user.firstName);
      setLastName(data.user.lastName);
      setPhone(data.user.phone || "");
      setPreferences(
        data.user.preferences || {
          email_marketing: false,
          email_order_updates: true,
          email_promotions: false,
        }
      );
    } catch (error) {
      console.error("Error fetching profile:", error);
      showMessage("error", "Erreur lors du chargement du profil");
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      setUser(data.user);
      showMessage("success", "Profil mis à jour avec succès");
    } catch (error) {
      console.error("Error updating profile:", error);
      showMessage(
        "error",
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      showMessage("error", "Les mots de passe ne correspondent pas");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du changement de mot de passe");
      }

      showMessage("success", "Mot de passe modifié avec succès");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      showMessage(
        "error",
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      setUser(data.user);
      showMessage("success", "Préférences mises à jour avec succès");
    } catch (error) {
      console.error("Error updating preferences:", error);
      showMessage(
        "error",
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="py-12 min-h-screen">
        <Container size="md">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted mt-4">Chargement...</p>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-12 min-h-screen">
      <Container size="md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
            Mon Profil
          </h1>
          <p className="text-muted">Gérez vos informations personnelles</p>
        </div>

        {/* Toast Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="bg-background-secondary/30 border border-border rounded-xl overflow-hidden">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === "info"
                  ? "bg-background text-primary border-b-2 border-accent"
                  : "text-muted hover:text-primary"
              }`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === "security"
                  ? "bg-background text-primary border-b-2 border-accent"
                  : "text-muted hover:text-primary"
              }`}
            >
              Sécurité
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === "preferences"
                  ? "bg-background text-primary border-b-2 border-accent"
                  : "text-muted hover:text-primary"
              }`}
            >
              Préférences
            </button>
          </div>

          <div className="p-8">
            {/* Informations Tab */}
            {activeTab === "info" && (
              <motion.form
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSaveInfo}
                className="space-y-6 max-w-lg"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background-secondary text-muted cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-muted">
                    L&apos;email ne peut pas être modifié
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-primary mb-2"
                    >
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-primary mb-2"
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-accent text-background font-medium py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </motion.form>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <motion.form
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleChangePassword}
                className="space-y-6 max-w-lg"
              >
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    minLength={12}
                    required
                  />
                  <p className="mt-1 text-xs text-muted">
                    Minimum 12 caractères, avec majuscule, minuscule, chiffre et
                    caractère spécial
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmNewPassword"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    minLength={12}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-accent text-background font-medium py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Modification..." : "Modifier le mot de passe"}
                </button>
              </motion.form>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <motion.form
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSavePreferences}
                className="space-y-6 max-w-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="email_order_updates"
                      checked={preferences.email_order_updates}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          email_order_updates: e.target.checked,
                        })
                      }
                      className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <div>
                      <label
                        htmlFor="email_order_updates"
                        className="text-sm font-medium text-primary cursor-pointer"
                      >
                        Notifications de commande
                      </label>
                      <p className="text-xs text-muted mt-1">
                        Recevoir des emails sur l&apos;état de vos commandes
                        (confirmation, expédition, livraison)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="email_promotions"
                      checked={preferences.email_promotions}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          email_promotions: e.target.checked,
                        })
                      }
                      className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <div>
                      <label
                        htmlFor="email_promotions"
                        className="text-sm font-medium text-primary cursor-pointer"
                      >
                        Promotions et offres
                      </label>
                      <p className="text-xs text-muted mt-1">
                        Recevoir nos offres spéciales et codes de réduction
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="email_marketing"
                      checked={preferences.email_marketing}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          email_marketing: e.target.checked,
                        })
                      }
                      className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <div>
                      <label
                        htmlFor="email_marketing"
                        className="text-sm font-medium text-primary cursor-pointer"
                      >
                        Newsletters et actualités
                      </label>
                      <p className="text-xs text-muted mt-1">
                        Recevoir nos newsletters avec nouveautés, conseils et
                        tendances
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-accent text-background font-medium py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
