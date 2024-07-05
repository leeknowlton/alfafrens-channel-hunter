import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import NavBar from "../components/NavBar"; // Adjust the path as necessary
import PrivyProviderWrapper from "../components/PrivyProviderWrapper"; // Import the new wrapper
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ApolloWrapper } from "./ApolloWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AlfaFrens Channel Hunt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-darkBg">
        <PrivyProviderWrapper>
          <ApolloWrapper>
            <NavBar />
            <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
          </ApolloWrapper>
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
