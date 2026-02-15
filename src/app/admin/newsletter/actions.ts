"use server";

import { revalidatePath } from "next/cache";
import { unsubscribe } from "@/lib/newsletter";
import { runWinBackCampaign } from "@/lib/email-campaigns";

export async function unsubscribeAction(email: string) {
  const success = await unsubscribe(email);
  if (success) {
    revalidatePath("/admin/newsletter");
  }
  return success;
}

export async function triggerWinBackCampaignAction() {
  const summary = await runWinBackCampaign();
  revalidatePath("/admin/newsletter");
  return summary;
}
