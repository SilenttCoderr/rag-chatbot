import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RAG Assistant",
  description: "Ask your PDFs anything!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <main className="max-w-2xl mx-auto mt-10">{children}</main>
      </body>
    </html>
  );
}
