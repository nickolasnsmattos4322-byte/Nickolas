import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { calculateLevel } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, data } = await request.json()

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let updates: Record<string, unknown> = {}
    let rewards: { stars: number; xp: number; levelUp?: number; achievement?: unknown } = { stars: 0, xp: 0 }

    switch (action) {
      case 'complete_activity':
        // Award XP and stars for completing an activity
        const activityXp = data.isPremiumContent ? 15 : 10
        const activityStars = data.isPremiumContent ? 3 : 1
        
        updates = {
          xp: (profile.xp || 0) + activityXp,
          estrelas: (profile.estrelas || 0) + activityStars,
        }
        rewards = { stars: activityStars, xp: activityXp }

        // Check for level up
        const oldLevel = calculateLevel(profile.xp || 0)
        const newLevel = calculateLevel((profile.xp || 0) + activityXp)
        if (newLevel > oldLevel) {
          updates.nivel = newLevel
          rewards.levelUp = newLevel
          // Bonus stars for leveling up
          updates.estrelas = (updates.estrelas as number) + 5
          rewards.stars += 5
        }

        // Check and award achievements
        await checkAndAwardAchievements(supabase, user.id, 'activity_complete', profile)
        break

      case 'complete_drawing':
        // Award XP and stars for completing a drawing
        const drawingXp = data.isPremiumContent ? 20 : 15
        const drawingStars = data.isPremiumContent ? 5 : 2
        
        updates = {
          xp: (profile.xp || 0) + drawingXp,
          estrelas: (profile.estrelas || 0) + drawingStars,
        }
        rewards = { stars: drawingStars, xp: drawingXp }

        // Check for level up
        const oldDrawingLevel = calculateLevel(profile.xp || 0)
        const newDrawingLevel = calculateLevel((profile.xp || 0) + drawingXp)
        if (newDrawingLevel > oldDrawingLevel) {
          updates.nivel = newDrawingLevel
          rewards.levelUp = newDrawingLevel
          updates.estrelas = (updates.estrelas as number) + 5
          rewards.stars += 5
        }

        // Check achievements for drawings
        await checkAndAwardAchievements(supabase, user.id, 'drawing_complete', profile)
        break

      case 'daily_login':
        // Award bonus for daily login streak
        const loginStars = 2
        const loginXp = 5
        
        updates = {
          xp: (profile.xp || 0) + loginXp,
          estrelas: (profile.estrelas || 0) + loginStars,
        }
        rewards = { stars: loginStars, xp: loginXp }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update profile with new values
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, rewards })
  } catch (error) {
    console.error('Gamification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function checkAndAwardAchievements(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  type: 'activity_complete' | 'drawing_complete',
  profile: Record<string, unknown>
) {
  // Get user's completed activities/drawings count
  const { count: completedCount } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true)

  // Get achievements that match the criteria
  const achievementType = type === 'drawing_complete' ? 'colorir' : 'atividade'
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('tipo', achievementType)
    .lte('requisito', completedCount || 0)

  if (!achievements || achievements.length === 0) return

  // Get user's current achievements
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId)

  const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || [])

  // Award new achievements
  for (const achievement of achievements) {
    if (!unlockedIds.has(achievement.id)) {
      // Award the achievement
      await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
        })

      // Award the achievement rewards
      await supabase
        .from('profiles')
        .update({
          estrelas: (profile.estrelas as number || 0) + achievement.estrelas_reward,
          xp: (profile.xp as number || 0) + achievement.xp_reward,
        })
        .eq('id', userId)
    }
  }
}
