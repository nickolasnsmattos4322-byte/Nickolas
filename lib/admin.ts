import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL, isAdmin } from '@/lib/types'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Ensures admin user always has premium status
 * Call this when loading user profile
 */
export async function ensureAdminPremium(userId: string, email: string | null | undefined) {
  if (!isAdmin(email)) return

  try {
    // Check current status
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plano, status_assinatura')
      .eq('id', userId)
      .single()

    // If admin doesn't have premium, give it to them
    if (profile && (profile.plano !== 'premium' || profile.status_assinatura !== 'active')) {
      await supabaseAdmin
        .from('profiles')
        .update({
          plano: 'premium',
          status_assinatura: 'active',
          periodo: 'yearly',
          data_renovacao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        })
        .eq('id', userId)
      
      console.log('[Admin] Premium status granted to admin user:', email)
    }
  } catch (error) {
    console.error('[Admin] Error ensuring admin premium:', error)
  }
}

/**
 * Gets user profile with admin check
 */
export async function getProfileWithAdminCheck() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { user: null, profile: null }

  // Ensure admin has premium
  await ensureAdminPremium(user.id, user.email)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}
