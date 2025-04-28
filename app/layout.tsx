import type React from "react";
import "./globals.css";

// The root layout must include <html> and <body> tags
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
