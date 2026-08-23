import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#2baee2] px-4 py-12">
      <Card className="relative w-full max-w-md rounded-[2.5rem] border-4 border-white bg-white p-8 text-center shadow-[0_14px_0_#1b8ebc,0_25px_40px_rgba(0,0,0,0.15)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-[#2baee2] bg-[#e0f4fc] text-[#2baee2] shadow-[0_4px_0_#2baee2]">
          <Compass className="h-8 w-8" />
        </div>

        <span className="font-heading text-xs font-black tracking-widest text-[#2baee2] uppercase">
          404 Not Found
        </span>

        <h1 className="font-heading mt-2 text-3xl font-black text-[#1e1b4b]">
          Lost in the Universe?
        </h1>

        <p className="mt-3 text-sm leading-relaxed font-semibold text-slate-600">
          The portal you are looking for doesn&apos;t exist or has traveled to
          another galaxy.
        </p>

        <div className="mt-8">
          <Link href="/" className="block w-full">
            <Button
              variant="yellow"
              size="md"
              className="w-full gap-2 py-3.5 text-sm font-black"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to {SITE_CONFIG.shortName}</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
