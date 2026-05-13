import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  Palette, 
  Star, 
  Lock, 
  Sparkles,
  Cat,
  TreePine,
  Car,
  Smile,
  Crown,
  Shield,
  Gift
} from 'lucide-react'
import type { Activity, Category } from '@/lib/types'

const categoryIcons: Record<string, React.ReactNode> = {
  'animais': <Cat className="h-5 w-5" />,
  'natureza': <TreePine className="h-5 w-5" />,
  'veiculos': <Car className="h-5 w-5" />,
  'personagens': <Smile className="h-5 w-5" />,
  'dinossauros': <span className="text-lg">🦕</span>,
  'unicornios': <span className="text-lg">🦄</span>,
  'princesas': <Crown className="h-5 w-5" />,
  'super-herois': <Shield className="h-5 w-5" />,
  'natal': <Gift className="h-5 w-5" />,
}

const categoryColors: Record<string, string> = {
  'animais': 'bg-gradient-to-br from-[#FF6B9D] to-[#FF9F43]',
  'natureza': 'bg-gradient-to-br from-[#6BCB77] to-[#1DD1A1]',
  'veiculos': 'bg-gradient-to-br from-[#4D96FF] to-[#5F27CD]',
  'personagens': 'bg-gradient-to-br from-[#FFD93D] to-[#FF9F43]',
  'dinossauros': 'bg-gradient-to-br from-[#6BCB77] to-[#4D96FF]',
  'unicornios': 'bg-gradient-to-br from-[#A66CFF] to-[#FF6B9D]',
  'princesas': 'bg-gradient-to-br from-[#FF6B9D] to-[#A66CFF]',
  'super-herois': 'bg-gradient-to-br from-[#FF4757] to-[#FF9F43]',
  'natal': 'bg-gradient-to-br from-[#FF4757] to-[#6BCB77]',
}

export default async function ColorirPage() {
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

  const isPremium = profile?.plano === 'premium'

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('tipo', 'desenho')
    .order('ordem')

  const { data: activities } = await supabase
    .from('activities')
    .select('*, category:categories(*)')
    .eq('tipo', 'colorir')
    .order('is_featured', { ascending: false })
    .order('ordem')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#FF9F43] mb-4 shadow-lg">
          <Palette className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#2D1B4E] mb-2">
          Desenhos para Colorir
        </h1>
        <p className="text-lg text-[#6B5B7A] max-w-xl mx-auto">
          Escolha um desenho lindo e solte sua criatividade com muitas cores!
        </p>
      </div>

      {/* Tabs por Categoria */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 bg-white/50 p-2 rounded-2xl">
          <TabsTrigger 
            value="todos" 
            className="rounded-full data-[state=active]:bg-[#FF6B9D] data-[state=active]:text-white font-semibold px-4"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Todos
          </TabsTrigger>
          {categories?.map((category: Category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.slug}
              className="rounded-full data-[state=active]:bg-[#FF6B9D] data-[state=active]:text-white font-semibold px-4"
            >
              <span className="mr-1">{categoryIcons[category.slug]}</span>
              {category.nome}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="todos">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activities?.map((activity: Activity) => (
              <ActivityCardItem 
                key={activity.id} 
                activity={activity} 
                isPremium={isPremium}
              />
            ))}
          </div>
        </TabsContent>

        {categories?.map((category: Category) => (
          <TabsContent key={category.id} value={category.slug}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {activities
                ?.filter((a: Activity) => a.category_id === category.id)
                .map((activity: Activity) => (
                  <ActivityCardItem 
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
        <Card className="p-6 bg-gradient-to-r from-[#A66CFF] to-[#FF6B9D] rounded-3xl text-center text-white">
          <h3 className="text-2xl font-bold mb-2">
            Desbloqueie Todos os Desenhos!
          </h3>
          <p className="text-white/90 mb-4 max-w-lg mx-auto">
            Assine o plano Premium e tenha acesso a centenas de desenhos exclusivos!
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-white text-[#A66CFF] hover:bg-white/90 font-bold rounded-full px-8"
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

function ActivityCardItem({ activity, isPremium }: { activity: Activity; isPremium: boolean }) {
  const isLocked = activity.is_premium && !isPremium

  return (
    <Link
      href={isLocked ? '/app/premium' : `/app/colorir/${activity.id}`}
      className="group"
    >
      <Card className={`
        relative overflow-hidden rounded-2xl border-3 transition-all duration-300
        ${isLocked 
          ? 'border-gray-200 opacity-80' 
          : 'border-[#FFE4EC] hover:border-[#FF6B9D] hover:scale-105 hover:shadow-xl'
        }
      `}>
        {/* Thumbnail */}
        <div className="aspect-square bg-white p-4 flex items-center justify-center">
          {activity.svg_data ? (
            <div 
              className="w-full h-full text-[#2D1B4E] [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: activity.svg_data }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FFE4EC] to-[#FFF0F5] rounded-xl flex items-center justify-center">
              <Palette className="h-12 w-12 text-[#FF6B9D]" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 bg-gradient-to-br from-[#FFF9F0] to-white">
          <h3 className="font-bold text-[#2D1B4E] text-sm truncate">
            {activity.titulo}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            {activity.is_featured && (
              <Badge className="bg-[#FFD93D] text-[#2D1B4E] text-[10px] px-1.5 py-0">
                <Star className="h-3 w-3 mr-0.5 fill-current" />
                Destaque
              </Badge>
            )}
          </div>
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-[#2D1B4E]/60 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#A66CFF] flex items-center justify-center mb-2 shadow-lg">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <Badge className="bg-[#A66CFF] text-white font-bold">
              Premium
            </Badge>
          </div>
        )}
      </Card>
    </Link>
  )
}
