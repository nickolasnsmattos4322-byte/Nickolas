'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail, Loader2, CheckCircle, Palette, Star, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
    })

    if (error) {
      toast.error('Erro ao enviar email', {
        description: error.message === 'For security purposes, you can only request this once every 60 seconds'
          ? 'Por seguranca, aguarde 60 segundos para solicitar novamente.'
          : error.message,
      })
      setIsLoading(false)
      return
    }

    setEmailSent(true)
    setIsLoading(false)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-4">
        {/* Floating shapes */}
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
              Email Enviado!
            </CardTitle>
            <CardDescription className="text-base">
              Enviamos um link de recuperacao para <strong className="text-[#6BCB77]">{email}</strong>. 
              Verifique sua caixa de entrada e siga as instrucoes.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4 px-6 pb-6">
            <Button 
              asChild 
              className="w-full rounded-xl h-14 text-lg font-bold bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] hover:opacity-90 shadow-lg shadow-[#6BCB77]/30"
            >
              <Link href="/entrar">
                <Sparkles className="mr-2 h-5 w-5" />
                Voltar para Login
              </Link>
            </Button>
            <button 
              onClick={() => setEmailSent(false)}
              className="text-sm text-muted-foreground hover:text-[#FF6B9D] transition-colors font-medium"
            >
              Nao recebeu? Tentar novamente
            </button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-4">
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#4D96FF] rounded-full opacity-20 animate-bounce" style={{ animationDuration: '3s' }}/>
        <div className="absolute top-40 right-20 w-20 h-20 bg-[#FF6B9D] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }}/>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-[#FFD93D] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}/>
        <Star className="absolute top-32 right-1/4 w-8 h-8 text-[#FFD93D] opacity-40 animate-pulse"/>
        <Sparkles className="absolute bottom-32 left-1/4 w-10 h-10 text-[#A66CFF] opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}/>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-4 border-[#E8F0FF] bg-white rounded-3xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <Link 
            href="/entrar" 
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#FF6B9D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Login
          </Link>
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#4D96FF] to-[#A66CFF] rounded-2xl flex items-center justify-center shadow-lg">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-[#4D96FF] to-[#A66CFF] bg-clip-text text-transparent">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-base">
            Digite seu email e enviaremos um link para voce redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base rounded-xl border-2 border-[#E8F0FF] focus:border-[#4D96FF]"
              />
            </div>
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button 
              type="submit" 
              className="w-full rounded-xl h-14 text-lg font-bold bg-gradient-to-r from-[#4D96FF] to-[#A66CFF] hover:opacity-90 shadow-lg shadow-[#4D96FF]/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  Enviar Link de Recuperacao
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
