import { db } from "@/lib/db";
import { GalleryManager } from "./GalleryManager";

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const images = await db.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-[#1e1b4b] sm:text-3xl">
          Kelola Galeri Komunitas
        </h1>
        <p className="mt-1 text-sm font-bold text-slate-500">
          Upload foto kegiatan dan event komunitas ke Uploadthing Cloud Storage.
        </p>
      </div>

      <GalleryManager initialImages={images} />
    </div>
  );
}
