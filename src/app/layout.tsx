import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heptome - Professional Home Services",
  description: "Get professional home services at your doorstep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Context<any> | React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full antialiased font-sans bg-white text-[#1A1A2E]">
        {children}
      </body>
    </html>
  );
}
