import "@src/styles/globals.css";

import { PWAInstaller } from "@src/components/PWAInstaller";
import { ThemeProvider } from "@src/components/ThemeProvider";
import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "PDF Imposer",
  description: "Organize e reordene páginas de PDF localmente",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PDF Imposer",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable}`} suppressHydrationWarning>
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme={false}>
          <PWAInstaller />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
