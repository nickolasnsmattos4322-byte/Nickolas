'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  Pause,
  Clock,
  Star,
  Lock,
  Crown,
  ChevronLeft,
  ChevronRight,
  Download,
  Award,
  Check,
  Share2,
  Heart,
  Sparkles
} from 'lucide-react'

// Sample video data
const videoData = {
  id: '1',
  titulo: 'Como Desenhar um Dinossauro',
  descricao: 'Aprenda a desenhar um dinossauro T-Rex super fofo passo a passo! Nesta aula você vai aprender técnicas simples para criar seu próprio dinossauro.',
  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  duracao_segundos: 300,
  dificuldade: 'facil',
  is_premium: false,
  views: 1250,
  emoji: '🦖',
  color: 'from-[#6BCB77] to-[#1DD1A1]',
  passos: [
    {
      ordem: 1,
      titulo: 'Desenhe a cabeça',
      descricao: 'Comece desenhando um círculo grande para a cabeça do dinossauro.',
      emoji: '⭕'
    },
    {
      ordem: 2,
      titulo: 'Adicione o corpo',
      descricao: 'Desenhe uma forma oval grande conectada a cabeça.',
      emoji: '🥚'
    },
    {
      ordem: 3,
      titulo: 'Desenhe as pernas',
      descricao: 'Adicione duas pernas grossas com pés grandes.',
      emoji: '🦵'
    },
    {
      ordem: 4,
      titulo: 'Adicione os bracinhos',
      descricao: 'Desenhe dois braços pequenos e fofos.',
      emoji: '💪'
    },
    {
      ordem: 5,
      titulo: 'Cauda e detalhes',
      descricao: 'Adicione a cauda longa e os olhos do dinossauro.',
      emoji: '👀'
    },
    {
      ordem: 6,
      titulo: 'Finalize com cor',
      descricao: 'Pinte seu dinossauro com suas cores favoritas!',
      emoji: '🎨'
    },
  ],
}

function DifficultyBadge({ level }: { level: string }) {
  const config = {
    facil: { label: 'Fácil', color: 'bg-[#6BCB77] text-white' },
    medio: { label: 'Médio', color: 'bg-[#FFD93D] text-[#2D1B4E]' },
    dificil: { label: 'Difícil', color: 'bg-[#FF6B9D] text-white' },
  }
  const { label, color } = config[level as keyof typeof config] || config.facil
  return <Badge className={`${color} font-bold`}>{label}</Badge>
}

