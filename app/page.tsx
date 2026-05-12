import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Palette, 
  BookOpen, 
  Calculator, 
  Globe, 
  Star, 
  Check, 
  Sparkles,
  Heart,
  Download,
  Shield
} from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/types'

const features = [
  {
    icon: Palette,
    title: 'Desenhos para Colorir',
    description: 'Centenas de desenhos divertidos de animais, natureza, veiculos e muito mais!',
    color: 'bg-[oklch(0.7_0.18_330)]',
  },
  {
    icon: BookOpen,
    title: 'Alfabetizacao',
    description: 'Aprenda o alfabeto e forme palavras com atividades interativas.',
    color: 'bg-[oklch(0.65_0.18_150)]',
  },
  {
    icon: Calculator,
    title: 'Matematica',
    description: 'Numeros, contas e raciocinio logico de forma divertida.',
    color: 'bg-[oklch(0.7_0.15_200)]',
  },
  {
    icon: Globe,
    title: 'Ingles',
    description: 'Aprenda ingles com cores, animais e palavras do dia a dia.',
    color: 'bg-[oklch(0.75_0.15_45)]',
  },
]

const benefits = [
  { icon: Heart, text: 'Conteudo feito por educadores' },
  { icon: Shield, text: 'Ambiente seguro para criancas' },
  { icon: Download, text: 'Atividades para imprimir' },
  { icon: Sparkles, text: 'Novos conteudos toda semana' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Palette className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Colorir e Aprender</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Recursos
            </Link>
            <Link href="#precos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Precos
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/entrar">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/cadastro">Comecar Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 top-1/2 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Star className="h-4 w-4" />
              Para criancas de 3 a 10 anos
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Aprender nunca foi tao{' '}
              <span className="text-primary">divertido</span>
            </h1>
            <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl">
              Desenhos para colorir, atividades de alfabetizacao, matematica e ingles. 
              Tudo pensado para o desenvolvimento do seu filho.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full text-lg sm:w-auto" asChild>
                <Link href="/cadastro">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Comecar Gratis
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full text-lg sm:w-auto" asChild>
                <Link href="#recursos">Conhecer Recursos</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Sem cartao de credito. Cancele quando quiser.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Tudo que seu filho precisa para aprender
            </h2>
            <p className="text-lg text-muted-foreground">
              Conteudo educativo de qualidade, desenvolvido por especialistas em educacao infantil.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="group relative overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.text} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="font-medium text-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Escolha o plano ideal
            </h2>
            <p className="text-lg text-muted-foreground">
              Comece gratis e desbloqueie todo o conteudo com o Premium.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {SUBSCRIPTION_PLANS.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden ${index === 1 ? 'border-2 border-primary shadow-xl' : ''}`}
              >
                {index === 1 && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    Recomendado
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h3>
                  <div className="mb-6">
                    {plan.priceMonthly === 0 ? (
                      <span className="text-4xl font-bold text-foreground">Gratis</span>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold text-foreground">
                          R$ {(plan.priceMonthly / 100).toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-muted-foreground">/mes</span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          ou R$ {(plan.priceYearly / 100).toFixed(2).replace('.', ',')}/ano (economia de 37%)
                        </p>
                      </div>
                    )}
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={index === 1 ? 'default' : 'outline'}
                    size="lg"
                    asChild
                  >
                    <Link href="/cadastro">
                      {index === 0 ? 'Comecar Gratis' : 'Assinar Premium'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Pronto para comecar?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80">
            Junte-se a milhares de familias que ja estao aprendendo e se divertindo com o Colorir e Aprender.
          </p>
          <Button size="lg" variant="secondary" className="text-lg" asChild>
            <Link href="/cadastro">
              <Sparkles className="mr-2 h-5 w-5" />
              Criar Conta Gratis
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Palette className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Colorir e Aprender</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6">
              <Link href="#recursos" className="text-sm text-muted-foreground hover:text-foreground">
                Recursos
              </Link>
              <Link href="#precos" className="text-sm text-muted-foreground hover:text-foreground">
                Precos
              </Link>
              <Link href="/termos" className="text-sm text-muted-foreground hover:text-foreground">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-foreground">
                Privacidade
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              2024 Colorir e Aprender. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
