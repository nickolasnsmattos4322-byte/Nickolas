import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Printer, 
  Download, 
  Star, 
  Lock, 
  Crown,
  Sparkles,
  FileText,
  Puzzle,
  PenTool,
  Grid3X3,
  Search,
  Scissors,
  ArrowRight
} from 'lucide-react'

const printableTypes = [
  { 
    id: 'ligar_pontos', 
    name: 'Ligar Pontos', 
    emoji: '✏️',
    color: 'from-[#FF6B9D] to-[#A66CFF]', 
    bg: 'bg-[#FFE4EC]',
  },
  { 
    id: 'labirinto', 
    name: 'Labirintos', 
    emoji: '🧩',
    color: 'from-[#6BCB77] to-[#1DD1A1]', 
    bg: 'bg-[#E8F8EA]',
  },
  { 
    id: 'caca_palavras', 
    name: 'Caca-Palavras', 
    emoji: '🔍',
    color: 'from-[#4D96FF] to-[#A66CFF]', 
    bg: 'bg-[#E8F0FF]',
  },
  { 
    id: 'trace_letras', 
    name: 'Trace as Letras', 
    emoji: '🔤',
    color: 'from-[#FFD93D] to-[#FF9F43]', 
    bg: 'bg-[#FFF8E1]',
  },
  { 
    id: 'trace_numeros', 
    name: 'Trace os Numeros', 
    emoji: '🔢',
    color: 'from-[#A66CFF] to-[#FF6B9D]', 
    bg: 'bg-[#F3E8FF]',
  },
  { 
    id: 'recorte_cole', 
    name: 'Recorte e Cole', 
    emoji: '✂️',
    color: 'from-[#FF9F43] to-[#FFD93D]', 
    bg: 'bg-[#FFF0E8]',
  },
]

// Sample printables for demo
const samplePrintables = [
  { id: '1', titulo: 'Dinossauro - Ligar Pontos', tipo: 'ligar_pontos', emoji: '🦖', is_premium: false },
  { id: '2', titulo: 'Unicornio - Ligar Pontos', tipo: 'ligar_pontos', emoji: '🦄', is_premium: false },
  { id: '3', titulo: 'Labirinto da Floresta', tipo: 'labirinto', emoji: '🌲', is_premium: false },
  { id: '4', titulo: 'Labirinto Espacial', tipo: 'labirinto', emoji: '🚀', is_premium: true },
  { id: '5', titulo: 'Caca-Palavras: Animais', tipo: 'caca_palavras', emoji: '🐾', is_premium: false },
  { id: '6', titulo: 'Caca-Palavras: Frutas', tipo: 'caca_palavras', emoji: '🍎', is_premium: true },
  { id: '7', titulo: 'Trace a Letra A', tipo: 'trace_letras', emoji: '🅰️', is_premium: false },
  { id: '8', titulo: 'Trace o Numero 1', tipo: 'trace_numeros', emoji: '1️⃣', is_premium: false },
]

export default async function ImprimirPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: printables } = await supabase
    .from('printable_activities')
    .select('*')
    .order('tipo', { ascending: true })
    .order('ordem', { ascending: true })
    .limit(20)

  const isPremium = profile?.plano === 'premium'
  
  // Use sample printables if database is empty
  const displayPrintables = printables && printables.length > 0 ? printables : samplePrintables

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9F43] to-[#FFD93D] shadow-lg">
              <Printer className="h-6 w-6 text-white" />
            </div>
            Atividades para Imprimir
          </h1>
          <p className="mt-2 text-muted-foreground text-lg">
            Baixe e imprima atividades educativas para brincar offline!
          </p>
        </div>
        {!isPremium && (
          <Button 
            className="bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] hover:opacity-90 font-bold rounded-xl shadow-lg"
            asChild
          >
            <Link href="/app/premium">
              <Crown className="mr-2 h-5 w-5" />
              Desbloquear Tudo
            </Link>
          </Button>
        )}
      </div>

      {/* Types Grid */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#FFD93D]" />
          Tipos de Atividades
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {printableTypes.map((type) => (
            <Card 
              key={type.id}
              className={`border-3 border-transparent hover:border-[#FFE4EC] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${type.bg}`}
            >
              <CardContent className="p-4 text-center">
                <div className={`mx-auto mb-3 w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {type.emoji}
                </div>
                <h3 className="font-bold text-foreground text-sm">{type.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Printables Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 fill-[#FFD93D] text-[#FFD93D]" />
            Atividades Disponiveis
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayPrintables.map((printable: any) => {
            const isLocked = printable.is_premium && !isPremium
            const typeInfo = printableTypes.find(t => t.id === printable.tipo)
            
            return (
              <Card 
                key={printable.id}
                className={`group border-3 border-transparent hover:border-[#FFE4EC] transition-all duration-300 hover:shadow-xl overflow-hidden ${typeInfo?.bg || 'bg-white'}`}
              >
                <CardContent className="p-0">
                  {/* Preview Area */}
                  <div className="relative aspect-[4/3] flex items-center justify-center bg-white/50">
                    <span className="text-6xl group-hover:scale-110 transition-transform">
                      {printable.emoji || '📄'}
                    </span>
                    
                    {/* Premium Badge */}
                    {printable.is_premium && (
                      <div className="absolute right-3 top-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] text-white text-xs font-bold shadow-lg">
                        <Crown className="h-3 w-3" />
                        Premium
                      </div>
                    )}
                    
                    {/* Lock Overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] shadow-lg">
                            <Lock className="h-7 w-7 text-white" />
                          </div>
                          <span className="text-sm font-bold text-[#FF9F43]">Premium</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-foreground line-clamp-1 mb-2">
                      {printable.titulo}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${typeInfo?.color || 'from-gray-400 to-gray-500'}`}>
                        {typeInfo?.name || 'Atividade'}
                      </span>
                      {!isLocked && (
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-[#6BCB77] to-[#1DD1A1] hover:opacity-90 rounded-lg shadow"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Info Card */}
      <Card className="border-3 border-[#FFF8E1] bg-gradient-to-r from-[#FFF8E1]/50 to-[#FFE4EC]/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD93D] to-[#FF9F43] text-4xl shadow-lg">
              🖨️
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">Como usar as atividades</h3>
              <p className="text-muted-foreground mb-4">
                Clique no botao de download para baixar o PDF. Imprima em papel sulfite A4 e entregue para a crianca colorir, resolver ou completar!
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F8EA] text-[#6BCB77] text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  PDF pronto para imprimir
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F0FF] text-[#4D96FF] text-sm font-medium">
                  <Star className="h-4 w-4" />
                  Atividades educativas
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE4EC] text-[#FF6B9D] text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  Diversao garantida
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium CTA */}
      {!isPremium && (
        <Card className="border-0 bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] shadow-2xl overflow-hidden">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur text-4xl">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1 text-white">
                <h3 className="text-2xl font-extrabold mb-2">Desbloqueie todas as atividades!</h3>
                <p className="text-white/90 mb-4">
                  Com o Premium voce tem acesso ilimitado a centenas de atividades para imprimir. Novos conteudos toda semana!
                </p>
                <Button 
                  className="bg-white text-[#FF9F43] hover:bg-white/90 font-bold rounded-xl shadow-lg"
                  asChild
                >
                  <Link href="/app/premium">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Assinar Premium
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
