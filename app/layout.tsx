import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goal-Based Savings Planner",
  description: "Track your financial goals and savings progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>  
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
