'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Star, Sparkles } from 'lucide-react'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  const errorMessages: Record<string, { title: string; description: string }> = {
    'access_denied': {
      title: 'Acesso Negado',
      description: 'Você cancelou o login ou não autorizou o acesso. Tente novamente.',
    },
    'server_error': {
      title: 'Erro no Servidor',
      description: 'Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.',
    },
    'temporarily_unavailable': {
      title: 'Serviço Indisponível',
      description: 'O serviço está temporariamente indisponível. Tente novamente em alguns minutos.',
    },
    'invalid_request': {
      title: 'Solicitação Inválida',
      description: 'A solicitação de autenticação é inválida. Tente fazer login novamente.',
    },
    'default': {
      title: 'Erro na Autenticação',
      description: message || 'Houve um problema ao processar sua autenticação. Por favor, tente novamente.',
    },
  }

  const errorInfo = errorMessages[error || 'default'] || errorMessages['default']

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF9F0] px-4 py-12">
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#FF6B9D] rounded-full opacity-20 animate-bounce" style={{ animationDuration: '3s' }}/>
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-[#4D96FF] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}/>
        <Star className="absolute top-32 right-1/4 w-8 h-8 text-[#FFD93D] opacity-40 animate-pulse"/>
        <Sparkles className="absolute bottom-32 left-1/4 w-10 h-10 text-[#A66CFF] opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}/>
      </div>
      
      <Card className="w-full max-w-md text-center shadow-2xl border-4 border-[#FFE4EC] bg-white rounded-3xl relative z-10">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#FF9F43] shadow-lg">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground">
            {errorInfo.title}
          </CardTitle>
          <CardDescription className="text-base">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <Button 
            asChild 
            className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-[#FF6B9D] to-[#FF9F43] hover:opacity-90 shadow-lg shadow-[#FF6B9D]/30"
          >
            <Link href="/entrar">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para Login
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Se o problema persistir,{' '}
            <Link href="/contato" className="text-[#FF6B9D] hover:underline font-medium">
              entre em contato conosco
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B9D]"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
