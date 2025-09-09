// app/api/cron/sync-retell/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  // Verify this is called by Vercel Cron (add your own auth if needed)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Call the sync endpoint
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/sync-retell`);
  const data = await response.json();
  
  return NextResponse.json(data);
}