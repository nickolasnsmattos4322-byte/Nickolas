'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Loader2, Eye, EyeOff, CheckCircle, Star, Sparkles, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if we have a valid session from the password reset flow
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setIsSessionValid(!!session)
    }
    checkSession()
  }, [supabase.auth])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('As senhas nao coincidem')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)
    
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      toast.error('Erro ao redefinir senha', {
        description: error.message === 'New password should be different from the old password.'
          ? 'A nova senha deve ser diferente da senha anterior.'
          : error.message,
      })
      setIsLoading(false)
      return
    }

    setIsSuccess(true)
    toast.success('Senha redefinida com sucesso!')
  }

  // Loading state while checking session
  if (isSessionValid === null) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#FF6B9D]" />
          <span className="text-muted-foreground">Verificando...</span>
        </div>
      </div>
    )
  }

  // Invalid session - no auth token from email link
  if (!isSessionValid) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-24 h-24 bg-[#FF6B9D] rounded-full opacity-20 animate-bounce" style={{ animationDuration: '3s' }}/>
          <div className="absolute bottom-40 right-20 w-20 h-20 bg-[#4D96FF] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}/>
        </div>
        
        <Card className="w-full max-w-md shadow-2xl border-4 border-[#FFE4EC] bg-white rounded-3xl relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#FF6B9D] to-[#FF9F43] rounded-2xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-foreground">
              Link Expirado
            </CardTitle>
            <CardDescription className="text-base">
              O link de recuperacao expirou ou e invalido. Por favor, solicite um novo link.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4 px-6 pb-6">
            <Button 
              asChild 
              className="w-full rounded-xl h-14 text-lg font-bold bg-gradient-to-r from-[#FF6B9D] to-[#FF9F43] hover:opacity-90 shadow-lg"
            >
              <Link href="/recuperar-senha">
                Solicitar Novo Link
              </Link>
            </Button>
            <Link 
              href="/entrar"
              className="text-sm text-muted-foreground hover:text-[#FF6B9D] transition-colors font-medium"
            >
              Voltar para Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-24 h-24 bg-[#6BCB77] rounded-full opacity-20 animate-bounce" style={{ animationDuration: '3s' }}/>
          <div className="absolute bottom-40 right-20 w-20 h-20 bg-[#4D96FF] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}/>
          <Star className="absolute top-32 right-1/4 w-8 h-8 text-[#FFD93D] opacity-40 animate-pulse"/>
        </div>
        
        <Card className="w-full max-w-md shadow-2xl border-4 border-[#E8F8EA] bg-white rounded-3xl relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#6BCB77] to-[#1DD1A1] rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] bg-clip-text text-transparent">
              Senha Redefinida!
            </CardTitle>
            <CardDescription className="text-base">
              Sua senha foi alterada com sucesso. Agora voce pode entrar com sua nova senha.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4 px-6 pb-6">
            <Button 
              onClick={() => router.push('/app')}
              className="w-full rounded-xl h-14 text-lg font-bold bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] hover:opacity-90 shadow-lg shadow-[#6BCB77]/30"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Continuar para o App
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Password reset form
  return (
    <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#4D96FF] rounded-full opacity-20 animate-bounce" style={{ animationDuration: '3s' }}/>
        <div className="absolute top-40 right-20 w-20 h-20 bg-[#FF6B9D] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }}/>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-[#6BCB77] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}/>
        <Star className="absolute top-32 right-1/4 w-8 h-8 text-[#FFD93D] opacity-40 animate-pulse"/>
        <Sparkles className="absolute bottom-32 left-1/4 w-10 h-10 text-[#A66CFF] opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}/>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-4 border-[#E8F0FF] bg-white rounded-3xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#4D96FF] to-[#A66CFF] rounded-2xl flex items-center justify-center shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-[#4D96FF] to-[#A66CFF] bg-clip-text text-transparent">
            Nova Senha
          </CardTitle>
          <CardDescription className="text-base">
            Digite sua nova senha abaixo. Use pelo menos 6 caracteres.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-semibold">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="h-12 text-base rounded-xl border-2 border-[#E8F0FF] focus:border-[#4D96FF] pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-[#E8F0FF] rounded-lg"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base font-semibold">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
                className="h-12 text-base rounded-xl border-2 border-[#E8F0FF] focus:border-[#4D96FF]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-6 pb-6">
            <Button 
              type="submit" 
              className="w-full rounded-xl h-14 text-lg font-bold bg-gradient-to-r from-[#4D96FF] to-[#A66CFF] hover:opacity-90 shadow-lg shadow-[#4D96FF]/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Redefinir Senha
                </>
              )}
            </Button>
            <Link 
              href="/entrar"
              className="text-sm text-muted-foreground hover:text-[#FF6B9D] transition-colors font-medium"
            >
              Voltar para Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
