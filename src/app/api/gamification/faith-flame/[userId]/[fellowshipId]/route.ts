import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { GamificationService } from '@/lib/gamification-service'

export async function GET(
  request: Request,
  { params }: { params: { userId: string; fellowshipId: string } }
) {
  try {
    const { userId, fellowshipId } = params

    // If Supabase not configured, use mock data
    if (!isSupabaseConfigured()) {
      console.log('[Mock] Fetching Faith Flame:', { userId, fellowshipId })
      
      return NextResponse.json({
        userId,
        fellowshipId,
        currentStreak: 7,
        longestStreak: 10,
        lastActivityDate: new Date().toISOString().split('T')[0],
        intensity: 'burning'
      })
    }

    // Real implementation
    const { data: streak, error } = await supabase
      .from('faith_streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('fellowship_id', fellowshipId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching faith streak:', error)
      return NextResponse.json(
        { error: 'Failed to fetch faith flame data' },
        { status: 500 }
      )
    }

    if (!streak) {
      // Return default streak
      return NextResponse.json({
        userId,
        fellowshipId,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date().toISOString().split('T')[0],
        intensity: 'out'
      })
    }

    return NextResponse.json({
      userId: streak.user_id,
      fellowshipId: streak.fellowship_id,
      currentStreak: streak.current_streak,
      longestStreak: streak.longest_streak,
      lastActivityDate: streak.last_activity_date,
      intensity: streak.flame_intensity
    })

  } catch (error) {
    console.error('Error in faith-flame GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

