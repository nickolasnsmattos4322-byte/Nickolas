import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Erro na autenticacao</CardTitle>
          <CardDescription className="text-base">
            Houve um problema ao processar sua autenticacao. 
            Por favor, tente novamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/entrar">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
