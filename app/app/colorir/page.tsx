import { createClient } from '@/lib/supabase/server'
import { ActivityCard } from '@/components/app/activity-card'
import { Activity, Category } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette } from 'lucide-react'

export default async function ColorirPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('tipo', 'desenho')
    .order('ordem')

  const { data: activities } = await supabase
    .from('activities')
    .select('*, category:categories(*)')
    .eq('tipo', 'colorir')
    .order('ordem')

  const isPremium = profile?.plano === 'premium'

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.7_0.18_330)]">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Desenhos para Colorir</h1>
            <p className="text-muted-foreground">Escolha um desenho e solte sua criatividade!</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2">
          <TabsTrigger value="todos" className="rounded-full">
            Todos
          </TabsTrigger>
          {categories?.map((category: Category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.slug}
              className="rounded-full"
            >
              {category.nome}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="todos">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activities?.map((activity: Activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                isPremium={isPremium}
              />
            ))}
          </div>
        </TabsContent>

        {categories?.map((category: Category) => (
          <TabsContent key={category.id} value={category.slug}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activities
                ?.filter((a: Activity) => a.category_id === category.id)
                .map((activity: Activity) => (
                  <ActivityCard 
                    key={activity.id} 
                    activity={activity} 
                    isPremium={isPremium}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
