"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { getWIBDate } from "@/lib/utils";

export async function createAnnouncement(data: {
  message: string;
  linkText?: string;
  linkUrl?: string;
  isActive: boolean;
}) {
  const user = await requireAdminSession();
  const nowWIB = getWIBDate();

  // If new announcement is active, set other announcements to inactive (since only 1 top banner is shown)
  if (data.isActive) {
    await db.announcement.updateMany({
      data: { isActive: false, updatedAt: nowWIB },
    });
  }

  const announcement = await db.announcement.create({
    data: {
      message: data.message.trim(),
      linkText: data.linkText?.trim() || null,
      linkUrl: data.linkUrl?.trim() || null,
      isActive: data.isActive,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "CREATE_ANNOUNCEMENT",
      details: `Membuat pengumuman baru: "${data.message.substring(0, 30)}..." (${data.isActive ? "Aktif" : "Nonaktif"})`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true, announcement };
}

export async function toggleAnnouncementActive(id: string, isActive: boolean) {
  const user = await requireAdminSession();
  const nowWIB = getWIBDate();

  if (isActive) {
    // Deactivate others
    await db.announcement.updateMany({
      where: { id: { not: id } },
      data: { isActive: false, updatedAt: nowWIB },
    });
  }

  await db.announcement.update({
    where: { id },
    data: {
      isActive,
      updatedAt: nowWIB,
    },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "TOGGLE_ANNOUNCEMENT",
      details: `Mengubah status pengumuman ID ${id} menjadi ${isActive ? "Aktif" : "Nonaktif"}`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function updateAnnouncement(
  id: string,
  data: {
    message: string;
    linkText?: string;
    linkUrl?: string;
  }
) {
  const user = await requireAdminSession();
  const nowWIB = getWIBDate();

  await db.announcement.update({
    where: { id },
    data: {
      message: data.message.trim(),
      linkText: data.linkText?.trim() || null,
      linkUrl: data.linkUrl?.trim() || null,
      updatedAt: nowWIB,
    },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "UPDATE_ANNOUNCEMENT",
      details: `Memperbarui teks pengumuman ID ${id}`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function deleteAnnouncement(id: string) {
  const user = await requireAdminSession();
  const nowWIB = getWIBDate();

  const existing = await db.announcement.findUnique({
    where: { id },
  });

  if (!existing) {
    return { success: false, error: "Pengumuman tidak ditemukan." };
  }

  await db.announcement.delete({
    where: { id },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "DELETE_ANNOUNCEMENT",
      details: `Menghapus pengumuman: "${existing.message.substring(0, 30)}..."`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}
