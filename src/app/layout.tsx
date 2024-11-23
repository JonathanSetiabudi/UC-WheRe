import type { Metadata } from "next";
import { Jersey_25 } from "next/font/google";
import "./globals.css";

const jersey = Jersey_25({
  weight: "400",
  variable: "--font-jersey25",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UCR WheRe?",
  description: "A UCR locations guessing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jersey.variable} ${jersey.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
