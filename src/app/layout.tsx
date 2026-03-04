import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";

const Operator_Mono = localFont({
  src: "./../../public/OperatorMonoLig-Book.otf",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Rosetta",
    default: "Rosetta - Find Linux Commands",
  },
  description:
    "Search for any tool, pick your Linux distribution, and copy the install command.",
  openGraph: {
    title: "Rosetta - Find Linux Commands",
    description:
      "Search for any tool, pick your Linux distribution, and copy the install command.",
    type: "website",
    locale: "en_US",
    url: "https://rosetta.linux",
    siteName: "Rosetta",
  },
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
          <Analytics />
          <SiteHeader />
          <main className="flex-1 overflow-x-hidden">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
