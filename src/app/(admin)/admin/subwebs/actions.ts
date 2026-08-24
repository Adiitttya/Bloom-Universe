"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { getWIBDate } from "@/lib/utils";

export async function updateSubWebCard(
  id: string,
  data: {
    title: string;
    description: string;
    href: string;
    badge?: string;
    isLive: boolean;
    isVisible: boolean;
  }
) {
  const user = await requireAdminSession();
  const nowWIB = getWIBDate();

  await db.subWebCard.update({
    where: { id },
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      href: data.href.trim(),
      badge: data.badge?.trim() || null,
      isLive: data.isLive,
      isVisible: data.isVisible,
      updatedAt: nowWIB,
    },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "UPDATE_SUBWEB_CARD",
      details: `Memperbarui kartu sub-web: ${data.title} (Live: ${data.isLive ? "Ya" : "Coming Soon"})`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/subwebs");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function toggleSubWebVisibility(id: string, isVisible: boolean) {
  const user = await requireAdminSession();
  const nowWIB = getWIBDate();

  await db.subWebCard.update({
    where: { id },
    data: {
      isVisible,
      updatedAt: nowWIB,
    },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "TOGGLE_SUBWEB_VISIBILITY",
      details: `Mengubah visibilitas sub-web ID ${id} menjadi ${isVisible ? "Tampil" : "Sembunyi"}`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/subwebs");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function toggleSubWebLive(id: string, isLive: boolean) {
  const user = await requireAdminSession();
  const nowWIB = getWIBDate();

  await db.subWebCard.update({
    where: { id },
    data: {
      isLive,
      badge: isLive ? "Live" : "Coming Soon",
      updatedAt: nowWIB,
    },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "TOGGLE_SUBWEB_LIVE",
      details: `Mengubah status live sub-web ID ${id} menjadi ${isLive ? "Live" : "Coming Soon"}`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/subwebs");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}
