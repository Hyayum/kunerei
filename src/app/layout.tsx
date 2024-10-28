import type { Metadata } from "next";

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
        {children}
      </body>
    </html>
  );
}
