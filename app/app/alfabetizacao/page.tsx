import { createClient } from '@/lib/supabase/server'
import { ActivityCard } from '@/components/app/activity-card'
import { Activity, Category } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Sparkles, BookA, PenTool } from 'lucide-react'

export default async function AlfabetizacaoPage() {
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
    .eq('tipo', 'alfabetizacao')
    .order('ordem')

  const { data: activities } = await supabase
    .from('activities')
    .select('*, category:categories(*)')
    .eq('tipo', 'alfabetizacao')
    .order('is_featured', { ascending: false })
    .order('ordem')

  const isPremium = profile?.plano === 'premium'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#6BCB77] to-[#1DD1A1] mb-4 shadow-lg">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#2D1B4E] mb-2">
          Alfabetização
        </h1>
        <p className="text-lg text-[#6B5B7A] max-w-xl mx-auto">
          Aprenda as letras, forme palavras e desenvolva a leitura brincando!
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#6BCB77] to-[#1DD1A1] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <BookA className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Alfabeto</h3>
          <p className="text-sm text-white/80">A a Z</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[#4D96FF] to-[#5F27CD] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <PenTool className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Escrita</h3>
          <p className="text-sm text-white/80">Trace letras</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[#FF6B9D] to-[#FF9F43] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <BookOpen className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Palavras</h3>
          <p className="text-sm text-white/80">Forme palavras</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] text-white rounded-2xl hover:scale-105 transition-all cursor-pointer">
          <Sparkles className="h-8 w-8 mb-2" />
          <h3 className="font-bold">Sílabas</h3>
          <p className="text-sm text-white/80">BA-BE-BI-BO-BU</p>
        </Card>
      </div>

      {/* Tabs por Categoria */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 bg-white/50 p-2 rounded-2xl">
          <TabsTrigger 
            value="todos" 
            className="rounded-full data-[state=active]:bg-[#6BCB77] data-[state=active]:text-white font-semibold px-4"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Todos
          </TabsTrigger>
          {categories?.map((category: Category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.slug}
              className="rounded-full data-[state=active]:bg-[#6BCB77] data-[state=active]:text-white font-semibold px-4"
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
            <Card className="p-12 text-center bg-gradient-to-br from-[#E8F8E8] to-[#F0FFF0] rounded-3xl border-2 border-dashed border-[#6BCB77]/30">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#6BCB77]/20 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-[#6BCB77]" />
              </div>
              <h3 className="text-xl font-bold text-[#2D1B4E] mb-2">Em breve!</h3>
              <p className="text-[#6B5B7A]">
                Novas atividades de alfabetização chegando em breve!
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
        <Card className="p-6 bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] rounded-3xl text-center text-white">
          <h3 className="text-2xl font-bold mb-2">
            Desbloqueie Todas as Atividades!
          </h3>
          <p className="text-white/90 mb-4 max-w-lg mx-auto">
            Assine o plano Premium e tenha acesso a centenas de atividades de alfabetização!
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-white text-[#6BCB77] hover:bg-white/90 font-bold rounded-full px-8"
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
