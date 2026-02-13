import { NextRequest, NextResponse } from 'next/server';
import { approveReview } from '@/lib/reviews';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await approveReview(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving review:', error);
    return NextResponse.json(
      { error: 'Failed to approve review' },
      { status: 500 }
    );
  }
}
