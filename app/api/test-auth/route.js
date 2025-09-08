// app/api/test-auth/route.js
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId, sessionClaims } = await auth();
  
  return Response.json({
    userId,
    sessionClaims,
    env: {
      hasPublicKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasSecretKey: !!process.env.CLERK_SECRET_KEY,
    }
  });
}