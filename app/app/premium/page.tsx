'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Crown, 
  Check, 
  Sparkles, 
  Palette, 
  BookOpen, 
  Download, 
  Ban,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/types'
import { createCheckoutSession } from '@/app/actions/stripe'
import { toast } from 'sonner'

const premiumBenefits = [
  { icon: Palette, text: 'Acesso ilimitado a todos os desenhos' },
  { icon: BookOpen, text: 'Todas as atividades educativas' },
  { icon: Download, text: 'Download de PDFs para imprimir' },
  { icon: Ban, text: 'Sem anuncios' },
  { icon: Sparkles, text: 'Conteudo exclusivo premium' },
]

export default function PremiumPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const premiumPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'premium')!

  async function handleSubscribe(productId: string) {
    setLoading(productId)
    try {
      const { url } = await createCheckoutSession(productId)
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      toast.error('Erro ao processar', {
        description: 'Tente novamente mais tarde.',
      })
      setLoading(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/app">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
          <Crown className="h-10 w-10 text-white" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Seja Premium
        </h1>
        <p className="text-lg text-muted-foreground">
          Desbloqueie todo o conteudo e aproveite ao maximo!
        </p>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>O que esta incluso?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {premiumBenefits.map((benefit) => (
              <div key={benefit.text} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            billingCycle === 'monthly'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setBillingCycle('yearly')}
          className={`relative rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            billingCycle === 'yearly'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          Anual
          <Badge className="absolute -right-2 -top-2 bg-green-500 text-xs">
            -37%
          </Badge>
        </button>
      </div>

      {/* Pricing Card */}
      <Card className="border-2 border-primary shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="mb-2 text-2xl font-bold">Premium {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}</h3>
              <div className="mb-2">
                {billingCycle === 'yearly' ? (
                  <>
                    <span className="text-4xl font-bold text-foreground">
                      R$ {(premiumPlan.priceYearly / 100).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-muted-foreground">/ano</span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Equivale a R$ {((premiumPlan.priceYearly / 100) / 12).toFixed(2).replace('.', ',')}/mes
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-foreground">
                      R$ {(premiumPlan.priceMonthly / 100).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-muted-foreground">/mes</span>
                  </>
                )}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {premiumPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 md:mt-0">
              <Button 
                size="lg" 
                className="min-w-[200px] text-lg"
                onClick={() => handleSubscribe(billingCycle === 'yearly' ? 'premium-yearly' : 'premium-monthly')}
                disabled={loading !== null}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Assinar Agora
                  </>
                )}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Cancele quando quiser
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Posso cancelar a qualquer momento?</h4>
            <p className="text-sm text-muted-foreground">
              Sim! Voce pode cancelar sua assinatura a qualquer momento. O acesso continua ate o fim do periodo pago.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Como funciona o pagamento?</h4>
            <p className="text-sm text-muted-foreground">
              Aceitamos cartao de credito. O pagamento e processado de forma segura pelo Stripe.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Tem garantia?</h4>
            <p className="text-sm text-muted-foreground">
              Sim! Oferecemos garantia de 7 dias. Se nao gostar, devolvemos seu dinheiro.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
