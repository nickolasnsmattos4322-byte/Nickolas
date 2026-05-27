'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  Clock,
  Star,
  Lock,
  Crown,
  ChevronRight,
  Download,
  Award,
  Sparkles,
  Video,
  BookOpen,
  Trophy
} from 'lucide-react'

// Sample video lessons data (will come from database)
const videoLessons = [
  {
    id: '1',
    titulo: 'Como Desenhar um Dinossauro',
    descricao: 'Aprenda a desenhar um dinossauro fofo passo a passo!',
    thumbnail_url: null,
    duracao_segundos: 300,
    dificuldade: 'facil',
    is_premium: false,
    is_featured: true,
    views: 1250,
    emoji: '🦖',
    color: 'from-[#6BCB77] to-[#1DD1A1]',
  },
  {
    id: '2',
    titulo: 'Como Desenhar um Unicornio',
    descricao: 'Crie um unicornio magico com brilho e arco-iris!',
    thumbnail_url: null,
    duracao_segundos: 420,
    dificuldade: 'medio',
    is_premium: false,
    is_featured: true,
    views: 980,
    emoji: '🦄',
    color: 'from-[#A66CFF] to-[#FF6B9D]',
  },
  {
    id: '3',
    titulo: 'Como Desenhar um Leao',
    descricao: 'Desenhe o rei da selva com juba incrivel!',
    thumbnail_url: null,
    duracao_segundos: 360,
    dificuldade: 'medio',
    is_premium: false,
    is_featured: false,
    views: 756,
    emoji: '🦁',
    color: 'from-[#FFD93D] to-[#FF9F43]',
  },
  {
    id: '4',
    titulo: 'Como Desenhar um Foguete',
    descricao: 'Crie um foguete espacial pronto para decolar!',
    thumbnail_url: null,
    duracao_segundos: 240,
    dificuldade: 'facil',
    is_premium: false,
    is_featured: false,
    views: 654,
    emoji: '🚀',
    color: 'from-[#4D96FF] to-[#A66CFF]',
  },
  {
    id: '5',
    titulo: 'Como Desenhar uma Princesa',
    descricao: 'Desenhe uma princesa linda com vestido e coroa!',
    thumbnail_url: null,
    duracao_segundos: 480,
    dificuldade: 'dificil',
    is_premium: true,
    is_featured: true,
    views: 1100,
    emoji: '👸',
    color: 'from-[#FF6B9D] to-[#A66CFF]',
  },
  {
    id: '6',
    titulo: 'Como Desenhar um Cachorro',
    descricao: 'Aprenda a desenhar um cachorrinho fofo!',
    thumbnail_url: null,
    duracao_segundos: 300,
    dificuldade: 'facil',
    is_premium: true,
    is_featured: false,
    views: 890,
    emoji: '🐶',
    color: 'from-[#FF9F43] to-[#FFD93D]',
  },
  {
    id: '7',
    titulo: 'Como Desenhar um Gato',
    descricao: 'Crie um gatinho adoravel com olhos brilhantes!',
    thumbnail_url: null,
    duracao_segundos: 280,
    dificuldade: 'facil',
    is_premium: true,
    is_featured: false,
    views: 720,
    emoji: '🐱',
    color: 'from-[#6BCB77] to-[#4D96FF]',
  },
  {
    id: '8',
    titulo: 'Como Desenhar um Dragao',
    descricao: 'Desenhe um dragao magico com asas e fogo!',
    thumbnail_url: null,
    duracao_segundos: 600,
    dificuldade: 'dificil',
    is_premium: true,
    is_featured: true,
    views: 1500,
    emoji: '🐉',
    color: 'from-[#FF4757] to-[#FF6B9D]',
  },
]

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

function DifficultyBadge({ level }: { level: string }) {
  const config = {
    facil: { label: 'Facil', color: 'bg-[#6BCB77] text-white' },
    medio: { label: 'Medio', color: 'bg-[#FFD93D] text-[#2D1B4E]' },
    dificil: { label: 'Dificil', color: 'bg-[#FF6B9D] text-white' },
  }
  const { label, color } = config[level as keyof typeof config] || config.facil
  return <Badge className={`${color} font-bold`}>{label}</Badge>
}

interface VideoaulaPageProps {
  isPremium?: boolean
}

