import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: "Cloud Intelligence Platform",
  description: "AI Powered Cloud Optimization & Forecasting",
  keywords: "AWS, cloud optimization, cost forecasting, sustainability",
  authors: [{ name: "CloudIntel" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0A1929",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-[#0A1929] text-gray-100">
        {/* Background Pattern - Subtle Grid */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMkQzQTVFIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-30 pointer-events-none"></div>

        {/* Floating Orbs - Subtle Background Glow */}
        <div className="fixed top-40 -left-20 w-96 h-96 bg-gradient-to-br from-[#2D3A5E]/20 to-[#4A6FA5]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-40 -right-20 w-96 h-96 bg-gradient-to-br from-[#4A6FA5]/20 to-[#5B7AB5]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Toast Container - For future notifications */}
        <div id="toast-container" className="fixed bottom-4 right-4 z-50"></div>
      </body>
    </html>
  );
}
