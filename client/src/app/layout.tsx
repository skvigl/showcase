import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import { roboto } from "@/fonts";
import { Layout } from "@/components/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`overflow-y-scroll bg-gray-50 ${roboto.className} antialiased `}>
        <Layout>{children}</Layout>
      </body>
      {process.env.NEXT_PUBLIC_GOOGLE_TAG && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_TAG} />}
    </html>
  );
}
