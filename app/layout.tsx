import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import NavBar from "../components/NavBar";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ApolloWrapper } from "./ApolloWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlfaFrens Channel Hunter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-darkBg">
        <ApolloWrapper>
          <NavBar />
          <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
        </ApolloWrapper>
      </body>
    </html>
  );
}