export default function VideoaulasPage({ isPremium = false }: VideoaulaPageProps) {
  const [filter, setFilter] = useState<'todos' | 'facil' | 'medio' | 'dificil'>('todos')
  
  const filteredLessons = filter === 'todos' 
    ? videoLessons 
    : videoLessons.filter(v => v.dificuldade === filter)

  const featuredLessons = videoLessons.filter(v => v.is_featured)

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Banner */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#4D96FF] via-[#A66CFF] to-[#FF6B9D] shadow-2xl">
        <CardContent className="p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"/>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl">🎨</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                    Aprenda a Desenhar!
                  </h1>
                  <p className="text-white/90 text-lg">
                    Videoaulas passo a passo para criar desenhos incriveis
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur text-white">
                  <Video className="h-5 w-5" />
                  <span className="font-bold">{videoLessons.length} aulas</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur text-white">
                  <Award className="h-5 w-5 text-[#FFD93D]" />
                  <span className="font-bold">Certificados</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur text-white">
                  <Download className="h-5 w-5" />
                  <span className="font-bold">PDFs para imprimir</span>
                </div>
              </div>
            </div>
            {!isPremium && (
              <Button 
                size="lg" 
                className="bg-white text-[#A66CFF] hover:bg-white/90 font-bold rounded-xl shadow-lg"
                asChild
              >
                <Link href="/app/premium">
                  <Crown className="mr-2 h-5 w-5" />
                  Liberar Todas as Aulas
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Featured Lessons */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-[#FFD93D]" />
          <h2 className="text-2xl font-bold text-foreground">Aulas em Destaque</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredLessons.slice(0, 4).map((lesson) => (
            <Link key={lesson.id} href={`/app/videoaulas/${lesson.id}`}>
              <Card className="group cursor-pointer border-3 border-transparent hover:border-[#FFE4EC] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden h-full">
                <CardContent className="p-0">
                  <div className={`relative aspect-video bg-gradient-to-br ${lesson.color} flex items-center justify-center`}>
                    <span className="text-6xl group-hover:scale-110 transition-transform">{lesson.emoji}</span>
                    {lesson.is_premium && !isPremium && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD93D] text-[#2D1B4E] font-bold">
                          <Lock className="h-5 w-5" />
                          Premium
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 text-white text-sm">
                      <Clock className="h-4 w-4" />
                      {formatDuration(lesson.duracao_segundos)}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                        <Play className="h-8 w-8 text-[#FF6B9D] fill-[#FF6B9D] ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DifficultyBadge level={lesson.dificuldade} />
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[#FFD93D] text-[#FFD93D]" />
                        {lesson.views}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground mb-1 line-clamp-1">{lesson.titulo}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{lesson.descricao}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Filter Tabs */}
      <section>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Video className="h-6 w-6 text-[#4D96FF]" />
            Todas as Aulas
          </h2>
          <div className="flex items-center gap-2 p-1 rounded-xl bg-muted">
            {[
              { key: 'todos', label: 'Todas' },
              { key: 'facil', label: 'Facil' },
              { key: 'medio', label: 'Medio' },
              { key: 'dificil', label: 'Dificil' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  filter === tab.key
                    ? 'bg-white shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <Link key={lesson.id} href={`/app/videoaulas/${lesson.id}`}>
              <Card className="group cursor-pointer border-3 border-transparent hover:border-[#FFE4EC] transition-all duration-300 hover:shadow-xl overflow-hidden h-full">
                <CardContent className="p-0 flex">
                  <div className={`relative w-32 h-32 flex-shrink-0 bg-gradient-to-br ${lesson.color} flex items-center justify-center`}>
                    <span className="text-4xl group-hover:scale-110 transition-transform">{lesson.emoji}</span>
                    {lesson.is_premium && !isPremium && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DifficultyBadge level={lesson.dificuldade} />
                        {lesson.is_premium && (
                          <Badge className="bg-[#FFD93D] text-[#2D1B4E] font-bold">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-foreground mb-1">{lesson.titulo}</h3>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(lesson.duracao_segundos)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[#FFD93D] text-[#FFD93D]" />
                        {lesson.views}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      {!isPremium && (
        <Card className="overflow-hidden border-3 border-[#FFD93D] bg-gradient-to-r from-[#FFF8E1] to-[#FFE4EC]">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🌟</div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Desbloqueie todas as aulas!
                </h3>
                <p className="text-muted-foreground">
                  Acesso ilimitado a videoaulas, certificados e PDFs exclusivos
                </p>
              </div>
            </div>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#FF6B9D] to-[#A66CFF] hover:opacity-90 font-bold rounded-xl shadow-lg"
              asChild
            >
              <Link href="/app/premium">
                <Crown className="mr-2 h-5 w-5" />
                Seja Premium
                <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
