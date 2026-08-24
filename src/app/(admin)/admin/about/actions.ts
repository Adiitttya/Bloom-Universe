"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { getWIBDate } from "@/lib/utils";

export interface AboutPillarData {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
  isVisible: boolean;
}

export interface AboutSectionFormData {
  title: string;
  description: string;
  pillars: AboutPillarData[];
}

export async function updateAboutSection(data: AboutSectionFormData) {
  const user = await requireAdminSession();
  const nowWIB = getWIBDate();

  // 1. Update siteContent for main about section
  const entries = [
    { key: "title", value: data.title.trim() },
    { key: "description", value: data.description.trim() },
  ];

  for (const entry of entries) {
    await db.siteContent.upsert({
      where: {
        section_key: {
          section: "about",
          key: entry.key,
        },
      },
      create: {
        section: "about",
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

  // 2. Update each AboutCard pillar
  for (const pillar of data.pillars) {
    await db.aboutCard.upsert({
      where: { id: pillar.id },
      create: {
        id: pillar.id,
        number: pillar.number,
        title: pillar.title.trim(),
        description: pillar.description.trim(),
        color: pillar.color || "blue",
        isVisible: pillar.isVisible,
        createdAt: nowWIB,
        updatedAt: nowWIB,
      },
      update: {
        number: pillar.number,
        title: pillar.title.trim(),
        description: pillar.description.trim(),
        color: pillar.color || "blue",
        isVisible: pillar.isVisible,
        updatedAt: nowWIB,
      },
    });
  }

  // Audit log
  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "UPDATE_ABOUT_SECTION",
      details: `Memperbarui konten About Section & ${data.pillars.length} Pilar`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/about");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}
