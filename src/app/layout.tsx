import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

const Operator_Mono = localFont({
  src: "./../../public/OperatorMonoLig-Book.otf",
});

export const metadata: Metadata = {
  title: "Linuxing - Find Linux Commands",
  description:
    "Search for any tool, pick your Linux distribution, and copy the install command.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${Operator_Mono.className} min-h-screen flex flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 overflow-x-hidden">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
