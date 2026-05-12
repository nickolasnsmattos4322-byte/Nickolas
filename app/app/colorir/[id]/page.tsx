import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ColoringCanvas } from '@/components/app/coloring-canvas'
import { FREE_LIMITS } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ColorirActivityPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: activity } = await supabase
    .from('activities')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (!activity) {
    notFound()
  }

  const isPremium = profile?.plano === 'premium'
  
  // Check if activity is premium and user is not premium
  if (activity.is_premium && !isPremium) {
    redirect('/app/premium')
  }

  // Check free limits for non-premium users
  const canAccess = isPremium || (profile?.desenhos_gratis_usados || 0) < FREE_LIMITS.desenhos

  return (
    <div className="space-y-6">
      <ColoringCanvas 
        activity={activity}
        userId={user.id}
        canAccess={canAccess}
        isPremium={isPremium}
        currentUsage={profile?.desenhos_gratis_usados || 0}
      />
    </div>
  )
}
