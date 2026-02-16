import { SplashScreen } from "@/components/SplashScreen";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ProProvider } from "@/lib/pro";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CakePrice",
  description:
    "Professional cake pricing calculator for decorators who work with real costs.",
  manifest: "/manifest.json",
  themeColor: "#CCB3C0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
            <SplashScreen />

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
