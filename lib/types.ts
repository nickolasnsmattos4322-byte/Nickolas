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
  estrelas: number
  nivel: number
  xp: number
  avatar: string
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  nome: string
  descricao: string | null
  icone: string
  tipo: 'colorir' | 'atividade' | 'sequencia' | 'especial'
  requisito: number
  xp_reward: number
  estrelas_reward: number
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
  achievement?: Achievement
}

export interface PrintableActivity {
  id: string
  titulo: string
  descricao: string | null
  tipo: 'ligar_pontos' | 'labirinto' | 'caca_palavras' | 'alfabeto' | 'trace_letras' | 'trace_numeros' | 'formas' | 'sete_erros' | 'recorte_cole' | 'sequencias'
  category_id: string | null
  pdf_url: string | null
  thumbnail_url: string | null
  idade_minima: number
  idade_maxima: number
  is_premium: boolean
  downloads: number
  ordem: number
  created_at: string
}

// VideoAula for "Aprenda a Desenhar" section
export interface VideoAula {
  id: string
  titulo: string
  descricao: string | null
  video_url: string | null
  thumbnail_url: string | null
  duracao_segundos: number
  passos: VideoAulaStep[]
  pdf_url: string | null
  is_premium: boolean
  is_featured: boolean
  category_id: string | null
  dificuldade: 'facil' | 'medio' | 'dificil'
  ordem: number
  views: number
  created_at: string
  category?: Category
}

export interface VideoAulaStep {
  ordem: number
  titulo: string
  descricao: string
  imagem_url?: string
}

export interface UserVideoProgress {
  id: string
  user_id: string
  video_id: string
  completed: boolean
  watched_seconds: number
  last_watched: string
  certificate_earned: boolean
}

// Admin email that gets premium automatically
export const ADMIN_EMAIL = 'nickolasmattosns@gmail.com'

// Check if user is admin
export function isAdmin(email: string | null | undefined): boolean {
  return email === ADMIN_EMAIL
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

// XP needed for each level
export const XP_PER_LEVEL = 100

// Calculate level from XP
export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

// Calculate XP progress within current level
export function calculateLevelProgress(xp: number): number {
  return xp % XP_PER_LEVEL
}

// Avatar options
export const AVATARS = [
  { id: 'dinosaur', name: 'Dino', emoji: '🦖' },
  { id: 'unicorn', name: 'Unicornio', emoji: '🦄' },
  { id: 'butterfly', name: 'Borboleta', emoji: '🦋' },
  { id: 'rabbit', name: 'Coelho', emoji: '🐰' },
  { id: 'cat', name: 'Gatinho', emoji: '🐱' },
  { id: 'dog', name: 'Cachorro', emoji: '🐶' },
  { id: 'lion', name: 'Leao', emoji: '🦁' },
  { id: 'panda', name: 'Panda', emoji: '🐼' },
  { id: 'star', name: 'Estrela', emoji: '⭐' },
  { id: 'rocket', name: 'Foguete', emoji: '🚀' },
]

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
