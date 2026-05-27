'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Crown, Loader2, CreditCard, Calendar, Star, Trophy, Zap, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createBillingPortalSession } from '@/app/actions/stripe'
import { toast } from 'sonner'
import { Profile, AVATARS, XP_PER_LEVEL, calculateLevelProgress } from '@/lib/types'
import Link from 'next/link'

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nome, setNome] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('dinosaur')
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setNome(data.nome || '')
        setSelectedAvatar(data.avatar || 'dinosaur')
      }
      setLoading(false)
    }

    loadProfile()
  }, [])

  async function handleSave() {
    if (!profile) return
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({ nome, avatar: selectedAvatar })
      .eq('id', profile.id)

    if (error) {
      toast.error('Erro ao salvar')
    } else {
      toast.success('Perfil atualizado!')
      setProfile({ ...profile, nome, avatar: selectedAvatar })
    }
    setSaving(false)
  }

  async function handleManageSubscription() {
    try {
      const { url } = await createBillingPortalSession()
      if (url) {
        window.location.href = url
      }
    } catch {
      toast.error('Erro ao acessar portal')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B9D]" />
      </div>
    )
  }

  const isPremium = profile?.plano === 'premium'
  const currentAvatar = AVATARS.find(a => a.id === (profile?.avatar || 'dinosaur'))
  const xpProgress = calculateLevelProgress(profile?.xp || 0)
  const xpPercentage = (xpProgress / XP_PER_LEVEL) * 100

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#2D1B4E]">Meu Perfil</h1>
        <p className="text-[#6B5B7A]">Personalize seu perfil e veja suas conquistas!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border-2 border-[#FFD93D]/30 bg-gradient-to-br from-[#FFD93D]/10 to-transparent">
          <CardContent className="flex flex-col items-center p-4 text-center">
            <div className="mb-2 rounded-full bg-[#FFD93D]/20 p-3">
              <Star className="h-6 w-6 text-[#FFD93D]" />
            </div>
            <p className="text-2xl font-bold text-[#2D1B4E]">{profile?.estrelas || 0}</p>
            <p className="text-xs text-[#6B5B7A]">Estrelas</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-[#A66CFF]/30 bg-gradient-to-br from-[#A66CFF]/10 to-transparent">
          <CardContent className="flex flex-col items-center p-4 text-center">
            <div className="mb-2 rounded-full bg-[#A66CFF]/20 p-3">
              <Trophy className="h-6 w-6 text-[#A66CFF]" />
            </div>
            <p className="text-2xl font-bold text-[#2D1B4E]">Nivel {profile?.nivel || 1}</p>
            <p className="text-xs text-[#6B5B7A]">Seu nivel</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-[#6BCB77]/30 bg-gradient-to-br from-[#6BCB77]/10 to-transparent">
          <CardContent className="flex flex-col items-center p-4 text-center">
            <div className="mb-2 rounded-full bg-[#6BCB77]/20 p-3">
              <Zap className="h-6 w-6 text-[#6BCB77]" />
            </div>
            <p className="text-2xl font-bold text-[#2D1B4E]">{profile?.xp || 0}</p>
            <p className="text-xs text-[#6B5B7A]">XP Total</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-[#FF6B9D]/30 bg-gradient-to-br from-[#FF6B9D]/10 to-transparent">
          <CardContent className="flex flex-col items-center p-4 text-center">
            <div className="mb-2 rounded-full bg-[#FF6B9D]/20 p-3">
              <Sparkles className="h-6 w-6 text-[#FF6B9D]" />
            </div>
            <p className="text-2xl font-bold text-[#2D1B4E]">{profile?.desenhos_gratis_usados || 0}</p>
            <p className="text-xs text-[#6B5B7A]">Desenhos</p>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <Card className="border-2 border-[#A66CFF]/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#2D1B4E]">Progresso para Nivel {(profile?.nivel || 1) + 1}</span>
            <span className="text-sm text-[#6B5B7A]">{xpProgress}/{XP_PER_LEVEL} XP</span>
          </div>
          <Progress value={xpPercentage} className="h-3 bg-[#A66CFF]/20" />
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card className="border-2 border-[#FFE4EC]">
        <CardHeader className="bg-gradient-to-r from-[#FF6B9D]/10 to-[#FFD93D]/10">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-lg">
              {currentAvatar?.emoji}
            </div>
            <div>
              <CardTitle className="text-xl text-[#2D1B4E]">{profile?.nome || 'Usuario'}</CardTitle>
              <CardDescription>{profile?.email}</CardDescription>
              {isPremium && (
                <Badge className="mt-2 bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] text-[#2D1B4E]">
                  <Crown className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label className="text-[#2D1B4E]">Escolha seu Avatar</Label>
            <div className="grid grid-cols-5 gap-3 md:grid-cols-10">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all hover:scale-110 ${
                    selectedAvatar === avatar.id
                      ? 'bg-[#FF6B9D] ring-2 ring-[#FF6B9D] ring-offset-2'
                      : 'bg-[#FFF0F5] hover:bg-[#FFE4EC]'
                  }`}
                  title={avatar.name}
                >
                  {avatar.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-[#2D1B4E]">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="border-[#FFE4EC] focus-visible:ring-[#FF6B9D]"
            />
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full bg-[#FF6B9D] hover:bg-[#FF6B9D]/90"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alteracoes'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card className="border-2 border-[#FFE4EC]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#2D1B4E]">
            <CreditCard className="h-5 w-5 text-[#FF6B9D]" />
            Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-gradient-to-r from-[#FFD93D]/20 to-[#FF9F43]/20 p-4">
                <div className="flex items-center gap-2 font-bold text-[#FF9F43]">
                  <Crown className="h-5 w-5" />
                  Plano Premium {profile?.periodo === 'yearly' ? 'Anual' : 'Mensal'}
                </div>
                {profile?.data_renovacao && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-[#6B5B7A]">
                    <Calendar className="h-4 w-4" />
                    Renova em {new Date(profile.data_renovacao).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={handleManageSubscription}
                className="w-full border-[#FFE4EC] text-[#2D1B4E] hover:bg-[#FFF0F5]"
              >
                Gerenciar Assinatura
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-[#FFF0F5] p-4 text-center">
                <p className="text-[#6B5B7A]">
                  Voce esta no plano gratuito. Assine o Premium para desbloquear todo o conteudo e ganhar mais estrelas!
                </p>
              </div>
              <Button asChild className="w-full bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] text-[#2D1B4E] hover:opacity-90">
                <Link href="/app/premium">
                  <Crown className="mr-2 h-4 w-4" />
                  Assinar Premium
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
