"use server";

import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { getWIBDate } from "@/lib/utils";
import { getValidUserId } from "@/lib/activity-logger";

/**
 * Helper to safely extract UploadThing file key from a full URL.
 */
function extractUploadThingKey(url: string): string | null {
  if (!url) return null;
  if (url.includes("utfs.io/f/")) {
    return url.split("utfs.io/f/")[1]?.split("?")[0] || null;
  }
  if (url.includes("ufs.sh/f/")) {
    return url.split("ufs.sh/f/")[1]?.split("?")[0] || null;
  }
  if (url.includes("/f/")) {
    return url.split("/f/")[1]?.split("?")[0] || null;
  }
  return null;
}

/**
 * Creates a new gallery image in database.
 */
export async function createGalleryImage(data: {
  url: string;
  alt?: string;
  caption?: string;
  isVisible?: boolean;
}) {
  const user = await requireAdminSession();

  if (!data.url || !data.url.trim()) {
    return { success: false, error: "URL gambar tidak boleh kosong." };
  }

  const cleanUrl = data.url.trim();
  const cleanAlt = data.alt?.trim() || "Bloom Gallery Photo";
  const nowWIB = getWIBDate();

  try {
    const existing = await db.galleryImage.findFirst({
      where: { url: cleanUrl },
    });

    if (existing) {
      return { success: true, image: existing };
    }

    const count = await db.galleryImage.count();

    const newImage = await db.galleryImage.create({
      data: {
        url: cleanUrl,
        alt: cleanAlt,
        caption: data.caption?.trim() || cleanAlt,
        order: count,
        isVisible: data.isVisible ?? true,
        createdAt: nowWIB,
        updatedAt: nowWIB,
      },
    });

    try {
      const validUserId = await getValidUserId(user.id);
      await db.adminLog.create({
        data: {
          userId: validUserId,
          action: "UPLOAD_GALLERY_IMAGE",
          details: `Menambahkan foto galeri: ${cleanAlt}`,
          createdAt: nowWIB,
          updatedAt: nowWIB,
        },
      });
    } catch (auditErr) {
      console.warn("Activity log skipped:", auditErr);
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, image: newImage };
  } catch (error) {
    console.error("Failed to create gallery image:", error);
    return { success: false, error: "Gagal menyimpan foto ke database." };
  }
}

/**
 * Deletes a gallery image:
 * - Deletes the physical file from UploadThing Cloud Storage.
 * - Deletes the record from PostgreSQL database.
 */
export async function deleteGalleryImage(id: string) {
  const user = await requireAdminSession();

  const image = await db.galleryImage.findUnique({
    where: { id },
  });

  if (!image) return { success: false, error: "Foto tidak ditemukan." };

  // 1. Delete file from UploadThing Cloud Storage if it belongs to UploadThing
  const fileKey = extractUploadThingKey(image.url);
  if (fileKey) {
    try {
      const token =
        process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET;
      const utapi = new UTApi({ token });
      await utapi.deleteFiles(fileKey);
    } catch (utErr) {
      console.warn("UploadThing delete error:", utErr);
    }
  }

  // 2. Delete record from database
  await db.galleryImage.delete({
    where: { id },
  });

  // 3. Record audit log
  try {
    const validUserId = await getValidUserId(user.id);
    await db.adminLog.create({
      data: {
        userId: validUserId,
        action: "DELETE_GALLERY_IMAGE",
        details: `Menghapus foto galeri: ${image.alt} (${image.url})`,
        createdAt: getWIBDate(),
        updatedAt: getWIBDate(),
      },
    });
  } catch (auditErr) {
    console.warn("Activity log skipped:", auditErr);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

/**
 * Toggles visibility of a gallery image.
 */
export async function toggleGalleryVisibility(id: string, isVisible: boolean) {
  const user = await requireAdminSession();

  await db.galleryImage.update({
    where: { id },
    data: {
      isVisible,
      updatedAt: getWIBDate(),
    },
  });

  try {
    const validUserId = await getValidUserId(user.id);
    await db.adminLog.create({
      data: {
        userId: validUserId,
        action: "TOGGLE_GALLERY_VISIBILITY",
        details: `Mengubah status visibilitas foto ID ${id} menjadi ${isVisible ? "Aktif" : "Sembunyi"}`,
        createdAt: getWIBDate(),
        updatedAt: getWIBDate(),
      },
    });
  } catch (auditErr) {
    console.warn("Activity log skipped:", auditErr);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

/**
 * Updates the title/alt text of a gallery image.
 */
export async function updateGalleryImageAlt(id: string, alt: string) {
  const user = await requireAdminSession();

  await db.galleryImage.update({
    where: { id },
    data: {
      alt,
      caption: alt,
      updatedAt: getWIBDate(),
    },
  });

  try {
    const validUserId = await getValidUserId(user.id);
    await db.adminLog.create({
      data: {
        userId: validUserId,
        action: "UPDATE_GALLERY_IMAGE",
        details: `Memperbarui judul foto ID ${id} menjadi: ${alt}`,
        createdAt: getWIBDate(),
        updatedAt: getWIBDate(),
      },
    });
  } catch (auditErr) {
    console.warn("Activity log skipped:", auditErr);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
