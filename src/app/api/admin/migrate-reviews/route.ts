import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST() {
  const supabase = createAdminClient();

  try {
    // Add status column if it doesn't exist
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
        CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
        UPDATE reviews SET status = 'approved' WHERE status IS NULL OR status = 'pending';
      `
    });

    if (error) {
      console.error('Migration error:', error);
      return NextResponse.json(
        { error: 'Migration failed. Please run the SQL manually in Supabase dashboard.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Migration completed successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to run migration' },
      { status: 500 }
    );
  }
}
