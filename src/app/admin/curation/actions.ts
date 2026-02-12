"use server";

import { revalidatePath } from "next/cache";
import { batchTranslate } from "@/lib/ai/translate-product";
import {
  updateDraft,
  updateDraftStatus,
  deleteDraft,
  getDraftById,
} from "@/lib/curation";
import { DraftStatus } from "@/types/curation";

/**
 * Trigger batch translation of pending drafts
 */
export async function triggerBatchTranslation() {
  const result = await batchTranslate(10);
  revalidatePath("/admin/curation");
  return result;
}

/**
 * Save curated fields on a draft
 */
export async function saveCuratedFields(
  draftId: string,
  fields: {
    curatedName: string | null;
    curatedDescription: string | null;
    curatedShortDescription: string | null;
    curatedCategory: string | null;
    curatedPrice: number | null;
    curatedCompareAtPrice: number | null;
    curatedImages: string[];
  }
) {
  await updateDraft(draftId, fields);
  revalidatePath("/admin/curation");
  revalidatePath(`/admin/curation/${draftId}`);
}

/**
 * Approve a draft
 */
export async function approveDraft(draftId: string) {
  await updateDraftStatus(draftId, "approved", { reviewedBy: "admin" });
  revalidatePath("/admin/curation");
  revalidatePath(`/admin/curation/${draftId}`);
}

/**
 * Reject a draft with reason
 */
export async function rejectDraft(draftId: string, rejectionReason: string) {
  await updateDraftStatus(draftId, "rejected", {
    rejectionReason,
    reviewedBy: "admin",
  });
  revalidatePath("/admin/curation");
  revalidatePath(`/admin/curation/${draftId}`);
}

/**
 * Set draft status back to in_review
 */
export async function setInReview(draftId: string) {
  await updateDraftStatus(draftId, "in_review");
  revalidatePath("/admin/curation");
  revalidatePath(`/admin/curation/${draftId}`);
}

/**
 * Reset a draft for re-translation
 */
export async function retranslate(draftId: string) {
  await updateDraft(draftId, {
    aiName: null,
    aiDescription: null,
    aiShortDescription: null,
    aiCategory: null,
    aiSuggestedPrice: null,
    aiModel: null,
    aiPromptVersion: null,
    translatedAt: null,
    translationError: null,
    status: "pending_translation" as DraftStatus,
  });
  revalidatePath("/admin/curation");
  revalidatePath(`/admin/curation/${draftId}`);
}

/**
 * Delete a draft permanently
 */
export async function removeDraft(draftId: string) {
  await deleteDraft(draftId);
  revalidatePath("/admin/curation");
}

/**
 * Get a single draft (for client refresh)
 */
export async function fetchDraft(draftId: string) {
  return getDraftById(draftId);
}
