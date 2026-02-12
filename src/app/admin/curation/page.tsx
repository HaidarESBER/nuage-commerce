import { getDraftStats, getAllDrafts } from "@/lib/curation";
import { CurationDashboard } from "./CurationDashboard";

export const dynamic = "force-dynamic";

export default async function AdminCurationPage() {
  const [stats, drafts] = await Promise.all([getDraftStats(), getAllDrafts()]);

  return <CurationDashboard stats={stats} drafts={drafts} />;
}
