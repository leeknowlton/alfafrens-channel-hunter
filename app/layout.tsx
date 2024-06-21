import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar"; // Adjust the path as necessary
import PrivyProviderWrapper from "../components/PrivyProviderWrapper"; // Import the new wrapper

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
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <PrivyProviderWrapper>
          {" "}
          {/* Wrap with the PrivyProviderWrapper */}
          <NavBar />
          {children}
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
