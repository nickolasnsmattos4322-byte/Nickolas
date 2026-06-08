'use client'

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
  Shield,
  Trophy,
  Gamepad2,
  Printer,
  Crown,
  Zap,
  Music,
  ChevronRight,
  Play
} from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/types'
import { useState, useEffect } from 'react'

// Mascote Dino SVG Component
function DinoMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* Body */}
      <ellipse cx="100" cy="130" rx="55" ry="45" fill="#6BCB77"/>
      <ellipse cx="100" cy="130" rx="45" ry="35" fill="#5DB868"/>
      {/* Head */}
      <circle cx="100" cy="75" r="45" fill="#6BCB77"/>
      <circle cx="100" cy="80" r="35" fill="#5DB868"/>
      {/* Eyes */}
      <circle cx="82" cy="70" r="14" fill="white"/>
      <circle cx="118" cy="70" r="14" fill="white"/>
      <circle cx="85" cy="72" r="8" fill="#2D1B4E"/>
      <circle cx="121" cy="72" r="8" fill="#2D1B4E"/>
      <circle cx="87" cy="69" r="3" fill="white"/>
      <circle cx="123" cy="69" r="3" fill="white"/>
      {/* Smile */}
      <path d="M75 95 Q100 115 125 95" stroke="#2D1B4E" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <circle cx="65" cy="88" r="8" fill="#FF6B9D" opacity="0.5"/>
      <circle cx="135" cy="88" r="8" fill="#FF6B9D" opacity="0.5"/>
      {/* Spikes */}
      <circle cx="100" cy="30" r="12" fill="#FFD93D"/>
      <circle cx="75" cy="38" r="10" fill="#FFD93D"/>
      <circle cx="125" cy="38" r="10" fill="#FFD93D"/>
      {/* Arms */}
      <ellipse cx="50" cy="120" rx="15" ry="20" fill="#6BCB77" transform="rotate(-20 50 120)"/>
      <ellipse cx="150" cy="120" rx="15" ry="20" fill="#6BCB77" transform="rotate(20 150 120)"/>
      {/* Legs */}
      <ellipse cx="75" cy="165" rx="18" ry="12" fill="#6BCB77"/>
      <ellipse cx="125" cy="165" rx="18" ry="12" fill="#6BCB77"/>
    </svg>
  )
}

// Floating shapes for background
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#FFD93D] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}/>
      <div className="absolute top-40 right-20 w-16 h-16 bg-[#FF6B9D] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }}/>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-[#4D96FF] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}/>
      <div className="absolute bottom-20 right-10 w-14 h-14 bg-[#6BCB77] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}/>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[#A66CFF] rounded-full opacity-15 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}/>
      {/* Stars */}
      <Star className="absolute top-32 right-1/4 w-8 h-8 text-[#FFD93D] opacity-30 animate-pulse"/>
      <Star className="absolute bottom-32 left-1/3 w-6 h-6 text-[#FF6B9D] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}/>
      <Sparkles className="absolute top-1/3 right-10 w-10 h-10 text-[#A66CFF] opacity-25 animate-pulse" style={{ animationDelay: '0.5s' }}/>
    </div>
  )
}

const categories = [
  { icon: Palette, name: 'Colorir', slug: 'colorir', color: 'bg-[#FF6B9D]', desc: 'Desenhos lindos', count: '500+' },
  { icon: BookOpen, name: 'Alfabeto', slug: 'alfabetizacao', color: 'bg-[#6BCB77]', desc: 'Letras e palavras', count: '200+' },
  { icon: Calculator, name: 'Números', slug: 'matematica', color: 'bg-[#4D96FF]', desc: 'Matemática divertida', count: '150+' },
  { icon: Globe, name: 'Inglês', slug: 'ingles', color: 'bg-[#FFD93D] text-[#2D1B4E]', desc: 'Aprenda brincando', count: '100+' },
  { icon: Gamepad2, name: 'Jogos', slug: 'jogos', color: 'bg-[#A66CFF]', desc: 'Games educativos', count: '50+' },
  { icon: Printer, name: 'Imprimir', slug: 'imprimir', color: 'bg-[#FF9F43]', desc: 'Atividades em PDF', count: '300+' },
]

