import { NextRequest, NextResponse } from 'next/server';
import { rejectReview } from '@/lib/reviews';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await rejectReview(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error rejecting review:', error);
    return NextResponse.json(
      { error: 'Failed to reject review' },
      { status: 500 }
    );
  }
}
