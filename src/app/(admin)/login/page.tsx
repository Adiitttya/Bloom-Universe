"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/?login=true");
  }, [router]);

  return (
    <div className="font-heading flex min-h-screen items-center justify-center bg-[#2baee2] font-black text-white">
      Loading...
    </div>
  );
}
