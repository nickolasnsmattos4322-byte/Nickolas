'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const benefits = [
  '3 desenhos para colorir por dia',
  '5 atividades educativas por dia',
  'Progresso salvo automaticamente',
]

export default function SignUpPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
        data: {
          nome,
          full_name: nome,
        },
      },
    })

    if (error) {
      toast.error('Erro ao criar conta', {
        description: error.message,
      })
      setLoading(false)
      return
    }

    toast.success('Conta criada com sucesso!', {
      description: 'Verifique seu email para confirmar o cadastro.',
    })
    router.push('/cadastro/sucesso')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Palette className="h-7 w-7 text-primary-foreground" />
            </div>
          </Link>
          <CardTitle className="text-2xl">Criar Conta Gratis</CardTitle>
          <CardDescription>Comece a aprender e se divertir agora mesmo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="mb-2 text-sm font-medium text-foreground">Incluso no plano gratuito:</p>
              <ul className="space-y-2">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar Conta Gratis'
              )}
            </Button>
          </form>
          
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Ao criar uma conta, voce concorda com nossos{' '}
            <Link href="/termos" className="text-primary hover:underline">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacidade" className="text-primary hover:underline">
              Politica de Privacidade
            </Link>
          </p>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Ja tem uma conta?{' '}
            <Link href="/entrar" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
