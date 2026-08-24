"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { getWIBDate, isValidExternalUrl } from "@/lib/utils";

export interface HeroFormData {
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
}

export async function updateHeroContent(data: HeroFormData) {
  const user = await requireAdminSession();

  // Validate URLs are safe protocols only (prevent javascript: XSS)
  if (!isValidExternalUrl(data.primaryCtaUrl)) {
    return {
      success: false,
      error:
        "Format URL tombol utama tidak valid. Gunakan http:// atau https://.",
    };
  }
  if (!isValidExternalUrl(data.secondaryCtaUrl)) {
    return {
      success: false,
      error:
        "Format URL tombol sekunder tidak valid. Gunakan http:// atau https://.",
    };
  }

  const nowWIB = getWIBDate();
  const entries = [
    { key: "title", value: data.title.trim() },
    { key: "subtitle", value: data.subtitle.trim() },
    { key: "primaryCtaText", value: data.primaryCtaText.trim() },
    { key: "primaryCtaUrl", value: data.primaryCtaUrl.trim() },
    { key: "secondaryCtaText", value: data.secondaryCtaText.trim() },
    { key: "secondaryCtaUrl", value: data.secondaryCtaUrl.trim() },
  ];

  for (const entry of entries) {
    await db.siteContent.upsert({
      where: {
        section_key: {
          section: "hero",
          key: entry.key,
        },
      },
      create: {
        section: "hero",
        key: entry.key,
        value: entry.value,
        updatedBy: user.id,
        createdAt: nowWIB,
        updatedAt: nowWIB,
      },
      update: {
        value: entry.value,
        updatedBy: user.id,
        updatedAt: nowWIB,
      },
    });
  }

  // Audit log
  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "UPDATE_HERO_CONTENT",
      details: `Memperbarui konten Hero Section: "${data.title.substring(0, 30)}..."`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}