export default function VideoAulaDetailPage() {
  const params = useParams()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleStepComplete = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepIndex))
    } else {
      setCompletedSteps([...completedSteps, stepIndex])
    }
  }

  const progress = (completedSteps.length / videoData.passos.length) * 100
  const isComplete = completedSteps.length === videoData.passos.length

  return (
    <div className="space-y-6 pb-8">
      {/* Back button */}
      <Button variant="ghost" className="gap-2" asChild>
        <Link href="/app/videoaulas">
          <ChevronLeft className="h-5 w-5" />
          Voltar para aulas
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className={`relative aspect-video bg-gradient-to-br ${videoData.color} flex items-center justify-center`}>
              <span className="text-[120px] opacity-80">{videoData.emoji}</span>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  {isPlaying ? (
                    <Pause className="h-12 w-12 text-[#FF6B9D]" />
                  ) : (
                    <Play className="h-12 w-12 text-[#FF6B9D] fill-[#FF6B9D] ml-2" />
                  )}
                </div>
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                <Progress value={35} className="h-2 flex-1 bg-white/30" />
                <span className="text-white font-bold text-sm">1:45 / 5:00</span>
              </div>
            </div>
          </Card>

          {/* Video Info */}
          <Card className="border-3 border-[#FFE4EC]">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <DifficultyBadge level={videoData.dificuldade} />
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  5 minutos
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#FFD93D] text-[#FFD93D]" />
                  {videoData.views} visualizações
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
                {videoData.titulo}
              </h1>
              <p className="text-muted-foreground text-lg">
                {videoData.descricao}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className={`gap-2 ${isFavorite ? 'text-[#FF6B9D] border-[#FF6B9D]' : ''}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-[#FF6B9D]' : ''}`} />
                  {isFavorite ? 'Favoritado' : 'Favoritar'}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-5 w-5" />
                  Baixar PDF
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-5 w-5" />
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <Card className="border-3 border-[#E8F8EA]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#6BCB77]" />
                  Passo a Passo
                </h2>
                <span className="text-sm text-muted-foreground">
                  {completedSteps.length}/{videoData.passos.length} concluídos
                </span>
              </div>
              <div className="space-y-4">
                {videoData.passos.map((passo, index) => {
                  const isCompleted = completedSteps.includes(index)
                  const isCurrent = currentStep === index
                  return (
                    <div 
                      key={passo.ordem}
                      onClick={() => {
                        setCurrentStep(index)
                        toggleStepComplete(index)
                      }}
                      className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                        isCurrent 
                          ? 'bg-[#E8F8EA] border-2 border-[#6BCB77]' 
                          : isCompleted
                            ? 'bg-[#E8F8EA]/50'
                            : 'hover:bg-muted'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        isCompleted 
                          ? 'bg-[#6BCB77] text-white' 
                          : 'bg-muted'
                      }`}>
                        {isCompleted ? <Check className="h-6 w-6" /> : passo.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-muted-foreground">PASSO {passo.ordem}</span>
                          {isCompleted && (
                            <Badge className="bg-[#6BCB77] text-white text-xs">Concluído</Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-foreground">{passo.titulo}</h3>
                        <p className="text-sm text-muted-foreground">{passo.descricao}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card className="border-3 border-[#FFF8E1] bg-gradient-to-br from-[#FFF8E1] to-[#FFE4EC]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] flex items-center justify-center text-3xl shadow-lg">
                  {isComplete ? '🏆' : '📝'}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Seu Progresso</h3>
                  <p className="text-sm text-muted-foreground">
                    {isComplete ? 'Parabéns! Aula concluída!' : 'Continue aprendendo!'}
                  </p>
                </div>
              </div>
              <Progress value={progress} className="h-4 bg-white mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                {Math.round(progress)}% concluído
              </p>
              {isComplete && (
                <Button className="w-full mt-4 bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] text-[#2D1B4E] font-bold">
                  <Award className="mr-2 h-5 w-5" />
                  Ganhar Certificado
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Rewards Card */}
          <Card className="border-3 border-[#E8F0FF]">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 fill-[#FFD93D] text-[#FFD93D]" />
                Recompensas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
                  <span className="text-sm font-medium">Assistir aula</span>
                  <span className="font-bold text-[#6BCB77]">+10 XP</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
                  <span className="text-sm font-medium">Completar passos</span>
                  <span className="font-bold text-[#4D96FF]">+5 estrelas</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
                  <span className="text-sm font-medium">Certificado</span>
                  <span className="font-bold text-[#FFD93D]">+1 medalha</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Lessons */}
          <Card className="border-3 border-[#FFE4EC]">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-4">Aulas Relacionadas</h3>
              <div className="space-y-3">
                {[
                  { emoji: '🦁', title: 'Como desenhar um Leão', color: 'bg-[#FFD93D]' },
                  { emoji: '🦄', title: 'Como desenhar um Unicórnio', color: 'bg-[#A66CFF]' },
                  { emoji: '🐶', title: 'Como desenhar um Cachorro', color: 'bg-[#FF9F43]' },
                ].map((lesson, i) => (
                  <Link key={i} href="/app/videoaulas" className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors">
                    <div className={`w-12 h-12 rounded-xl ${lesson.color} flex items-center justify-center text-2xl`}>
                      {lesson.emoji}
                    </div>
                    <span className="font-medium text-foreground text-sm">{lesson.title}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
