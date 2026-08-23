import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import { auth } from "@/lib/auth";
import { LanguageWrapper } from "@/components/providers/LanguageWrapper";
import type { Locale } from "@/lib/i18n/dictionaries";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

function getMetadataBase(): URL {
  try {
    const rawUrl = SITE_CONFIG.url;
    if (
      rawUrl &&
      (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))
    ) {
      return new URL(rawUrl);
    }
    return new URL("https://bloom-universe.vercel.app");
  } catch {
    return new URL("https://bloom-universe.vercel.app");
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: `${SITE_CONFIG.name} | Official Community Portal`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Bloom Universe",
    "Bloomun",
    "Community",
    "Minecraft",
    "Photobooth",
    "Store",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: "/Bloom.jpg",
        width: 800,
        height: 800,
        alt: SITE_CONFIG.name,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("bloom_language")?.value;
  const initialLocale: Locale =
    rawLocale === "id" || rawLocale === "en" ? rawLocale : "id";

  return (
    <html
      lang={initialLocale}
      className={`${fredoka.variable} ${nunito.variable} scroll-smooth antialiased`}
    >
      <body className="flex min-h-screen flex-col font-sans selection:bg-[#ffc700] selection:text-[#452203]">
        <LanguageWrapper session={session} initialLocale={initialLocale}>
          {children}
        </LanguageWrapper>
      </body>
    </html>
  );
}
