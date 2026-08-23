import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
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
      if (!session?.user || session.user.role !== "ADMIN") {
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
      console.log("Upload completed by:", metadata.username);
      console.log("Uploaded file URL:", file.ufsUrl || file.url);

      const fileUrl = file.ufsUrl || file.url;
      const fileName = file.name
        ? file.name.replace(/\.[^/.]+$/, "")
        : "Bloom Gallery";
      const cleanAlt = fileName.replace(/[-_]/g, " ");

      try {
        // Count existing images to set the next order index
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
        await db.activityLog.create({
          data: {
            userId: metadata.userId,
            action: "UPLOAD_GALLERY_IMAGE",
            details: `Uploaded new gallery photo: ${cleanAlt} (${fileUrl})`,
            createdAt: nowWIB,
            updatedAt: nowWIB,
          },
        });

        return { id: newImage.id, url: newImage.url };
      } catch (error) {
        console.error("Failed to save uploaded image to database:", error);
        return { url: fileUrl };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
