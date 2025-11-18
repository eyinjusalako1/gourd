import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { fellowshipId: string } }
) {
  try {
    const { fellowshipId } = params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    // If Supabase not configured, use mock data
    if (!isSupabaseConfigured()) {
      console.log('[Mock] Fetching highlights:', { fellowshipId })
      
      // Only return highlight if on fire
      return NextResponse.json([
        {
          id: '1',
          type: 'on_fire',
          title: 'This fellowship is on fire! 🔥',
          message: 'Your fellowship stayed on fire this week with 127 Unity Points',
          icon: '🔥',
          pointsOrStreak: 85
        }
      ])
    }

    // Real implementation
    const { data: highlights, error } = await supabase
      .from('fellowship_highlights')
      .select('*')
      .eq('fellowship_id', fellowshipId)
      .eq('is_public', true)
      .order('display_start', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching highlights:', error)
      return NextResponse.json(
        { error: 'Failed to fetch highlights' },
        { status: 500 }
      )
    }

    return NextResponse.json(highlights || [])

  } catch (error) {
    console.error('Error in highlights GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}




