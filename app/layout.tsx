// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import PhoneSelector from "./components/PhoneSelector";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Route - AI Voice Assistant",
  description: "Never miss a customer call again. Our AI handles appointments, inquiries, and support 24/7 for any business.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SignedIn>
            <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
              <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-8">
                    <Link href="/dashboard" className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
                      Route
                    </Link>
                    <nav className="flex space-x-6">
                      <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                        Dashboard
                      </Link>
                      <Link href="/calls" className="text-gray-300 hover:text-white transition-colors">
                        All Calls
                      </Link>
                    </nav>
                  </div>
                  <div className="flex items-center space-x-4">
                    <PhoneSelector />
                    <UserButton 
                      afterSignOutUrl="/sign-in"
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8"
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </header>
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}