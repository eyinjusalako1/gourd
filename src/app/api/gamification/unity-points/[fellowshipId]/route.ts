import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { GamificationService } from '@/lib/gamification-service'

export async function GET(
  request: Request,
  { params }: { params: { fellowshipId: string } }
) {
  try {
    const { fellowshipId } = params
    const { searchParams } = new URL(request.url)
    const weekParam = searchParams.get('week')

    // If Supabase not configured, use mock data
    if (!isSupabaseConfigured()) {
      console.log('[Mock] Fetching Unity Points:', { fellowshipId, weekParam })
      
      return NextResponse.json({
        fellowshipId,
        weekStart: weekParam || new Date().toISOString().split('T')[0],
        weekEnd: new Date().toISOString().split('T')[0],
        totalPoints: 127,
        participationRate: 85,
        memberCount: 20,
        emberMeterLevel: 85,
        isOnFire: true,
        weeklyMessage: 'Your fellowship stayed on fire this week! 🔥'
      })
    }

    // Real implementation
    const weekStart = weekParam || (() => {
      const date = new Date()
      const day = date.getDay()
      const diff = date.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(date.setDate(diff))
      return monday.toISOString().split('T')[0]
    })()

    const { data: unityPoints, error } = await supabase
      .from('unity_points')
      .select('*')
      .eq('fellowship_id', fellowshipId)
      .eq('week_start', weekStart)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching unity points:', error)
      return NextResponse.json(
        { error: 'Failed to fetch unity points' },
        { status: 500 }
      )
    }

    if (!unityPoints) {
      return NextResponse.json({
        fellowshipId,
        weekStart,
        weekEnd: weekStart,
        totalPoints: 0,
        participationRate: 0,
        memberCount: 0,
        emberMeterLevel: 0,
        isOnFire: false,
        weeklyMessage: null
      })
    }

    return NextResponse.json({
      fellowshipId: unityPoints.fellowship_id,
      weekStart: unityPoints.week_start,
      weekEnd: unityPoints.week_end,
      totalPoints: unityPoints.total_points,
      participationRate: unityPoints.participation_rate,
      memberCount: unityPoints.member_count,
      emberMeterLevel: unityPoints.ember_meter_level,
      isOnFire: unityPoints.is_on_fire,
      weeklyMessage: unityPoints.weekly_message
    })

  } catch (error) {
    console.error('Error in unity-points GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

