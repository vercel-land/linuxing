import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
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
        className={`${Operator_Mono.className} min-h-full flex flex-col antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
