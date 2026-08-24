"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { getWIBDate, isValidExternalUrl } from "@/lib/utils";

export async function updateSocialLink(
  id: string,
  data: {
    platform: string;
    name: string;
    url: string;
    handle?: string;
    isVisible: boolean;
  }
) {
  const user = await requireAdminSession();

  // Validate URL is safe protocol only (prevent javascript: XSS)
  if (!isValidExternalUrl(data.url)) {
    return {
      success: false,
      error: "Format URL tidak valid. Gunakan http:// atau https://.",
    };
  }
  const nowWIB = getWIBDate();

  await db.socialLink.update({
    where: { id },
    data: {
      platform: (data.platform || "unknown").toLowerCase().trim(),
      name: data.name.trim(),
      url: data.url.trim(),
      handle: data.handle?.trim() || null,
      isVisible: data.isVisible,
      updatedAt: nowWIB,
    },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "UPDATE_SOCIAL_LINK",
      details: `Memperbarui link media sosial: ${data.name} (Platform: ${data.platform})`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/socials");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function createSocialLink(data: {
  platform: string;
  name: string;
  url: string;
  handle?: string;
  isVisible: boolean;
}) {
  const user = await requireAdminSession();

  // Validate URL is safe protocol only (prevent javascript: XSS)
  if (!isValidExternalUrl(data.url)) {
    return {
      success: false,
      error: "Format URL tidak valid. Gunakan http:// atau https://.",
    };
  }
  const nowWIB = getWIBDate();

  const count = await db.socialLink.count();

  const created = await db.socialLink.create({
    data: {
      platform: (data.platform || "unknown").toLowerCase().trim(),
      name: data.name.trim(),
      url: data.url.trim(),
      handle: data.handle?.trim() || null,
      isVisible: data.isVisible,
      order: count,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "CREATE_SOCIAL_LINK",
      details: `Menambahkan platform media sosial: ${data.name} (${data.platform})`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/socials");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true, link: created };
}

export async function toggleSocialVisibility(id: string, isVisible: boolean) {
  const user = await requireAdminSession();
  const nowWIB = getWIBDate();

  await db.socialLink.update({
    where: { id },
    data: {
      isVisible,
      updatedAt: nowWIB,
    },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "TOGGLE_SOCIAL_VISIBILITY",
      details: `Mengubah visibilitas media sosial ID ${id} menjadi ${isVisible ? "Aktif" : "Sembunyi"}`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/socials");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function deleteSocialLink(id: string) {
  const user = await requireAdminSession();
  const nowWIB = getWIBDate();

  const existing = await db.socialLink.findUnique({
    where: { id },
  });

  if (!existing) {
    return { success: false, error: "Link media sosial tidak ditemukan." };
  }

  await db.socialLink.delete({
    where: { id },
  });

  await db.adminLog.create({
    data: {
      userId: user.id,
      action: "DELETE_SOCIAL_LINK",
      details: `Menghapus media sosial: ${existing.name}`,
      createdAt: nowWIB,
      updatedAt: nowWIB,
    },
  });

  revalidatePath("/admin/socials");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}
