import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import NavBar from "../components/NavBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlfaFrens Channel Hunter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isHomePage =
    typeof window !== "undefined" && window.location.pathname === "/";

  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        {!isHomePage && <NavBar />}
        <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
      </body>
    </html>
  );
}
