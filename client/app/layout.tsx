import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | Maghora Flavoured Makhana",
    default: "Maghora | Premium Flavoured Makhana Roasted in Olive Oil",
  },
  description:
    "Indulge in Maghora's artisanal flavoured makhana (foxnuts). Slow roasted in pure olive oil with handcrafted gourmet Indian seasonings. 100% vegetarian, gluten-free, healthy snacking.",
  keywords: [
    "makhana",
    "flavoured makhana",
    "roasted foxnuts",
    "healthy snacks",
    "olive oil makhana",
    "Maghora",
    "gourmet snacks",
    "gluten free snacks",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Maghora | Premium Flavoured Makhana",
    description: "Slow roasted in pure olive oil. Gourmet snacking reinvented.",
    siteName: "Maghora",
    images: [
      {
        url: "/Magnora.png",
        width: 1200,
        height: 630,
        alt: "Maghora Premium Makhana",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent/20 selection:text-accent-hover font-sans">
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: "1rem",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
