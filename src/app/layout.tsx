import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Park — an explorable 3D portfolio",
  description:
    "A third-person explorable 3D park that doubles as a professional portfolio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased overflow-hidden">
      <body className="h-full w-full overflow-hidden font-sans">{children}</body>
    </html>
  );
}
