export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval: 'month' | 'year'
}

export const PRODUCTS: Product[] = [
  {
    id: 'premium-monthly',
    name: 'Colorir e Aprender Premium - Mensal',
    description: 'Acesso ilimitado a todos os desenhos e atividades educativas por 1 mes',
    priceInCents: 1990, // R$ 19,90
    interval: 'month',
  },
  {
    id: 'premium-yearly',
    name: 'Colorir e Aprender Premium - Anual',
    description: 'Acesso ilimitado a todos os desenhos e atividades educativas por 1 ano',
    priceInCents: 14900, // R$ 149,00
    interval: 'year',
  },
]
