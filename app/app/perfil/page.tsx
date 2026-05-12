'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Crown, Loader2, CreditCard, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createBillingPortalSession } from '@/app/actions/stripe'
import { toast } from 'sonner'
import { Profile } from '@/lib/types'
import Link from 'next/link'

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nome, setNome] = useState('')
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
      .update({ nome })
      .eq('id', profile.id)

    if (error) {
      toast.error('Erro ao salvar')
    } else {
      toast.success('Perfil atualizado!')
      setProfile({ ...profile, nome })
    }
    setSaving(false)
  }

  async function handleManageSubscription() {
    try {
      const { url } = await createBillingPortalSession()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      toast.error('Erro ao acessar portal')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const isPremium = profile?.plano === 'premium'
  const initials = profile?.nome
    ? profile.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-xl text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{profile?.nome || 'Usuario'}</CardTitle>
              <CardDescription>{profile?.email}</CardDescription>
              {isPremium && (
                <Badge className="mt-1 bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Crown className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
                <div className="flex items-center gap-2 font-bold text-orange-600">
                  <Crown className="h-5 w-5" />
                  Plano Premium {profile?.periodo === 'yearly' ? 'Anual' : 'Mensal'}
                </div>
                {profile?.data_renovacao && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Renova em {new Date(profile.data_renovacao).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              <Button variant="outline" onClick={handleManageSubscription}>
                Gerenciar Assinatura
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Voce esta no plano gratuito. Assine o Premium para desbloquear todo o conteudo!
              </p>
              <Button asChild>
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
