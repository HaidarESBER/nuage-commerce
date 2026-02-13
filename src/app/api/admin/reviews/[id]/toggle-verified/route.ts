import { NextRequest, NextResponse } from 'next/server';
import { toggleVerifiedStatus } from '@/lib/reviews';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { verified } = await request.json();
    
    await toggleVerifiedStatus(id, verified);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling verified status:', error);
    return NextResponse.json(
      { error: 'Failed to update verified status' },
      { status: 500 }
    );
  }
}
