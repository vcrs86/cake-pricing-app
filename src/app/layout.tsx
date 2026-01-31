import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ProActivation } from "@/components/ProActivation";
import { ProProvider } from "@/lib/pro";

console.log("🔥 ROOT LAYOUT RENDERED");

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CakePrice",
  description:
    "Professional cake pricing calculator for decorators who work with real costs.",
  manifest: "/manifest.json",
  themeColor: "#CCB3C0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CakePrice",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="es">
    <body className={inter.className}>
      <ProProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ProProvider>
      <script
  dangerouslySetInnerHTML={{
    __html: `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js');
        });
      }
    `,
  }}
/>
    </body>
  </html>
);
}