const features = [
  {
    icon: Palette,
    title: 'Desenhos Mágicos',
    description: 'Mais de 500 desenhos lindos de animais, dinossauros, unicórnios, princesas e muito mais!',
    color: 'from-[#FF6B9D] to-[#FF9F43]',
    bgColor: 'bg-[#FFE4EC]',
  },
  {
    icon: BookOpen,
    title: 'Aprenda o ABC',
    description: 'Atividades divertidas para aprender o alfabeto, formar palavras e começar a ler!',
    color: 'from-[#6BCB77] to-[#1DD1A1]',
    bgColor: 'bg-[#E8F8EA]',
  },
  {
    icon: Calculator,
    title: 'Números Divertidos',
    description: 'Conte, some e brinque com os números de um jeito super legal e colorido!',
    color: 'from-[#4D96FF] to-[#A66CFF]',
    bgColor: 'bg-[#E8F0FF]',
  },
  {
    icon: Globe,
    title: 'Hello English!',
    description: 'Aprenda inglês com cores, animais e palavras do dia a dia cantando e brincando!',
    color: 'from-[#FFD93D] to-[#FF9F43]',
    bgColor: 'bg-[#FFF8E1]',
  },
]

const benefits = [
  { icon: Heart, text: 'Feito com amor por educadores', color: 'text-[#FF6B9D]' },
  { icon: Shield, text: 'Ambiente 100% seguro', color: 'text-[#6BCB77]' },
  { icon: Trophy, text: 'Ganhe estrelas e medalhas', color: 'text-[#FFD93D]' },
  { icon: Download, text: 'Baixe e imprima em casa', color: 'text-[#4D96FF]' },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-[#FFE4EC] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#FF9F43] shadow-lg group-hover:scale-110 transition-transform">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD93D]">
                <Star className="h-4 w-4 text-[#2D1B4E]" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#A66CFF] bg-clip-text text-transparent">
                Colorir e Aprender
              </span>
              <p className="text-xs text-muted-foreground">Diversão que ensina!</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            <Link href="#categorias" className="text-base font-semibold text-muted-foreground hover:text-[#FF6B9D] transition-colors flex items-center gap-1">
              <Sparkles className="h-4 w-4" /> Categorias
            </Link>
            <Link href="#recursos" className="text-base font-semibold text-muted-foreground hover:text-[#6BCB77] transition-colors flex items-center gap-1">
              <Star className="h-4 w-4" /> Recursos
            </Link>
            <Link href="#precos" className="text-base font-semibold text-muted-foreground hover:text-[#4D96FF] transition-colors flex items-center gap-1">
              <Crown className="h-4 w-4" /> Planos
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-base font-semibold hover:bg-[#FFE4EC]" asChild>
              <Link href="/entrar">Entrar</Link>
            </Button>
            <Button 
              className="text-base font-bold bg-gradient-to-r from-[#FF6B9D] to-[#FF9F43] hover:opacity-90 shadow-lg shadow-[#FF6B9D]/30 rounded-xl px-6"
              asChild
            >
              <Link href="/cadastro">
                Começar Grátis!
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <FloatingShapes />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className={`mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFE4EC] to-[#FFF0F5] px-5 py-2.5 text-sm font-bold text-[#FF6B9D] border-2 border-[#FFE4EC] ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : ''}`}>
                <Star className="h-5 w-5 fill-[#FFD93D] text-[#FFD93D]" />
                Para crianças de 3 a 10 anos
                <Sparkles className="h-5 w-5" />
              </div>
              <h1 className={`mb-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100' : ''}`}>
                <span className="text-foreground">Aprender e</span>
                <br />
                <span className="bg-gradient-to-r from-[#FF6B9D] via-[#A66CFF] to-[#4D96FF] bg-clip-text text-transparent">
                  Brincar junto!
                </span>
              </h1>
              <p className={`mb-8 text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200' : ''}`}>
                Centenas de desenhos para colorir, jogos educativos, atividades de alfabetização, matemática e inglês. 
                <span className="font-bold text-[#6BCB77]"> Tudo GRÁTIS!</span>
              </p>
              <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300' : ''}`}>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg font-bold bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] hover:opacity-90 shadow-xl shadow-[#6BCB77]/30 rounded-2xl px-8 h-14"
                  asChild
                >
                  <Link href="/cadastro">
                    <Play className="mr-2 h-6 w-6 fill-white" />
                    Começar a Brincar!
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-lg font-bold border-3 border-[#4D96FF] text-[#4D96FF] hover:bg-[#4D96FF] hover:text-white rounded-2xl px-8 h-14"
                  asChild
                >
                  <Link href="#categorias">
                    Ver Atividades
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className={`mt-8 flex items-center justify-center lg:justify-start gap-6 ${mounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400' : ''}`}>
                <div className="flex -space-x-3">
                  {['#FF6B9D', '#6BCB77', '#4D96FF', '#FFD93D'].map((color, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-3 border-white flex items-center justify-center text-white font-bold text-sm`} style={{ backgroundColor: color }}>
                      {['M', 'L', 'P', 'J'][i]}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-5 w-5 fill-[#FFD93D] text-[#FFD93D]" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    <span className="font-bold text-foreground">10.000+</span> crianças felizes
                  </p>
                </div>
              </div>
            </div>
            <div className={`relative ${mounted ? 'animate-in fade-in zoom-in-95 duration-700 delay-200' : ''}`}>
              <div className="relative w-full max-w-md mx-auto">
                {/* Mascot */}
                <div className="absolute -top-8 -left-8 z-20 animate-bounce" style={{ animationDuration: '2s' }}>
                  <DinoMascot className="w-32 h-32" />
                </div>
                {/* Main card with sample activities */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-[#FFE4EC]">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { color: '#FF6B9D', icon: '🦋', label: 'Borboleta' },
                      { color: '#6BCB77', icon: '🦖', label: 'Dinossauro' },
                      { color: '#4D96FF', icon: '🚀', label: 'Foguete' },
                      { color: '#FFD93D', icon: '🌈', label: 'Arco-íris' },
                    ].map((item, i) => (
                      <div 
                        key={i}
                        className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border-3 transition-transform hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: `${item.color}20`, borderColor: item.color }}
                      >
                        <span className="text-4xl">{item.icon}</span>
                        <span className="font-bold text-sm" style={{ color: item.color }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] rounded-xl p-3 text-white">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-6 w-6" />
                      <span className="font-bold">+15 estrelas hoje!</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-[#FFD93D] text-[#FFD93D]" />
                      <Star className="h-5 w-5 fill-[#FFD93D] text-[#FFD93D]" />
                      <Star className="h-5 w-5 fill-[#FFD93D] text-[#FFD93D]" />
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#A66CFF] rounded-full opacity-20 blur-xl"/>
                <div className="absolute -top-4 -right-8 w-16 h-16 bg-[#FFD93D] rounded-full opacity-30 blur-lg"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categorias" className="py-16 bg-gradient-to-b from-background to-[#FFF0F5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-[#FF6B9D] to-[#A66CFF] bg-clip-text text-transparent">
                O que você quer fazer hoje?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">Escolha uma categoria e comece a diversão!</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                href={`/app/${cat.slug}`}
                className="group"
              >
                <Card className="border-3 border-transparent hover:border-[#FFE4EC] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden">
                  <CardContent className="p-4 text-center">
                    <div className={`mx-auto mb-3 w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <cat.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{cat.desc}</p>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FFE4EC] text-[#FF6B9D] text-xs font-bold">
                      {cat.count}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F0] via-[#FFE4EC]/30 to-[#E8F0FF]/30"/>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F8EA] px-4 py-2 text-sm font-bold text-[#6BCB77] mb-4">
              <Zap className="h-4 w-4" />
              Super poderes para aprender!
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Tudo que seu filho{' '}
              <span className="bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] bg-clip-text text-transparent">
                vai amar!
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Atividades desenvolvidas por especialistas em educação infantil para aprender brincando.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className={`border-3 border-transparent hover:border-[#FFE4EC] transition-all duration-300 hover:shadow-2xl overflow-hidden group ${feature.bgColor}`}
              >
                <CardContent className="p-8">
                  <div className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${feature.color} shadow-xl group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="mb-3 text-2xl font-extrabold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-12 bg-gradient-to-r from-[#FF6B9D] via-[#A66CFF] to-[#4D96FF]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.text} className="flex flex-col items-center text-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <span className="font-bold text-white text-sm md:text-base">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 bg-gradient-to-b from-[#FFF9F0] to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF8E1] px-4 py-2 text-sm font-bold text-[#FF9F43] mb-4">
              <Crown className="h-4 w-4" />
              Planos especiais
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Comece{' '}
              <span className="bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] bg-clip-text text-transparent">
                grátis
              </span>
              {' '}hoje!
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Experimente tudo sem pagar nada. Desbloqueie mais com o Premium!
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {SUBSCRIPTION_PLANS.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                  index === 1 
                    ? 'border-4 border-[#FFD93D] shadow-2xl shadow-[#FFD93D]/20' 
                    : 'border-3 border-[#FFE4EC] hover:border-[#FF6B9D]'
                }`}
              >
                {index === 1 && (
                  <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] px-6 py-2 text-sm font-bold text-white flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Mais Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${index === 0 ? 'bg-[#E8F8EA]' : 'bg-[#FFF8E1]'}`}>
                    {index === 0 ? (
                      <Star className="h-7 w-7 text-[#6BCB77]" />
                    ) : (
                      <Crown className="h-7 w-7 text-[#FF9F43]" />
                    )}
                  </div>
                  <h3 className="mb-2 text-2xl font-extrabold text-foreground">{plan.name}</h3>
                  <div className="mb-6">
                    {plan.priceMonthly === 0 ? (
                      <div>
                        <span className="text-5xl font-extrabold bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] bg-clip-text text-transparent">Grátis</span>
                        <p className="mt-2 text-sm text-muted-foreground">Para sempre!</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-muted-foreground">R$</span>
                          <span className="text-5xl font-extrabold bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] bg-clip-text text-transparent">
                            {(plan.priceMonthly / 100).toFixed(2).replace('.', ',').replace(',00', '')}
                          </span>
                          <span className="text-muted-foreground font-medium">/mes</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          ou <span className="font-bold text-[#6BCB77]">R$ {(plan.priceYearly / 100).toFixed(2).replace('.', ',')}/ano</span> (37% off!)
                        </p>
                      </div>
                    )}
                  </div>
                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${index === 0 ? 'bg-[#E8F8EA]' : 'bg-[#FFF8E1]'}`}>
                          <Check className={`h-4 w-4 ${index === 0 ? 'text-[#6BCB77]' : 'text-[#FF9F43]'}`} />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full h-14 text-lg font-bold rounded-2xl ${
                      index === 1 
                        ? 'bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] hover:opacity-90 shadow-lg shadow-[#FFD93D]/30' 
                        : 'bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] hover:opacity-90 shadow-lg shadow-[#6BCB77]/30'
                    }`}
                    asChild
                  >
                    <Link href="/cadastro">
                      {index === 0 ? 'Começar Grátis!' : 'Assinar Premium'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#FF6B9D] via-[#A66CFF] to-[#4D96FF] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"/>
          <Star className="absolute top-20 right-1/4 w-8 h-8 text-white/30 animate-pulse"/>
          <Sparkles className="absolute bottom-20 left-1/4 w-10 h-10 text-white/30 animate-pulse"/>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <DinoMascot className="w-24 h-24 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Vamos começar a brincadeira?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/90">
            Junte-se a mais de 10.000 crianças que já estão aprendendo e se divertindo!
          </p>
          <Button 
            size="lg" 
            className="bg-white text-[#FF6B9D] hover:bg-white/90 text-lg font-bold px-10 h-16 rounded-2xl shadow-2xl"
            asChild
          >
            <Link href="/cadastro">
              <Play className="mr-2 h-6 w-6 fill-[#FF6B9D]" />
              Criar Conta Grátis!
            </Link>
          </Button>
          <p className="mt-4 text-white/70 text-sm">
            Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-[#FFE4EC] py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#FF9F43]">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-[#FF6B9D] to-[#A66CFF] bg-clip-text text-transparent">
                  Colorir e Aprender
                </span>
                <p className="text-xs text-muted-foreground">Diversão que ensina!</p>
              </div>
            </div>
            <nav className="flex flex-wrap justify-center gap-6">
              <Link href="#categorias" className="text-sm font-medium text-muted-foreground hover:text-[#FF6B9D] transition-colors">
                Categorias
              </Link>
              <Link href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-[#6BCB77] transition-colors">
                Recursos
              </Link>
              <Link href="#precos" className="text-sm font-medium text-muted-foreground hover:text-[#4D96FF] transition-colors">
                Planos
              </Link>
              <Link href="/termos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Feito com <Heart className="h-4 w-4 text-[#FF6B9D] fill-[#FF6B9D]" /> no Brasil
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
