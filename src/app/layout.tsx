import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VersionDock } from "@/components/ui/VersionDock";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Genius Lab Technology | Data into intelligence",
  description:
    "Genius Lab engineers the pipelines, models and AI that turn scattered business data into decisions.",
};

export const viewport: Viewport = {
  themeColor: "#f1f3f4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${geistMono.variable} antialiased`}>
      <head>
        {/* Marks the document as scripted so reveal styles only apply when JS can undo them. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        {children}
        <VersionDock />
      </body>
    </html>
  );
}
