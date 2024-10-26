import type { Metadata } from "next";
import ClientLayout from "@/app/layout-client";

export const metadata: Metadata = {
  title: "てぃみ*れの / みるふぃ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
