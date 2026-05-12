import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Lock
} from 'lucide-react'
import { FREE_LIMITS, Activity } from '@/lib/types'
import { ActivityCard } from '@/components/app/activity-card'

const categories = [
  { 
    name: 'Colorir', 
    href: '/app/colorir', 
    icon: Palette, 
    color: 'bg-[oklch(0.7_0.18_330)]',
    description: 'Desenhos divertidos'
  },
  { 
    name: 'Alfabetizacao', 
    href: '/app/alfabetizacao', 
    icon: BookOpen, 
    color: 'bg-[oklch(0.65_0.18_150)]',
    description: 'Aprenda as letras'
  },
  { 
    name: 'Matematica', 
    href: '/app/matematica', 
    icon: Calculator, 
    color: 'bg-[oklch(0.7_0.15_200)]',
    description: 'Numeros e contas'
  },
  { 
    name: 'Ingles', 
    href: '/app/ingles', 
    icon: Globe, 
    color: 'bg-[oklch(0.75_0.15_45)]',
    description: 'Learn English'
  },
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

  const isPremium = profile?.plano === 'premium'
  const desenhosRestantes = isPremium ? -1 : FREE_LIMITS.desenhos - (profile?.desenhos_gratis_usados || 0)
  const atividadesRestantes = isPremium ? -1 : FREE_LIMITS.atividades - (profile?.atividades_gratis_usadas || 0)

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-primary to-primary/80">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-primary-foreground md:text-3xl">
                Bem-vindo de volta!
              </h2>
              <p className="text-primary-foreground/80">
                Que tal aprender algo novo hoje?
              </p>
            </div>
            {!isPremium && (
              <Button variant="secondary" size="lg" asChild>
                <Link href="/app/premium">
                  <Crown className="mr-2 h-5 w-5" />
                  Seja Premium
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats (Free users only) */}
      {!isPremium && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Desenhos hoje</p>
                  <p className="text-2xl font-bold">{Math.max(0, desenhosRestantes)} restantes</p>
                </div>
                <Palette className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <Progress 
                value={((profile?.desenhos_gratis_usados || 0) / FREE_LIMITS.desenhos) * 100} 
                className="mt-4 h-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Atividades hoje</p>
                  <p className="text-2xl font-bold">{Math.max(0, atividadesRestantes)} restantes</p>
                </div>
                <BookOpen className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <Progress 
                value={((profile?.atividades_gratis_usadas || 0) / FREE_LIMITS.atividades) * 100} 
                className="mt-4 h-2"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Categories */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">Categorias</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${category.color}`}>
                    <category.icon className="h-7 w-7 text-white" />
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
          <h3 className="text-xl font-bold text-foreground">
            <Star className="mr-2 inline-block h-5 w-5 text-accent" />
            Destaques
          </h3>
          <Button variant="ghost" asChild>
            <Link href="/app/colorir">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
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
    </div>
  )
}
