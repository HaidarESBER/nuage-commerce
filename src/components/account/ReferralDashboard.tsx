"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2, Mail } from "lucide-react";
import { generateReferralLink, getReferralStats } from "@/lib/referral";

interface ReferralDashboardProps {
  userId: string;
}

export function ReferralDashboard({ userId }: ReferralDashboardProps) {
  const [referralLink, setReferralLink] = useState<string>("");
  const [stats, setStats] = useState<{
    referralCode: string;
    clicks: number;
    conversions: number;
    conversionRate: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, [userId]);

  const loadReferralData = async () => {
    setIsLoading(true);
    try {
      const [link, statsData] = await Promise.all([
        generateReferralLink(userId),
        getReferralStats(userId),
      ]);

      setReferralLink(link);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load referral data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleShare = (platform: "whatsapp" | "email") => {
    const message = `Découvrez Nuage, boutique chicha premium! Utilisez mon lien: ${referralLink}`;

    if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } else if (platform === "email") {
      window.open(
        `mailto:?subject=${encodeURIComponent("Découvrez Nuage")}&body=${encodeURIComponent(message)}`,
        "_blank"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background-secondary/30 border border-border rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-background-secondary rounded mb-4"></div>
          <div className="h-10 bg-background-secondary rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-background-secondary rounded"></div>
            <div className="h-20 bg-background-secondary rounded"></div>
            <div className="h-20 bg-background-secondary rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-secondary/30 border border-border rounded-xl p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-primary mb-2">Parrainage</h2>
        <p className="text-sm text-muted">
          Partagez Nuage avec vos amis et suivez vos parrainages.
        </p>
      </div>

      {/* Referral Link */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Votre lien de parrainage
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="px-4 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2 whitespace-nowrap font-medium"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copié!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copier
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background-secondary/50 border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {stats?.clicks || 0}
          </div>
          <div className="text-xs text-muted mt-1">Clics</div>
        </div>

        <div className="bg-background-secondary/50 border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {stats?.conversions || 0}
          </div>
          <div className="text-xs text-muted mt-1">Conversions</div>
        </div>

        <div className="bg-background-secondary/50 border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {stats?.conversionRate ? stats.conversionRate.toFixed(1) : "0"}%
          </div>
          <div className="text-xs text-muted mt-1">Taux</div>
        </div>
      </div>

      {/* Share Buttons */}
      <div>
        <label className="block text-sm font-medium text-primary mb-3">
          Partager via
        </label>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare("whatsapp")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#25D366]/90 transition-colors font-medium"
          >
            <Share2 className="w-4 h-4" />
            WhatsApp
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare("email")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-background-secondary border border-border text-primary rounded-lg hover:bg-border transition-colors font-medium"
          >
            <Mail className="w-4 h-4" />
            Email
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-background-secondary border border-border text-primary rounded-lg hover:bg-border transition-colors font-medium"
          >
            <Copy className="w-4 h-4" />
            Copier
          </motion.button>
        </div>
      </div>

      {/* Info */}
      {stats && stats.clicks === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            💡 <strong>Astuce:</strong> Partagez votre lien sur les réseaux sociaux,
            dans vos groupes WhatsApp ou par email pour commencer à parrainer vos
            amis!
          </p>
        </div>
      )}
    </motion.div>
  );
}
