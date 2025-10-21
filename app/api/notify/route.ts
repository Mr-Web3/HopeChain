import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Notification received:', body);

    // Handle notification logic here
    // For now, just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling notification:', error);
    return NextResponse.json(
      { error: 'Failed to handle notification' },
      { status: 500 }
    );
  }
}
