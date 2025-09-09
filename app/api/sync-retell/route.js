import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Sync endpoint is working',
    timestamp: new Date().toISOString(),
    method: 'GET'
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Sync endpoint is working', 
    timestamp: new Date().toISOString(),
    method: 'POST'
  });
}
// Deployment trigger Tue Sep  9 12:21:11 EDT 2025
// Deployment test
