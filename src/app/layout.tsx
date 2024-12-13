import ProgressBarProvider from "@/components/progress-bar";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FaithConnect",
  description: "Connect with fellow believers near you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <AuthProvider> */}
        <ProgressBarProvider>
          <QueryProvider>
            {/* <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
            > */}
            {children}
            <Toaster />
            {/* </ThemeProvider> */}
          </QueryProvider>
        </ProgressBarProvider>

        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
