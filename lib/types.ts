export interface Profile {
  id: string
  nome: string | null
  email: string | null
  plano: 'free' | 'premium'
  status_assinatura: 'active' | 'inactive' | 'canceled'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  periodo: 'monthly' | 'yearly' | null
  data_renovacao: string | null
  desenhos_gratis_usados: number
  atividades_gratis_usadas: number
  idade_preferida: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  nome: string
  slug: string
  tipo: 'desenho' | 'alfabetizacao' | 'matematica' | 'ingles' | 'jogo'
  icone: string | null
  ordem: number
  created_at: string
}

export interface Activity {
  id: string
  titulo: string
  descricao: string | null
  tipo: 'colorir' | 'alfabetizacao' | 'matematica' | 'ingles' | 'jogo' | 'imprimir'
  category_id: string | null
  imagem_url: string | null
  pdf_url: string | null
  svg_data: string | null
  idade_minima: number
  idade_maxima: number
  is_premium: boolean
  is_featured: boolean
  ordem: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface UserProgress {
  id: string
  user_id: string
  activity_id: string
  completed: boolean
  is_favorite: boolean
  saved_data: Record<string, unknown> | null
  last_accessed: string
  created_at: string
  activity?: Activity
}

export interface SubscriptionPlan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  features: string[]
}

export const FREE_LIMITS = {
  desenhos: 3,
  atividades: 5,
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      '3 desenhos para colorir por dia',
      '5 atividades educativas por dia',
      'Acesso a categorias basicas',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 1990, // R$ 19,90
    priceYearly: 14900, // R$ 149,00 (economia de ~37%)
    features: [
      'Acesso ilimitado a todos os desenhos',
      'Acesso ilimitado a todas as atividades',
      'Conteudo exclusivo premium',
      'Sem anuncios',
      'Download de PDFs para imprimir',
      'Progresso salvo automaticamente',
    ],
  },
]
