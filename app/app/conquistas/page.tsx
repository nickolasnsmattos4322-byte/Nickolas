import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, Lock, Sparkles, Medal, Crown } from 'lucide-react'
import { Achievement, calculateLevel, calculateLevelProgress, XP_PER_LEVEL } from '@/lib/types'

const iconMap: Record<string, string> = {
  'palette': '🎨',
  'brush': '🖌️',
  'sparkles': '✨',
  'book': '📚',
  'graduation-cap': '🎓',
  'brain': '🧠',
  'flame': '🔥',
  'fire': '🔥',
  'compass': '🧭',
}

export default async function ConquistasPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .order('tipo', { ascending: true })
    .order('requisito', { ascending: true })

  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', user?.id)

  const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || [])
  
  const nivel = profile?.nivel || calculateLevel(profile?.xp || 0)
  const xpProgress = calculateLevelProgress(profile?.xp || 0)
  const totalStars = profile?.estrelas || 0
  const totalAchievements = userAchievements?.length || 0

  // Group achievements by type
  const groupedAchievements = {
    colorir: achievements?.filter(a => a.tipo === 'colorir') || [],
    atividade: achievements?.filter(a => a.tipo === 'atividade') || [],
    sequencia: achievements?.filter(a => a.tipo === 'sequencia') || [],
    especial: achievements?.filter(a => a.tipo === 'especial') || [],
  }

  const typeLabels: Record<string, { label: string; icon: string; gradient: string; bg: string }> = {
    colorir: { label: 'Colorir', icon: '🎨', gradient: 'from-[#FF6B9D] to-[#A66CFF]', bg: 'bg-[#FFE4EC]' },
    atividade: { label: 'Atividades', icon: '📚', gradient: 'from-[#6BCB77] to-[#1DD1A1]', bg: 'bg-[#E8F8EA]' },
    sequencia: { label: 'Sequências', icon: '🔥', gradient: 'from-[#FF9F43] to-[#FFD93D]', bg: 'bg-[#FFF8E1]' },
    especial: { label: 'Especiais', icon: '⭐', gradient: 'from-[#4D96FF] to-[#A66CFF]', bg: 'bg-[#E8F0FF]' },
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-3 border-[#FFF8E1] bg-gradient-to-br from-[#FFF8E1] to-[#FFE4EC]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] shadow-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nível</p>
              <p className="text-3xl font-extrabold text-foreground">{nivel}</p>
              <div className="mt-1 w-24">
                <Progress value={(xpProgress / XP_PER_LEVEL) * 100} className="h-2 bg-white/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-3 border-[#FFF8E1] bg-gradient-to-br from-[#FFE4EC] to-[#FFF0F5]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] shadow-lg">
              <Star className="h-8 w-8 text-white fill-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estrelas</p>
              <p className="text-3xl font-extrabold text-foreground">{totalStars}</p>
              <p className="text-xs text-muted-foreground">coletadas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-3 border-[#E8F8EA] bg-gradient-to-br from-[#E8F8EA] to-[#E8F0FF]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6BCB77] to-[#1DD1A1] shadow-lg">
              <Medal className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conquistas</p>
              <p className="text-3xl font-extrabold text-foreground">{totalAchievements}</p>
              <p className="text-xs text-muted-foreground">de {achievements?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements by Category */}
      {Object.entries(groupedAchievements).map(([type, typeAchievements]) => {
        if (typeAchievements.length === 0) return null
        const typeInfo = typeLabels[type]
        
        return (
          <section key={type}>
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${typeInfo.gradient}`}>
                <span className="text-xl">{typeInfo.icon}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{typeInfo.label}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {typeAchievements.map((achievement: Achievement) => {
                const isUnlocked = unlockedIds.has(achievement.id)
                return (
                  <Card 
                    key={achievement.id} 
                    className={`border-3 transition-all ${
                      isUnlocked 
                        ? `${typeInfo.bg} border-transparent` 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                          isUnlocked 
                            ? `bg-gradient-to-br ${typeInfo.gradient} shadow-lg` 
                            : 'bg-gray-200'
                        }`}>
                          {isUnlocked ? (
                            iconMap[achievement.icone] || '🏆'
                          ) : (
                            <Lock className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className={`font-bold ${isUnlocked ? 'text-foreground' : 'text-gray-400'}`}>
                              {achievement.nome}
                            </h3>
                            {isUnlocked && (
                              <Sparkles className="h-5 w-5 text-[#FFD93D]" />
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${isUnlocked ? 'text-muted-foreground' : 'text-gray-400'}`}>
                            {achievement.descricao}
                          </p>
                          <div className="mt-3 flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              isUnlocked 
                                ? 'bg-white/60 text-[#FFD93D]' 
                                : 'bg-gray-200 text-gray-400'
                            }`}>
                              <Star className="h-3 w-3 fill-current" />
                              +{achievement.estrelas_reward}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              isUnlocked 
                                ? 'bg-white/60 text-[#6BCB77]' 
                                : 'bg-gray-200 text-gray-400'
                            }`}>
                              +{achievement.xp_reward} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
