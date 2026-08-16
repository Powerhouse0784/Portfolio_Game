import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Park — an explorable 3D portfolio",
  description:
    "A third-person explorable 3D park that doubles as a professional portfolio.",
};

// Disables pinch-zoom and double-tap-zoom on mobile — without this, those browser
// gestures fight with the virtual joystick and camera drag/pinch-zoom controls.
// Standard practice for a touch-controlled canvas experience.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased overflow-hidden">
      <body className="h-full w-full overflow-hidden font-sans">{children}</body>
    </html>
  );
}
