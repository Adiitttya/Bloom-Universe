import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { checkIsAdmin } from "@/lib/auth/admin-guard";
import { db } from "@/lib/db";
import { getWIBDate } from "@/lib/utils";

const f = createUploadthing();

export const ourFileRouter = {
  galleryImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 6,
    },
  })
    .middleware(async () => {
      const session = await auth();

      // Ensure only authorized ADMIN users can upload images
      if (!session?.user || !checkIsAdmin(session.user)) {
        throw new UploadThingError(
          "Hanya Administrator yang memiliki izin untuk mengunggah gambar."
        );
      }

      return {
        userId: session.user.id,
        username: session.user.username || "admin",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl =
        (file as unknown as { ufsUrl?: string; appUrl?: string }).ufsUrl ||
        file.url ||
        (file as unknown as { appUrl?: string }).appUrl ||
        "";

      if (!fileUrl) {
        console.error("No file URL returned from uploadthing");
        return;
      }

      const fileName = file.name
        ? file.name.replace(/\.[^/.]+$/, "")
        : "Bloom Gallery";
      const cleanAlt = fileName.replace(/[-_]/g, " ");

      try {
        // Prevent duplicate record if client already registered it
        const existing = await db.galleryImage.findFirst({
          where: { url: fileUrl },
        });

        if (!existing) {
          const count = await db.galleryImage.count();
          const nowWIB = getWIBDate();

          const newImage = await db.galleryImage.create({
            data: {
              url: fileUrl,
              alt: cleanAlt,
              caption: cleanAlt,
              order: count,
              isVisible: true,
              createdAt: nowWIB,
              updatedAt: nowWIB,
            },
          });

          // Record audit log
          await db.adminLog.create({
            data: {
              userId: metadata.userId,
              action: "UPLOAD_GALLERY_IMAGE",
              details: `Mengunggah foto galeri baru: ${cleanAlt}`,
              createdAt: nowWIB,
              updatedAt: nowWIB,
            },
          });

          return { id: newImage.id, url: newImage.url };
        }

        return { id: existing.id, url: existing.url };
      } catch (error) {
        console.error("Failed to save uploaded image to database:", error);
        return { url: fileUrl };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
