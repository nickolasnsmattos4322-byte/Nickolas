import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Palette, 
  BookOpen, 
  Calculator, 
  Globe, 
  Star,
  ArrowRight,
  Crown,
  Lock,
  Trophy,
  Gamepad2,
  Printer,
  Heart,
  Sparkles,
  Zap,
  Play
} from 'lucide-react'
import { FREE_LIMITS, Activity, calculateLevel, calculateLevelProgress, XP_PER_LEVEL } from '@/lib/types'
import { ActivityCard } from '@/components/app/activity-card'

const categories = [
  { 
    name: 'Colorir', 
    href: '/app/colorir', 
    icon: Palette, 
    color: 'from-[#FF6B9D] to-[#A66CFF]',
    bgColor: 'bg-[#FFE4EC]',
    description: '500+ desenhos',
    emoji: '🎨'
  },
  { 
    name: 'Alfabeto', 
    href: '/app/alfabetizacao', 
    icon: BookOpen, 
    color: 'from-[#6BCB77] to-[#1DD1A1]',
    bgColor: 'bg-[#E8F8EA]',
    description: 'Letras e palavras',
    emoji: '📚'
  },
  { 
    name: 'Numeros', 
    href: '/app/matematica', 
    icon: Calculator, 
    color: 'from-[#4D96FF] to-[#A66CFF]',
    bgColor: 'bg-[#E8F0FF]',
    description: 'Matematica divertida',
    emoji: '🔢'
  },
  { 
    name: 'Ingles', 
    href: '/app/ingles', 
    icon: Globe, 
    color: 'from-[#FFD93D] to-[#FF9F43]',
    bgColor: 'bg-[#FFF8E1]',
    description: 'Hello English!',
    emoji: '🌍'
  },
  { 
    name: 'Jogos', 
    href: '/app/jogos', 
    icon: Gamepad2, 
    color: 'from-[#A66CFF] to-[#FF6B9D]',
    bgColor: 'bg-[#F3E8FF]',
    description: 'Games educativos',
    emoji: '🎮'
  },
  { 
    name: 'Imprimir', 
    href: '/app/imprimir', 
    icon: Printer, 
    color: 'from-[#FF9F43] to-[#FFD93D]',
    bgColor: 'bg-[#FFF0E8]',
    description: 'Atividades em PDF',
    emoji: '🖨️'
  },
]

const quickActivities = [
  { name: 'Dinossauro', emoji: '🦖', color: 'bg-[#6BCB77]', href: '/app/colorir' },
  { name: 'Unicornio', emoji: '🦄', color: 'bg-[#A66CFF]', href: '/app/colorir' },
  { name: 'Borboleta', emoji: '🦋', color: 'bg-[#4D96FF]', href: '/app/colorir' },
  { name: 'Letra A', emoji: '🅰️', color: 'bg-[#FF6B9D]', href: '/app/alfabetizacao' },
]

