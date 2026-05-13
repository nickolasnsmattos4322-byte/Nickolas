import { createClient } from '@/lib/supabase/server'
import { ActivityCard } from '@/components/app/activity-card'
import { Activity, Category } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calculator, Sparkles, Hash, Plus, Divide, Shapes } from 'lucide-react'

export default async function MatematicaPage() {
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
    .eq('tipo', 'matematica')
    .order('ordem')

  const { data: activities } = await supabase
    .from('activities')
    .select('*, category:categories(*)')
    .eq('tipo', 'matematica')
    .order('is_featured', { ascending: false })
    .order('ordem')

  const isPremium = profile?.plano === 'premium'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#4D96FF] to-[#5F27CD] mb-4 shadow-lg">
          <Calculator className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#2D1B4E] mb-2">
          Matematica
        </h1>
        <p className="text-lg text-[#6B5B7A] max-w-xl mx-auto">
          Numeros, contas e raciocinio logico de forma divertida!
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#4D96FF] to-[#5F27CD] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <Hash className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Numeros</h3>
          <p className="text-sm text-white/80">1 a 100</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[#6BCB77] to-[#1DD1A1] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <Plus className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Adicao</h3>
          <p className="text-sm text-white/80">Somar</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[#FF6B9D] to-[#FF9F43] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <Divide className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Subtracao</h3>
          <p className="text-sm text-white/80">Diminuir</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <Shapes className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Formas</h3>
          <p className="text-sm text-white/80">Geometria</p>
        </Card>
      </div>

      {/* Tabs por Categoria */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 bg-white/50 p-2 rounded-2xl">
          <TabsTrigger 
            value="todos" 
            className="rounded-full data-[state=active]:bg-[#4D96FF] data-[state=active]:text-white font-semibold px-4"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Todos
          </TabsTrigger>
          {categories?.map((category: Category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.slug}
              className="rounded-full data-[state=active]:bg-[#4D96FF] data-[state=active]:text-white font-semibold px-4"
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
            <Card className="p-12 text-center bg-gradient-to-br from-[#E8F0FF] to-[#F0F5FF] rounded-3xl border-2 border-dashed border-[#4D96FF]/30">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#4D96FF]/20 flex items-center justify-center">
                <Calculator className="h-10 w-10 text-[#4D96FF]" />
              </div>
              <h3 className="text-xl font-bold text-[#2D1B4E] mb-2">Em breve!</h3>
              <p className="text-[#6B5B7A]">
                Novas atividades de matematica chegando em breve!
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
        <Card className="p-6 bg-gradient-to-r from-[#4D96FF] to-[#5F27CD] rounded-3xl text-center text-white">
          <h3 className="text-2xl font-bold mb-2">
            Desbloqueie Todas as Atividades!
          </h3>
          <p className="text-white/90 mb-4 max-w-lg mx-auto">
            Assine o plano Premium e tenha acesso a centenas de atividades de matematica!
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-white text-[#4D96FF] hover:bg-white/90 font-bold rounded-full px-8"
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
