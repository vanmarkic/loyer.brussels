import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loyer Brussels - Brussels Rent Calculator",
  description: "Calculate fair rent for Brussels properties based on the rent grid system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