export default async function AppDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: featuredActivities } = await supabase
    .from('activities')
    .select('*, category:categories(*)')
    .eq('is_featured', true)
    .limit(6)

  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('*, achievement:achievements(*)')
    .eq('user_id', user?.id)
    .order('unlocked_at', { ascending: false })
    .limit(3)

  const isPremium = profile?.plano === 'premium'
  const desenhosRestantes = isPremium ? -1 : FREE_LIMITS.desenhos - (profile?.desenhos_gratis_usados || 0)
  const atividadesRestantes = isPremium ? -1 : FREE_LIMITS.atividades - (profile?.atividades_gratis_usadas || 0)
  const nivel = profile?.nivel || calculateLevel(profile?.xp || 0)
  const xpProgress = calculateLevelProgress(profile?.xp || 0)

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#FF6B9D] via-[#A66CFF] to-[#4D96FF] shadow-2xl">
        <CardContent className="p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"/>
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{['🌞', '🌈', '⭐', '🎨', '🦋', '🚀', '🎉'][new Date().getDay()]}</span>
                <h2 className="text-2xl font-extrabold text-white md:text-3xl">
                  Bem-vindo de volta!
                </h2>
              </div>
              <p className="text-white/90 text-lg mb-4">
                Voce ja ganhou <span className="font-bold text-[#FFD93D]">{profile?.estrelas || 0} estrelas</span> esta semana!
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur text-white">
                  <Trophy className="h-5 w-5 text-[#FFD93D]" />
                  <span className="font-bold">Nivel {nivel}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur text-white">
                  <Star className="h-5 w-5 fill-[#FFD93D] text-[#FFD93D]" />
                  <span className="font-bold">{profile?.estrelas || 0} estrelas</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {!isPremium && (
                <Button 
                  size="lg" 
                  className="bg-white text-[#FF6B9D] hover:bg-white/90 font-bold rounded-xl shadow-lg"
                  asChild
                >
                  <Link href="/app/premium">
                    <Crown className="mr-2 h-5 w-5" />
                    Seja Premium
                  </Link>
                </Button>
              )}
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-bold rounded-xl"
                asChild
              >
                <Link href="/app/conquistas">
                  <Trophy className="mr-2 h-5 w-5" />
                  Ver Conquistas
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-[#FFD93D]" />
          <h3 className="text-xl font-bold text-foreground">Comecar Rapido</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActivities.map((activity) => (
            <Link key={activity.name} href={activity.href}>
              <Card className="group cursor-pointer border-3 border-transparent hover:border-[#FFE4EC] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <div className={`mx-auto mb-2 w-16 h-16 rounded-2xl ${activity.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg`}>
                    {activity.emoji}
                  </div>
                  <span className="font-bold text-foreground">{activity.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Usage Stats (Free users only) */}
      {!isPremium && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#A66CFF]" />
              Seu Progresso Hoje
            </h3>
            <Button variant="ghost" className="text-[#FF6B9D] hover:bg-[#FFE4EC]" asChild>
              <Link href="/app/premium">
                Quero ilimitado
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-3 border-[#FFE4EC] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#A66CFF]">
                      <Palette className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Desenhos</p>
                      <p className="text-sm text-muted-foreground">{Math.max(0, desenhosRestantes)} restantes</p>
                    </div>
                  </div>
                  <span className="text-2xl font-extrabold text-[#FF6B9D]">
                    {profile?.desenhos_gratis_usados || 0}/{FREE_LIMITS.desenhos}
                  </span>
                </div>
                <Progress 
                  value={((profile?.desenhos_gratis_usados || 0) / FREE_LIMITS.desenhos) * 100} 
                  className="h-4 bg-[#FFE4EC]"
                />
              </CardContent>
            </Card>
            <Card className="border-3 border-[#E8F8EA] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6BCB77] to-[#1DD1A1]">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Atividades</p>
                      <p className="text-sm text-muted-foreground">{Math.max(0, atividadesRestantes)} restantes</p>
                    </div>
                  </div>
                  <span className="text-2xl font-extrabold text-[#6BCB77]">
                    {profile?.atividades_gratis_usadas || 0}/{FREE_LIMITS.atividades}
                  </span>
                </div>
                <Progress 
                  value={((profile?.atividades_gratis_usadas || 0) / FREE_LIMITS.atividades) * 100} 
                  className="h-4 bg-[#E8F8EA]"
                />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* XP Progress */}
      <Card className="border-3 border-[#FFF8E1] bg-gradient-to-r from-[#FFF8E1]/50 to-[#FFE4EC]/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] text-3xl shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-foreground">Nivel {nivel}</h4>
                <p className="text-muted-foreground">Continue assim para subir de nivel!</p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progresso para nivel {nivel + 1}</span>
                <span className="font-bold text-[#FF9F43]">{xpProgress}/{XP_PER_LEVEL} XP</span>
              </div>
              <Progress value={(xpProgress / XP_PER_LEVEL) * 100} className="h-4 bg-[#FFF8E1]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FF6B9D]" />
            O que voce quer fazer?
          </h3>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className={`group cursor-pointer border-3 border-transparent hover:border-[#FFE4EC] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${category.bgColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} shadow-lg group-hover:scale-110 transition-transform`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-3xl">{category.emoji}</span>
                  </div>
                  <h4 className="mb-1 text-lg font-bold text-foreground">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Activities */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 fill-[#FFD93D] text-[#FFD93D]" />
            Destaques da Semana
          </h3>
          <Button variant="ghost" className="text-[#6BCB77] hover:bg-[#E8F8EA]" asChild>
            <Link href="/app/colorir">
              Ver todos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredActivities?.map((activity: Activity) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              isPremium={isPremium}
            />
          ))}
        </div>
      </section>

      {/* Recent Achievements */}
      {userAchievements && userAchievements.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#FFD93D]" />
              Conquistas Recentes
            </h3>
            <Button variant="ghost" className="text-[#A66CFF] hover:bg-[#F3E8FF]" asChild>
              <Link href="/app/conquistas">
                Ver todas
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {userAchievements.map((ua: any) => (
              <Card key={ua.id} className="border-3 border-[#FFF8E1] bg-gradient-to-r from-[#FFF8E1]/50 to-[#FFE4EC]/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] text-2xl shadow-lg">
                    {ua.achievement?.icone === 'palette' ? '🎨' : 
                     ua.achievement?.icone === 'brush' ? '🖌️' :
                     ua.achievement?.icone === 'book' ? '📚' :
                     ua.achievement?.icone === 'flame' ? '🔥' : '⭐'}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{ua.achievement?.nome}</p>
                    <p className="text-sm text-muted-foreground">+{ua.achievement?.estrelas_reward} estrelas</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
