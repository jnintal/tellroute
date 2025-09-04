"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-gray-800/50 backdrop-blur-lg border border-gray-700",
          }
        }}
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}