import { createClient } from '@/lib/supabase/server'
import { ActivityCard } from '@/components/app/activity-card'
import { Activity, Category } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Globe, Sparkles, Palette, Cat, Apple, Music } from 'lucide-react'

export default async function InglesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('tipo', 'ingles')
    .order('ordem')

  const { data: activities } = await supabase
    .from('activities')
    .select('*, category:categories(*)')
    .eq('tipo', 'ingles')
    .order('is_featured', { ascending: false })
    .order('ordem')

  const isPremium = profile?.plano === 'premium'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] mb-4 shadow-lg">
          <Globe className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#2D1B4E] mb-2">
          Ingles
        </h1>
        <p className="text-lg text-[#6B5B7A] max-w-xl mx-auto">
          Learn English with fun activities! Aprenda ingles brincando!
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <Palette className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Colors</h3>
          <p className="text-sm text-white/80">Cores</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[#6BCB77] to-[#1DD1A1] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <Cat className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Animals</h3>
          <p className="text-sm text-white/80">Animais</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[#FF6B9D] to-[#A66CFF] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <Apple className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Food</h3>
          <p className="text-sm text-white/80">Comidas</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[#4D96FF] to-[#5F27CD] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <Music className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Songs</h3>
          <p className="text-sm text-white/80">Musicas</p>
        </Card>
      </div>

      {/* Tabs por Categoria */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 bg-white/50 p-2 rounded-2xl">
          <TabsTrigger 
            value="todos" 
            className="rounded-full data-[state=active]:bg-[#FFD93D] data-[state=active]:text-[#2D1B4E] font-semibold px-4"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            All / Todos
          </TabsTrigger>
          {categories?.map((category: Category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.slug}
              className="rounded-full data-[state=active]:bg-[#FFD93D] data-[state=active]:text-[#2D1B4E] font-semibold px-4"
            >
              {category.nome}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="todos">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activities?.map((activity: Activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                isPremium={isPremium}
              />
            ))}
          </div>
          {(!activities || activities.length === 0) && (
            <Card className="p-12 text-center bg-gradient-to-br from-[#FFF8E8] to-[#FFFAF0] rounded-3xl border-2 border-dashed border-[#FFD93D]/30">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#FFD93D]/20 flex items-center justify-center">
                <Globe className="h-10 w-10 text-[#FFD93D]" />
              </div>
              <h3 className="text-xl font-bold text-[#2D1B4E] mb-2">Coming Soon!</h3>
              <p className="text-[#6B5B7A]">
                New English activities coming soon! Novas atividades em breve!
              </p>
            </Card>
          )}
        </TabsContent>

        {categories?.map((category: Category) => (
          <TabsContent key={category.id} value={category.slug}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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

      {/* CTA Premium */}
      {!isPremium && (
        <Card className="p-6 bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] rounded-3xl text-center text-white">
          <h3 className="text-2xl font-bold mb-2">
            Unlock All Activities! Desbloqueie Tudo!
          </h3>
          <p className="text-white/90 mb-4 max-w-lg mx-auto">
            Subscribe to Premium and access hundreds of English learning activities!
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-white text-[#FF9F43] hover:bg-white/90 font-bold rounded-full px-8"
          >
            <Link href="/app/premium">
              Ver Planos Premium
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}
