import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { checkIsAdmin } from "@/lib/auth/admin-guard";
import { getWIBDate } from "@/lib/utils";
import { revalidatePath } from "next/cache";

import { getValidUserId } from "@/lib/activity-logger";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || !(await checkIsAdmin(session.user))) {
      return NextResponse.json(
        {
          success: false,
          error: "Hanya Administrator yang memiliki izin mengunggah gambar.",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const titles = formData.getAll("titles") as string[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang dipilih." },
        { status: 400 }
      );
    }

    const createdImages = [];
    const nowWIB = getWIBDate();
    let count = await db.galleryImage.count();

    // Safe user ID lookup for activity log
    const validUserId = await getValidUserId(session.user.id);

    // Initialize UTApi with token
    const token =
      process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET;
    const utapi = new UTApi({ token });

    // Upload to UploadThing Cloud
    const utResponses = await utapi.uploadFiles(files);
    const responsesArray = Array.isArray(utResponses)
      ? utResponses
      : [utResponses];

    for (let i = 0; i < responsesArray.length; i++) {
      const res = responsesArray[i];
      if (res.error) {
        console.error("UploadThing Error:", res.error);
        return NextResponse.json(
          { success: false, error: `UploadThing: ${res.error.message}` },
          { status: 500 }
        );
      }

      if (res?.data) {
        const finalUrl =
          (res.data as unknown as { ufsUrl?: string })?.ufsUrl || res.data.url;

        if (finalUrl) {
          const defaultName = files[i]?.name
            ? files[i].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
            : "Bloom Gallery Photo";
          const finalTitle = titles[i]?.trim() || defaultName;

          const newImage = await db.galleryImage.create({
            data: {
              url: finalUrl,
              alt: finalTitle,
              caption: finalTitle,
              order: count++,
              isVisible: true,
              createdAt: nowWIB,
              updatedAt: nowWIB,
            },
          });

          createdImages.push(newImage);

          try {
            await db.adminLog.create({
              data: {
                userId: validUserId,
                action: "UPLOAD_GALLERY_IMAGE",
                details: `Mengunggah foto ke Uploadthing: ${finalTitle}`,
                createdAt: nowWIB,
                updatedAt: nowWIB,
              },
            });
          } catch (logErr) {
            console.warn("Failed to write audit log:", logErr);
          }
        }
      }
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/admin");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      images: createdImages,
    });
  } catch (error: unknown) {
    console.error("Upload API error:", error);
    const msg =
      error instanceof Error
        ? error.message
        : "Gagal memproses unggahan ke Uploadthing.";
    return NextResponse.json(
      { success: false, error: `UploadThing: ${msg}` },
      { status: 500 }
    );
  }
}
