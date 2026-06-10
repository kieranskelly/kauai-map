import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kauaʻi — Group Trip Map",
  description:
    "An interactive 3D map of Kauaʻi. Explore the best beaches, hikes, viewpoints, waterfalls and eats — then vote and comment with your group.",
};

// Viewport must be exported from a Server Component (this layout). We disable
// user scaling so pinch gestures drive the 3D map's zoom instead of the page,
// and use viewport-fit: cover so the canvas fills the iOS notch/safe areas.
export const viewport: Viewport = {
  themeColor: "#0b1d2a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden overscroll-none bg-[#0b1d2a] text-white">
        {children}
      </body>
    </html>
  );
}
