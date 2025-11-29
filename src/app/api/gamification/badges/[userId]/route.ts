import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const { searchParams } = new URL(request.url)
    const fellowshipId = searchParams.get('fellowshipId')

    // If Supabase not configured, return empty array
    if (!isSupabaseConfigured()) {
      console.log('[Mock] Fetching user badges:', { userId, fellowshipId })
      return NextResponse.json([])
    }

    // Real implementation
    let query = supabase
      .from('user_badges')
      .select('*, blessing_badges(*)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })

    if (fellowshipId) {
      query = query.or(`fellowship_id.eq.${fellowshipId},fellowship_id.is.null`)
    } else {
      query = query.is('fellowship_id', null)
    }

    const { data: userBadges, error } = await query

    if (error) {
      console.error('Error fetching user badges:', error)
      return NextResponse.json(
        { error: 'Failed to fetch badges' },
        { status: 500 }
      )
    }

    // Map to expected format
    const badges = userBadges?.map((ub: any) => ({
      id: ub.badge_id,
      code: ub.blessing_badges?.code || '',
      name: ub.blessing_badges?.name || '',
      description: ub.blessing_badges?.description || '',
      icon: ub.blessing_badges?.icon || '',
      category: ub.blessing_badges?.category || '',
      rarity: ub.blessing_badges?.rarity || 'common',
      glowColor: ub.blessing_badges?.glow_color,
      earnedAt: ub.earned_at,
      isFeatured: ub.is_featured
    })) || []

    return NextResponse.json(badges)

  } catch (error) {
    console.error('Error in badges GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}




