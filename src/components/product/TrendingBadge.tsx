import { motion } from "framer-motion";

export function TrendingBadge() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute top-3 right-3 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(18,222,38,0.4)] z-10"
    >
      🔥 Tendance
    </motion.div>
  );
}
