import { createClient } from '@/lib/supabase/server'
import { ActivityCard } from '@/components/app/activity-card'
import { Activity, UserProgress } from '@/lib/types'
import { Heart } from 'lucide-react'

export default async function FavoritosPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: favorites } = await supabase
    .from('user_progress')
    .select('*, activity:activities(*, category:categories(*))')
    .eq('user_id', user?.id)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false })

  const isPremium = profile?.plano === 'premium'

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Favoritos</h1>
            <p className="text-muted-foreground">Suas atividades favoritas em um só lugar!</p>
          </div>
        </div>
      </div>

      {favorites && favorites.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((fav: UserProgress & { activity: Activity }) => (
            fav.activity && (
              <ActivityCard 
                key={fav.id} 
                activity={fav.activity} 
                isPremium={isPremium}
              />
            )
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Nenhum favorito ainda</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Clique no coração nas atividades para adicioná-las aos favoritos!
          </p>
        </div>
      )}
    </div>
  )
}
