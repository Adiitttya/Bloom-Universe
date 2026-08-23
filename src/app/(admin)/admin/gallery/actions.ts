"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getWIBDate } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Hanya Admin yang dapat melakukan aksi ini.");
  }
  return session.user;
}

export async function deleteGalleryImage(id: string) {
  const user = await requireAdmin();

  const image = await db.galleryImage.findUnique({
    where: { id },
  });

  if (!image) return { success: false, error: "Foto tidak ditemukan." };

  await db.galleryImage.delete({
    where: { id },
  });

  // Record audit log
  await db.activityLog.create({
    data: {
      userId: user.id,
      action: "DELETE_GALLERY_IMAGE",
      details: `Menghapus foto galeri: ${image.alt} (${image.url})`,
      createdAt: getWIBDate(),
      updatedAt: getWIBDate(),
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function toggleGalleryVisibility(id: string, isVisible: boolean) {
  const user = await requireAdmin();

  await db.galleryImage.update({
    where: { id },
    data: {
      isVisible,
      updatedAt: getWIBDate(),
    },
  });

  await db.activityLog.create({
    data: {
      userId: user.id,
      action: "TOGGLE_GALLERY_VISIBILITY",
      details: `Mengubah status visibilitas foto ID ${id} menjadi ${isVisible ? "Aktif" : "Sembunyi"}`,
      createdAt: getWIBDate(),
      updatedAt: getWIBDate(),
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function updateGalleryImageAlt(id: string, alt: string) {
  const user = await requireAdmin();

  await db.galleryImage.update({
    where: { id },
    data: {
      alt,
      caption: alt,
      updatedAt: getWIBDate(),
    },
  });

  await db.activityLog.create({
    data: {
      userId: user.id,
      action: "UPDATE_GALLERY_IMAGE",
      details: `Memperbarui judul foto ID ${id} menjadi: ${alt}`,
      createdAt: getWIBDate(),
      updatedAt: getWIBDate(),
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true };
}
