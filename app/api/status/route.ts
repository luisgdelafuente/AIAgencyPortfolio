import { NextResponse } from 'next/server';

// Simple status API endpoint to verify our setup is working
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Next.js + Express unified server is running'
  });
}