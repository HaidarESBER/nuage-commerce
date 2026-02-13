"use server";

import { revalidatePath } from "next/cache";
import { sendToCurationAction } from "@/app/admin/sourcing/actions";
import { retranslate, publishDraftAction } from "@/app/admin/curation/actions";

/**
 * Send scraped product to curation pipeline
 */
export async function pipelineSendToCuration(scrapedProductId: string) {
  const result = await sendToCurationAction(scrapedProductId);
  revalidatePath("/admin/pipeline");
  return result;
}

/**
 * Trigger translation for a draft
 */
export async function pipelineTranslate(draftId: string) {
  await retranslate(draftId);
  revalidatePath("/admin/pipeline");
}

/**
 * Publish a draft as a real product
 */
export async function pipelinePublish(draftId: string) {
  const product = await publishDraftAction(draftId);
  revalidatePath("/admin/pipeline");
  return product;
}
