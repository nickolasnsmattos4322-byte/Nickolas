import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Mail, ArrowRight } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verifique seu email!</CardTitle>
          <CardDescription className="text-base">
            Enviamos um link de confirmacao para o seu email. 
            Clique no link para ativar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
            <p>Nao recebeu o email? Verifique sua caixa de spam ou lixo eletronico.</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/entrar">
              Ir para Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/">
              <Palette className="mr-2 h-4 w-4" />
              Voltar para o inicio
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
