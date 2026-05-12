import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Lock } from 'lucide-react'
import { Activity } from '@/lib/types'

interface ActivityCardProps {
  activity: Activity
  isPremium: boolean
}

export function ActivityCard({ activity, isPremium }: ActivityCardProps) {
  const isLocked = activity.is_premium && !isPremium
  
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
      <Card className="group relative cursor-pointer overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
        {/* SVG Preview */}
        <div className="relative aspect-square bg-secondary/30 p-6">
          {activity.svg_data ? (
            <div 
              className="flex h-full w-full items-center justify-center text-foreground/60"
              dangerouslySetInnerHTML={{ __html: activity.svg_data }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
              <span className="text-4xl">🎨</span>
            </div>
          )}
          
          {/* Premium Badge */}
          {activity.is_premium && (
            <Badge 
              className="absolute right-3 top-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
            >
              <Crown className="mr-1 h-3 w-3" />
              Premium
            </Badge>
          )}
          
          {/* Lock Overlay */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <Lock className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Conteudo Premium</span>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h4 className="mb-1 font-bold text-foreground line-clamp-1 group-hover:text-primary">
            {activity.titulo}
          </h4>
          {activity.descricao && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {activity.descricao}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
