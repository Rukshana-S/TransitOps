import { Mulish, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/providers/Providers';

const mulish = Mulish({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  title: "TransitOps Admin",
  description: "Premium transport management dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${mulish.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#060910] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
