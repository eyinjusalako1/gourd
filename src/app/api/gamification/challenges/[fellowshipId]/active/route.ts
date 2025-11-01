import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { fellowshipId: string } }
) {
  try {
    const { fellowshipId } = params

    // If Supabase not configured, use mock data
    if (!isSupabaseConfigured()) {
      console.log('[Mock] Fetching active challenges:', { fellowshipId })
      
      return NextResponse.json([
        {
          id: '1',
          fellowshipId,
          templateId: 'template-1',
          title: 'Share a Testimony',
          description: 'Share one testimony this week with your fellowship',
          category: 'testimony',
          icon: '💬',
          weekStart: new Date().toISOString().split('T')[0],
          weekEnd: new Date().toISOString().split('T')[0],
          status: 'active',
          badgeReward: 'testimony_sharer'
        },
        {
          id: '2',
          fellowshipId,
          templateId: 'template-2',
          title: 'Pray Together',
          description: 'Join in a group prayer or prayer request this week',
          category: 'prayer',
          icon: '🙏',
          weekStart: new Date().toISOString().split('T')[0],
          weekEnd: new Date().toISOString().split('T')[0],
          status: 'active',
          badgeReward: 'prayer_warrior'
        }
      ])
    }

    // Real implementation
    const { data: challenges, error } = await supabase
      .from('weekly_challenges')
      .select('*, challenge_templates(*)')
      .eq('fellowship_id', fellowshipId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching challenges:', error)
      return NextResponse.json(
        { error: 'Failed to fetch challenges' },
        { status: 500 }
      )
    }

    // Map to expected format
    const formattedChallenges = challenges?.map(challenge => ({
      id: challenge.id,
      fellowshipId: challenge.fellowship_id,
      templateId: challenge.template_id,
      title: challenge.challenge_templates?.title || 'Challenge',
      description: challenge.challenge_templates?.description || '',
      category: challenge.challenge_templates?.category || 'community',
      icon: challenge.challenge_templates?.icon || '🎯',
      weekStart: challenge.week_start,
      weekEnd: challenge.week_end,
      status: challenge.status,
      badgeReward: challenge.challenge_templates?.badge_reward
    })) || []

    return NextResponse.json(formattedChallenges)

  } catch (error) {
    console.error('Error in challenges active GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

