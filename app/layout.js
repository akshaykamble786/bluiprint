import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { twMerge } from 'tailwind-merge';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bluiprint",
  description: "UI Generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={twMerge('bg-background', inter.className)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
