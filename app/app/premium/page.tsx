'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  ArrowLeft,
  Star,
  Zap,
  Gift,
  Shield
} from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/types'
import { createCheckoutSession } from '@/app/actions/stripe'
import { toast } from 'sonner'

const premiumBenefits = [
  { icon: Palette, text: 'Acesso ilimitado a todos os desenhos', color: 'from-[#FF6B9D] to-[#FF9F43]' },
  { icon: BookOpen, text: 'Todas as atividades educativas', color: 'from-[#6BCB77] to-[#1DD1A1]' },
  { icon: Download, text: 'Download de PDFs para imprimir', color: 'from-[#4D96FF] to-[#5F27CD]' },
  { icon: Ban, text: 'Sem anúncios', color: 'from-[#FFD93D] to-[#FF9F43]' },
  { icon: Star, text: 'Medalhas e conquistas exclusivas', color: 'from-[#A66CFF] to-[#FF6B9D]' },
  { icon: Zap, text: 'Novos conteúdos toda semana', color: 'from-[#FF4757] to-[#FF6B9D]' },
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
        <Button variant="ghost" className="mb-4 rounded-full" asChild>
          <Link href="/app">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        
        <div className="relative inline-block">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] shadow-2xl">
            <Crown className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles className="h-8 w-8 text-[#FFD93D]" />
          </div>
        </div>
        
        <h1 className="mb-2 text-4xl font-bold text-[#2D1B4E]">
          Seja <span className="bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] bg-clip-text text-transparent">Premium</span>
        </h1>
        <p className="text-lg text-[#6B5B7A] max-w-md mx-auto">
          Desbloqueie todo o conteúdo e dê o melhor para seu filho!
        </p>
      </div>

      {/* Mascot */}
      <div className="flex justify-center">
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#FFE4EC] to-[#FFF0F5] px-6 py-3 rounded-full">
          <span className="text-4xl animate-bounce">🦖</span>
          <span className="font-bold text-[#2D1B4E]">Dino recomenda o plano anual!</span>
          <span className="text-4xl">⭐</span>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {premiumBenefits.map((benefit) => (
          <Card 
            key={benefit.text} 
            className={`p-4 bg-gradient-to-br ${benefit.color} text-white rounded-2xl hover:scale-105 transition-all shadow-lg`}
          >
            <benefit.icon className="h-8 w-8 mb-2" />
            <span className="font-bold text-sm">{benefit.text}</span>
          </Card>
        ))}
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-2 bg-white p-2 rounded-full shadow-lg max-w-xs mx-auto">
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`rounded-full px-6 py-3 text-sm font-bold transition-all ${
            billingCycle === 'monthly'
              ? 'bg-gradient-to-r from-[#FF6B9D] to-[#FF9F43] text-white shadow-lg'
              : 'text-[#6B5B7A] hover:text-[#2D1B4E]'
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setBillingCycle('yearly')}
          className={`relative rounded-full px-6 py-3 text-sm font-bold transition-all ${
            billingCycle === 'yearly'
              ? 'bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] text-white shadow-lg'
              : 'text-[#6B5B7A] hover:text-[#2D1B4E]'
          }`}
        >
          Anual
          <Badge className="absolute -right-4 -top-3 bg-[#FF4757] text-white text-xs font-bold px-2 animate-pulse">
            -37%
          </Badge>
        </button>
      </div>

      {/* Pricing Card */}
      <Card className={`
        border-4 rounded-3xl shadow-2xl overflow-hidden
        ${billingCycle === 'yearly' 
          ? 'border-[#6BCB77] bg-gradient-to-br from-[#E8F8E8] to-white' 
          : 'border-[#FF6B9D] bg-gradient-to-br from-[#FFE4EC] to-white'
        }
      `}>
        {billingCycle === 'yearly' && (
          <div className="bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] text-white text-center py-2 font-bold">
            <Gift className="inline h-5 w-5 mr-2" />
            MELHOR VALOR - Economize 37%!
          </div>
        )}
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:text-left gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-8 w-8 text-[#FFD93D]" />
                <h3 className="text-2xl font-bold text-[#2D1B4E]">
                  Premium {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}
                </h3>
              </div>
              
              <div className="mb-4">
                {billingCycle === 'yearly' ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-[#6B5B7A] line-through">
                        R$ {((premiumPlan.priceMonthly / 100) * 12).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <span className="text-5xl font-bold text-[#6BCB77]">
                      R$ {(premiumPlan.priceYearly / 100).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[#6B5B7A]">/ano</span>
                    <p className="mt-2 text-sm text-[#6B5B7A] bg-[#6BCB77]/10 inline-block px-3 py-1 rounded-full">
                      Apenas R$ {((premiumPlan.priceYearly / 100) / 12).toFixed(2).replace('.', ',')}/mês
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-bold text-[#FF6B9D]">
                      R$ {(premiumPlan.priceMonthly / 100).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[#6B5B7A]">/mês</span>
                  </>
                )}
              </div>
              
              <ul className="space-y-2">
                {premiumPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-[#2D1B4E]">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      billingCycle === 'yearly' ? 'bg-[#6BCB77]' : 'bg-[#FF6B9D]'
                    }`}>
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col items-center">
              <Button 
                size="lg" 
                className={`
                  min-w-[220px] h-14 text-lg font-bold rounded-full shadow-lg transition-all hover:scale-105
                  ${billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] hover:opacity-90'
                    : 'bg-gradient-to-r from-[#FF6B9D] to-[#FF9F43] hover:opacity-90'
                  }
                `}
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
              
              <div className="mt-4 flex items-center gap-2 text-sm text-[#6B5B7A]">
                <Shield className="h-4 w-4" />
                Pagamento 100% seguro
              </div>
              
              <p className="mt-2 text-xs text-[#6B5B7A]">
                Cancele quando quiser
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
          <Shield className="h-5 w-5 text-[#6BCB77]" />
          <span className="text-sm font-medium text-[#2D1B4E]">Garantia de 7 dias</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
          <Star className="h-5 w-5 text-[#FFD93D]" />
          <span className="text-sm font-medium text-[#2D1B4E]">+10.000 famílias</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
          <Zap className="h-5 w-5 text-[#FF6B9D]" />
          <span className="text-sm font-medium text-[#2D1B4E]">Acesso imediato</span>
        </div>
      </div>

      {/* FAQ */}
      <Card className="bg-gradient-to-br from-[#FFF9F0] to-white border-2 border-[#FFE4EC] rounded-3xl">
        <CardHeader>
          <CardTitle className="text-[#2D1B4E] flex items-center gap-2">
            <span className="text-2xl">🤔</span>
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white rounded-2xl">
            <h4 className="font-bold text-[#2D1B4E]">Posso cancelar a qualquer momento?</h4>
            <p className="text-sm text-[#6B5B7A] mt-1">
              Sim! Você pode cancelar sua assinatura a qualquer momento. O acesso continua até o fim do período pago.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl">
            <h4 className="font-bold text-[#2D1B4E]">Como funciona o pagamento?</h4>
            <p className="text-sm text-[#6B5B7A] mt-1">
              Aceitamos cartão de crédito e PIX. O pagamento é processado de forma segura pelo Stripe.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl">
            <h4 className="font-bold text-[#2D1B4E]">Tem garantia?</h4>
            <p className="text-sm text-[#6B5B7A] mt-1">
              Sim! Oferecemos garantia de 7 dias. Se não gostar, devolvemos seu dinheiro sem perguntas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
