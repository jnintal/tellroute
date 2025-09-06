// app/api/calls/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Replace with actual database query
    // For now, returning mock data
    const mockData = {
      totalCalls: 156,
      avgDuration: '3:45',
      missedCalls: 12,
      recentCalls: [
        {
          id: '1',
          date: '2024-01-15',
          time: '10:30 AM',
          duration: '5:23',
          from: '+1234567890',
          to: '+0987654321',
          status: 'completed',
          recording: '/recordings/call-1.mp3'
        },
        {
          id: '2',
          date: '2024-01-15',
          time: '11:45 AM',
          duration: '2:15',
          from: '+1234567891',
          to: '+0987654322',
          status: 'missed'
        },
        {
          id: '3',
          date: '2024-01-15',
          time: '2:30 PM',
          duration: '8:45',
          from: '+1234567892',
          to: '+0987654323',
          status: 'completed',
          recording: '/recordings/call-3.mp3'
        },
        {
          id: '4',
          date: '2024-01-14',
          time: '4:15 PM',
          duration: '1:30',
          from: '+1234567893',
          to: '+0987654324',
          status: 'completed'
        },
        {
          id: '5',
          date: '2024-01-14',
          time: '5:00 PM',
          duration: '0:45',
          from: '+1234567894',
          to: '+0987654325',
          status: 'missed'
        }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error in /api/calls:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}