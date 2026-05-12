import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Crown, Lock, Star, Play } from 'lucide-react'
import { Activity } from '@/lib/types'

interface ActivityCardProps {
  activity: Activity
  isPremium: boolean
}

const categoryColors: Record<string, { bg: string; border: string; gradient: string }> = {
  colorir: { bg: 'bg-[#FFE4EC]', border: 'border-[#FF6B9D]', gradient: 'from-[#FF6B9D] to-[#A66CFF]' },
  alfabetizacao: { bg: 'bg-[#E8F8EA]', border: 'border-[#6BCB77]', gradient: 'from-[#6BCB77] to-[#1DD1A1]' },
  matematica: { bg: 'bg-[#E8F0FF]', border: 'border-[#4D96FF]', gradient: 'from-[#4D96FF] to-[#A66CFF]' },
  ingles: { bg: 'bg-[#FFF8E1]', border: 'border-[#FFD93D]', gradient: 'from-[#FFD93D] to-[#FF9F43]' },
  jogo: { bg: 'bg-[#F3E8FF]', border: 'border-[#A66CFF]', gradient: 'from-[#A66CFF] to-[#FF6B9D]' },
  imprimir: { bg: 'bg-[#FFF0E8]', border: 'border-[#FF9F43]', gradient: 'from-[#FF9F43] to-[#FFD93D]' },
}

export function ActivityCard({ activity, isPremium }: ActivityCardProps) {
  const isLocked = activity.is_premium && !isPremium
  const colors = categoryColors[activity.tipo] || categoryColors.colorir
  
  const getActivityHref = () => {
    if (isLocked) return '/app/premium'
    switch (activity.tipo) {
      case 'colorir':
        return `/app/colorir/${activity.id}`
      case 'alfabetizacao':
        return `/app/alfabetizacao/${activity.id}`
      case 'matematica':
        return `/app/matematica/${activity.id}`
      case 'ingles':
        return `/app/ingles/${activity.id}`
      default:
        return `/app/atividade/${activity.id}`
    }
  }

  return (
    <Link href={getActivityHref()}>
      <Card className={`group relative cursor-pointer overflow-hidden transition-all duration-300 border-3 border-transparent hover:border-[#FFE4EC] hover:shadow-xl hover:-translate-y-2 ${colors.bg}`}>
        {/* SVG Preview */}
        <div className="relative aspect-square p-4 overflow-hidden">
          {activity.svg_data ? (
            <div 
              className="flex h-full w-full items-center justify-center text-foreground/70 group-hover:scale-110 transition-transform duration-300"
              dangerouslySetInnerHTML={{ __html: activity.svg_data }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-6xl group-hover:scale-110 transition-transform">
                {activity.tipo === 'colorir' ? '🎨' :
                 activity.tipo === 'alfabetizacao' ? '📚' :
                 activity.tipo === 'matematica' ? '🔢' :
                 activity.tipo === 'ingles' ? '🌍' : '🎮'}
              </span>
            </div>
          )}
          
          {/* Premium Badge */}
          {activity.is_premium && (
            <div className="absolute right-3 top-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] text-white text-xs font-bold shadow-lg">
              <Crown className="h-3 w-3" />
              Premium
            </div>
          )}
          
          {/* Play button overlay */}
          {!isLocked && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${colors.gradient} shadow-xl`}>
                <Play className="h-8 w-8 text-white fill-white ml-1" />
              </div>
            </div>
          )}
          
          {/* Lock Overlay */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] shadow-lg">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm font-bold text-[#FF9F43]">Desbloquear</span>
              </div>
            </div>
          )}

          {/* Featured star */}
          {activity.is_featured && !activity.is_premium && (
            <div className="absolute left-3 top-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-[#FFD93D] text-xs font-bold shadow-md">
              <Star className="h-3 w-3 fill-current" />
              Destaque
            </div>
          )}
        </div>
        
        <CardContent className="p-4 bg-white/80 backdrop-blur">
          <h4 className="mb-1 font-bold text-foreground line-clamp-1 group-hover:text-[#FF6B9D] transition-colors">
            {activity.titulo}
          </h4>
          {activity.descricao && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {activity.descricao}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${colors.gradient}`}>
              {activity.idade_minima}-{activity.idade_maxima} anos
            </span>
            {activity.is_premium && !isLocked && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F8EA] text-[#6BCB77] text-xs font-medium">
                <Star className="h-3 w-3" />
                +5 XP
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
