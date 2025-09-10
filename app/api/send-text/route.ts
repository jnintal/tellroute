import { NextRequest } from 'next/server';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  try {
    const { body, key, to } = await req.json();
    
    if (!body) return Response.json({ error: 'Missing "body"' }, { status: 400 });
    if (key !== process.env.SECRET_KEY) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM;
    const recipient = to || process.env.DEFAULT_TO;

    if (!recipient) return Response.json({ error: 'Missing "to" (or DEFAULT_TO)' }, { status: 400 });

    // ACTUALLY SEND THE SMS VIA TWILIO
    const client = twilio(accountSid, authToken);
    const msg = await client.messages.create({ 
      from, 
      to: recipient, 
      body 
    });
    
    // Return with 'ok' for compatibility with webhook
    return Response.json({ ok: true, success: true, sid: msg.sid });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    console.error('SMS Error:', errorMessage);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
