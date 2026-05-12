'use client'

import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Star, Trophy, Sparkles, X } from 'lucide-react'
import { useConfetti } from '@/hooks/use-confetti'

interface RewardModalProps {
  open: boolean
  onClose: () => void
  type: 'stars' | 'achievement' | 'level_up' | 'activity_complete'
  data?: {
    stars?: number
    xp?: number
    achievementName?: string
    achievementIcon?: string
    newLevel?: number
    message?: string
  }
}

export function RewardModal({ open, onClose, type, data }: RewardModalProps) {
  const { fireStars, fireSchoolPride, fireSideCannons } = useConfetti()

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (type === 'level_up') {
          fireSchoolPride()
        } else if (type === 'achievement') {
          fireSideCannons()
        } else {
          fireStars()
        }
      }, 200)
    }
  }, [open, type, fireStars, fireSchoolPride, fireSideCannons])

  const getContent = () => {
    switch (type) {
      case 'stars':
        return {
          title: 'Parabens!',
          subtitle: 'Voce ganhou estrelas!',
          icon: '⭐',
          gradient: 'from-[#FFD93D] to-[#FF9F43]',
          value: `+${data?.stars || 0}`,
          valueLabel: 'estrelas',
        }
      case 'achievement':
        return {
          title: 'Nova Conquista!',
          subtitle: data?.achievementName || 'Voce desbloqueou uma conquista!',
          icon: data?.achievementIcon || '🏆',
          gradient: 'from-[#A66CFF] to-[#FF6B9D]',
          value: `+${data?.stars || 0}`,
          valueLabel: 'estrelas',
        }
      case 'level_up':
        return {
          title: 'Subiu de Nivel!',
          subtitle: `Voce alcancou o nivel ${data?.newLevel}!`,
          icon: '🚀',
          gradient: 'from-[#6BCB77] to-[#1DD1A1]',
          value: `Nivel ${data?.newLevel}`,
          valueLabel: '',
        }
      case 'activity_complete':
        return {
          title: 'Muito Bem!',
          subtitle: data?.message || 'Atividade completada!',
          icon: '🎉',
          gradient: 'from-[#FF6B9D] to-[#A66CFF]',
          value: `+${data?.xp || 10}`,
          valueLabel: 'XP',
        }
      default:
        return {
          title: 'Parabens!',
          subtitle: 'Continue assim!',
          icon: '🌟',
          gradient: 'from-[#FFD93D] to-[#FF9F43]',
          value: '',
          valueLabel: '',
        }
    }
  }

  const content = getContent()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 p-0 overflow-hidden bg-transparent shadow-none">
        <div className={`relative bg-gradient-to-br ${content.gradient} rounded-3xl p-8 text-center text-white shadow-2xl`}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur animate-bounce text-6xl">
            {content.icon}
          </div>

          {/* Title */}
          <h2 className="mb-2 text-3xl font-extrabold">{content.title}</h2>
          <p className="mb-6 text-white/90 text-lg">{content.subtitle}</p>

          {/* Value */}
          {content.value && (
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="px-6 py-3 rounded-2xl bg-white/20 backdrop-blur">
                <span className="text-3xl font-extrabold">{content.value}</span>
                {content.valueLabel && (
                  <span className="ml-2 text-xl text-white/80">{content.valueLabel}</span>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          {data?.xp && type !== 'activity_complete' && (
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold">+{data.xp} XP</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full bg-white text-foreground hover:bg-white/90 font-bold text-lg rounded-xl h-14 shadow-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
