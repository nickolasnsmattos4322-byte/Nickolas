'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette, Loader2, Eye, EyeOff, Sparkles, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

// Google icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error('Erro ao entrar', {
        description: error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos' 
          : error.message,
      })
      setLoading(false)
      return
    }

    toast.success('Bem-vindo de volta!')
    router.push('/app')
    router.refresh()
  }

  async function handleGoogleLogin() {
    setLoadingGoogle(true)
    
    // Use production URL if available, otherwise use current origin
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const redirectTo = `${siteUrl}/auth/callback`
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      toast.error('Erro ao entrar com Google', {
        description: error.message === 'Provider not found' 
          ? 'Login com Google nao esta configurado. Use email e senha.'
          : error.message,
      })
      setLoadingGoogle(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF9F0] px-4 py-12">
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#FFD93D] rounded-full opacity-20 animate-bounce" style={{ animationDuration: '3s' }}/>
        <div className="absolute top-40 right-20 w-20 h-20 bg-[#FF6B9D] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }}/>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-[#4D96FF] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}/>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-[#6BCB77] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}/>
        <Star className="absolute top-32 right-1/4 w-8 h-8 text-[#FFD93D] opacity-40 animate-pulse"/>
        <Sparkles className="absolute bottom-32 left-1/4 w-10 h-10 text-[#A66CFF] opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}/>
      </div>
      
      <Card className="w-full max-w-md border-4 border-[#FFE4EC] shadow-2xl bg-white rounded-3xl relative z-10">
        <CardHeader className="text-center pb-2">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-3 group">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#FF9F43] shadow-lg group-hover:scale-110 transition-transform">
                <Palette className="h-9 w-9 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD93D]">
                <Star className="h-4 w-4 text-[#2D1B4E]" />
              </div>
            </div>
          </Link>
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-[#FF6B9D] to-[#A66CFF] bg-clip-text text-transparent">
            Bem-vindo de volta!
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Entre na sua conta para continuar a diversao
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-2 border-[#E8E8E8] hover:bg-[#F8F8F8] rounded-xl font-semibold text-base mb-4"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle || loading}
          >
            {loadingGoogle ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-5 w-5" />
            )}
            Entrar com Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-[#FFE4EC]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-muted-foreground font-medium">ou continue com email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || loadingGoogle}
                className="h-12 rounded-xl border-2 border-[#FFE4EC] focus:border-[#FF6B9D] text-base"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base font-semibold">Senha</Label>
                <Link 
                  href="/recuperar-senha" 
                  className="text-sm font-medium text-[#FF6B9D] hover:text-[#FF6B9D]/80 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || loadingGoogle}
                  className="h-12 rounded-xl border-2 border-[#FFE4EC] focus:border-[#FF6B9D] text-base pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-[#FFE4EC] rounded-lg"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || loadingGoogle}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-[#FF6B9D] to-[#FF9F43] hover:opacity-90 shadow-lg shadow-[#FF6B9D]/30" 
              disabled={loading || loadingGoogle}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Entrar
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-base text-muted-foreground">
            Nao tem uma conta?{' '}
            <Link href="/cadastro" className="font-bold text-[#6BCB77] hover:text-[#6BCB77]/80 hover:underline">
              Cadastre-se gratis
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
