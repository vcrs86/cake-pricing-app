import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ProActivation } from "@/components/ProActivation";
import { ProProvider } from "@/lib/pro";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cake Pricing Calculator",
  description:
    "Mobile-friendly calculator that helps cake decorators price custom cakes confidently.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <LanguageProvider>
  <ProProvider>
    {children}
  </ProProvider>
</LanguageProvider>

      </body>
    </html>
  );
}

