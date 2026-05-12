import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint should be called daily by a cron job to reset free user limits
// Configure in vercel.json: {"crons": [{"path": "/api/cron/reset-limits", "schedule": "0 0 * * *"}]}

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Reset daily limits for all free users
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      desenhos_gratis_usados: 0,
      atividades_gratis_usadas: 0,
    })
    .eq('plano', 'free')

  if (error) {
    console.error('Error resetting limits:', error)
    return NextResponse.json({ error: 'Failed to reset limits' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Daily limits reset successfully' })
}
