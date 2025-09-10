import { NextRequest } from 'next/server';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  try {
    const { body, key, to } = await req.json();
    
    if (!body) return Response.json({ error: 'Missing "body"' }, { status: 400 });
    
    // Check if this is from your own webhook (internal call) OR has the placeholder key
    const referer = req.headers.get('referer');
    const isInternalCall = referer?.includes('tellroute.com');
    
    // Allow internal calls, placeholder key from Retell, OR correct secret key
    if (!isInternalCall && key !== process.env.SECRET_KEY && key !== 'your_secret_key') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM;
    
    // Clean phone number
    let recipient = to || process.env.DEFAULT_TO;
    if (recipient && !recipient.startsWith('+')) {
      recipient = '+1' + recipient.replace(/^1/, '');
    }

    if (!recipient) return Response.json({ error: 'Missing "to" (or DEFAULT_TO)' }, { status: 400 });

    // Send SMS via Twilio
    const client = twilio(accountSid, authToken);
    const msg = await client.messages.create({ 
      from, 
      to: recipient, 
      body 
    });
    
    return Response.json({ ok: true, success: true, sid: msg.sid });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    console.error('SMS Error:', errorMessage);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}