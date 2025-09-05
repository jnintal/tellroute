// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

// Simplest version - Clerk handles everything automatically
export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};