import type { Metadata } from "next";
import "./globals.css";
import ScrollToTopOnLoad from "@/components/ScrollToTopOnLoad";

export const metadata: Metadata = {
  title: "LEAF Agency",
  description: "Advertising Made Simple.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=localStorage.getItem("leaf-theme");var prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=saved==="light"||saved==="dark"?saved:(prefersDark?"dark":"light");}catch(e){document.documentElement.dataset.theme="light";}})();`,
          }}
        />
      </head>
      <body>
        <ScrollToTopOnLoad />
        {children}
      </body>
    </html>
  );
}
