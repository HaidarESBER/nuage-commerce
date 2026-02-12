import { redirect } from "next/navigation";
import { getDraftById } from "@/lib/curation";
import { DraftDetailView } from "./DraftDetailView";

export const dynamic = "force-dynamic";

interface DraftDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DraftDetailPage({ params }: DraftDetailPageProps) {
  const { id } = await params;
  const draft = await getDraftById(id);

  if (!draft) {
    redirect("/admin/curation");
  }

  return <DraftDetailView draft={draft} />;
}
