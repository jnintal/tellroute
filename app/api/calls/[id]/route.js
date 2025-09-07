// app/api/calls/[id]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Mock call data - in production this would fetch from database
    const mockCalls = {
      '1': {
        id: '1',
        call_id: 'call_001',
        direction: 'Inbound',
        phoneNumber: '+18086512711',
        date: '01-15-2024',
        time: '10:05:38 PM',
        duration: '00:03',
        status: 'completed',
        summary: 'The call was brief and appears to have ended abruptly with the user indicating that it concludes. There was no significant interaction or resolution of issues during the call.',
        sentiment: 'Neutral',
        transcript: [
          { speaker: 'AI', text: 'Thank you for calling. How can I help you today?', timestamp: '00:00' },
          { speaker: 'Customer', text: 'Actually, never mind.', timestamp: '00:02' },
          { speaker: 'AI', text: 'Is there anything else I can help you with?', timestamp: '00:03' },
          { speaker: 'Customer', text: 'No, goodbye.', timestamp: '00:03' }
        ],
        actionItems: [],
        recording_url: null
      },
      '2': {
        id: '2',
        call_id: 'call_002',
        direction: 'Inbound',
        phoneNumber: '+13107406556',
        date: '01-15-2024',
        time: '9:08:03 PM',
        duration: '00:35',
        status: 'completed',
        summary: 'The user inquired about a dinner reservation for five people at Little Fatty, but the AI agent informed them that reservations cannot be made over the phone and offered to send a link for online reservations, which the user declined.',
        sentiment: 'Neutral',
        transcript: [
          { speaker: 'AI', text: 'Thank you for calling Little Fatty. How can I help you today?', timestamp: '00:00' },
          { speaker: 'Customer', text: 'Hi, I would like to make a dinner reservation for tonight.', timestamp: '00:03' },
          { speaker: 'AI', text: 'I understand you would like to make a reservation. Unfortunately, I cannot make reservations over the phone, but I can send you a link to our online reservation system. Would you like me to send that to you?', timestamp: '00:08' },
          { speaker: 'Customer', text: 'How many people will be in your party?', timestamp: '00:18' },
          { speaker: 'AI', text: 'I understand you are asking about your party size. To make a reservation, you will need to use our online system. Would you like me to send you the link?', timestamp: '00:22' },
          { speaker: 'Customer', text: 'There will be five of us.', timestamp: '00:28' },
          { speaker: 'AI', text: 'Perfect, a party of five. I can send you the link to make your reservation online. Would you like me to text it to you?', timestamp: '00:31' },
          { speaker: 'Customer', text: 'No, that\'s okay. Thank you.', timestamp: '00:34' },
          { speaker: 'AI', text: 'You\'re welcome! Have a great day!', timestamp: '00:35' }
        ],
        actionItems: [
          'Customer declined online reservation link',
          'Party size: 5 people',
          'Requested same-day reservation'
        ],
        recording_url: null
      },
      '3': {
        id: '3',
        call_id: 'call_003',
        direction: 'Inbound',
        phoneNumber: '+16619930444',
        date: '01-15-2024',
        time: '8:48:29 PM',
        duration: '00:27',
        status: 'transferred',
        summary: 'The user requested to speak with a representative, and the AI agent successfully transferred the call to a representative after confirming the request.',
        sentiment: 'Neutral',
        transcript: [
          { speaker: 'AI', text: 'Thank you for calling. How can I help you today?', timestamp: '00:00' },
          { speaker: 'Customer', text: 'I need to speak with someone.', timestamp: '00:03' },
          { speaker: 'AI', text: 'I understand you would like to speak with a representative. Let me transfer you right away.', timestamp: '00:07' },
          { speaker: 'Customer', text: 'Yes, please.', timestamp: '00:12' },
          { speaker: 'AI', text: 'Transferring you now. Please stay on the line.', timestamp: '00:15' },
          { speaker: 'System', text: 'Call transferred to representative.', timestamp: '00:27' }
        ],
        actionItems: [
          'Call successfully transferred to human representative'
        ],
        recording_url: null
      },
      '4': {
        id: '4',
        call_id: 'call_004',
        direction: 'Inbound',
        phoneNumber: '+15126572638',
        date: '01-15-2024',
        time: '8:24:41 PM',
        duration: '00:57',
        status: 'transferred',
        summary: 'The user inquired about whether any food at Little Fatty contains MSG. The AI agent was unable to provide that information and successfully transferred the user to a restaurant representative for further assistance.',
        sentiment: 'Positive',
        transcript: [
          { speaker: 'AI', text: 'Thank you for calling Little Fatty. How can I help you today?', timestamp: '00:00' },
          { speaker: 'Customer', text: 'Hi, I have a question about your food.', timestamp: '00:03' },
          { speaker: 'AI', text: 'Of course! I\'d be happy to help. What would you like to know?', timestamp: '00:07' },
          { speaker: 'Customer', text: 'Does any of your food contain MSG?', timestamp: '00:12' },
          { speaker: 'AI', text: 'That\'s an important dietary question. I don\'t have specific information about MSG in our dishes. Let me transfer you to someone who can provide accurate information about our ingredients.', timestamp: '00:18' },
          { speaker: 'Customer', text: 'That would be great, thank you.', timestamp: '00:28' },
          { speaker: 'AI', text: 'You\'re welcome! Transferring you now.', timestamp: '00:32' },
          { speaker: 'System', text: 'Call transferred to restaurant staff.', timestamp: '00:57' }
        ],
        actionItems: [
          'Customer inquired about MSG in food',
          'Transferred to staff for ingredient information'
        ],
        recording_url: null
      },
      '5': {
        id: '5',
        call_id: 'call_005',
        direction: 'Inbound',
        phoneNumber: '+13105695944',
        date: '01-15-2024',
        time: '8:16:47 PM',
        duration: '00:53',
        status: 'failed',
        summary: 'The user called to inquire about the wait time for three people but was frustrated with the AI\'s inability to provide specific information. The call was transferred to a representative, but the transfer was unsuccessful.',
        sentiment: 'Negative',
        transcript: [
          { speaker: 'AI', text: 'Thank you for calling. How can I help you today?', timestamp: '00:00' },
          { speaker: 'Customer', text: 'What\'s the wait time for three people?', timestamp: '00:03' },
          { speaker: 'AI', text: 'I don\'t have access to real-time wait times. Would you like me to transfer you to someone who can help?', timestamp: '00:08' },
          { speaker: 'Customer', text: 'Why can\'t you just tell me the wait time?', timestamp: '00:15' },
          { speaker: 'AI', text: 'I apologize for the inconvenience. Wait times vary and I don\'t have access to current information. Let me transfer you to our host.', timestamp: '00:22' },
          { speaker: 'Customer', text: 'This is frustrating. Yes, transfer me.', timestamp: '00:32' },
          { speaker: 'AI', text: 'I understand your frustration. Transferring you now.', timestamp: '00:38' },
          { speaker: 'System', text: 'Transfer failed - no available representative.', timestamp: '00:53' }
        ],
        actionItems: [
          'Customer frustrated with lack of wait time information',
          'Transfer to representative failed'
        ],
        recording_url: null
      }
    };
    
    // Get the specific call
    const call = mockCalls[id];
    
    if (!call) {
      return NextResponse.json(
        { error: 'Call not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(call);
  } catch (error) {
    console.error('Error in /api/calls/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}