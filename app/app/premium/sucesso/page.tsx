import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Crown, ArrowRight, Sparkles } from 'lucide-react'

export default function PremiumSuccessPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Parabéns!</CardTitle>
          <CardDescription className="text-base">
            Sua assinatura Premium foi ativada com sucesso!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
            <div className="flex items-center justify-center gap-2 text-lg font-bold text-orange-600">
              <Crown className="h-5 w-5" />
              Você agora é Premium!
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Aproveite todos os desenhos e atividades ilimitadas.
            </p>
          </div>

          <div className="space-y-3">
            <Button className="w-full" size="lg" asChild>
              <Link href="/app">
                <Sparkles className="mr-2 h-5 w-5" />
                Começar a Explorar
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/app/colorir">
                Ver Todos os Desenhos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
