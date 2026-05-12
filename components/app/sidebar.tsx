'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  Palette, 
  Home, 
  BookOpen, 
  Calculator, 
  Globe, 
  Heart, 
  Crown,
  Printer,
  X,
  Star,
  Trophy,
  Gamepad2,
  Sparkles,
  Menu
} from 'lucide-react'
import { Profile, calculateLevel, calculateLevelProgress, XP_PER_LEVEL, AVATARS } from '@/lib/types'
import { useState } from 'react'

const navigation = [
  { name: 'Inicio', href: '/app', icon: Home, color: 'from-[#FF6B9D] to-[#FF9F43]' },
  { name: 'Colorir', href: '/app/colorir', icon: Palette, color: 'from-[#FF6B9D] to-[#A66CFF]' },
  { name: 'Alfabeto', href: '/app/alfabetizacao', icon: BookOpen, color: 'from-[#6BCB77] to-[#1DD1A1]' },
  { name: 'Numeros', href: '/app/matematica', icon: Calculator, color: 'from-[#4D96FF] to-[#A66CFF]' },
  { name: 'Ingles', href: '/app/ingles', icon: Globe, color: 'from-[#FFD93D] to-[#FF9F43]' },
  { name: 'Jogos', href: '/app/jogos', icon: Gamepad2, color: 'from-[#A66CFF] to-[#FF6B9D]' },
  { name: 'Imprimir', href: '/app/imprimir', icon: Printer, color: 'from-[#FF9F43] to-[#FFD93D]' },
  { name: 'Favoritos', href: '/app/favoritos', icon: Heart, color: 'from-[#FF6B9D] to-[#FF4757]' },
  { name: 'Conquistas', href: '/app/conquistas', icon: Trophy, color: 'from-[#FFD93D] to-[#FF9F43]' },
]

interface AppSidebarProps {
  profile: Profile | null
}

export function AppSidebar({ profile }: AppSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isPremium = profile?.plano === 'premium'
  
  const nivel = profile?.nivel || calculateLevel(profile?.xp || 0)
  const xpProgress = calculateLevelProgress(profile?.xp || 0)
  const avatar = AVATARS.find(a => a.id === profile?.avatar) || AVATARS[0]

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden bg-white shadow-lg rounded-xl border-2 border-[#FFE4EC] hover:bg-[#FFE4EC]"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-6 w-6 text-[#FF6B9D]" />
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform border-r-4 border-[#FFE4EC] bg-white transition-transform duration-300 ease-out md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b-4 border-[#FFE4EC] px-4">
            <Link href="/app" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#FF9F43] shadow-lg group-hover:scale-110 transition-transform">
                  <Palette className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD93D]">
                  <Star className="h-3 w-3 text-[#2D1B4E]" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-[#FF6B9D] to-[#A66CFF] bg-clip-text text-transparent">
                  Colorir e Aprender
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-[#FFE4EC]"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5 text-[#FF6B9D]" />
            </Button>
          </div>

          {/* User Stats */}
          <div className="p-4 border-b-2 border-[#FFE4EC]">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFE4EC] to-[#FFF0F5] text-3xl border-3 border-[#FF6B9D]/30">
                {avatar.emoji}
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground text-lg">
                  {profile?.nome || 'Aventureiro'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] text-white text-xs font-bold">
                    <Sparkles className="h-3 w-3" />
                    Nivel {nivel}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">XP para nivel {nivel + 1}</span>
                <span className="font-bold text-[#6BCB77]">{xpProgress}/{XP_PER_LEVEL}</span>
              </div>
              <Progress value={(xpProgress / XP_PER_LEVEL) * 100} className="h-3 bg-[#E8F8EA]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#FFD93D] text-[#FFD93D]" />
                  <span className="font-bold text-foreground">{profile?.estrelas || 0}</span>
                  <span className="text-xs text-muted-foreground">estrelas</span>
                </div>
                {isPremium && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-[#A66CFF] to-[#FF6B9D] text-white text-xs font-bold">
                    <Crown className="h-3 w-3" />
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/app' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition-all duration-200",
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : "text-muted-foreground hover:bg-[#FFE4EC] hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                      isActive 
                        ? "bg-white/20" 
                        : `bg-gradient-to-br ${item.color} shadow-md`
                    )}>
                      <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-white")} />
                    </div>
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Premium CTA */}
          {!isPremium && (
            <div className="p-4 border-t-2 border-[#FFE4EC]">
              <div className="rounded-2xl bg-gradient-to-br from-[#FFF8E1] to-[#FFE4EC] p-4 border-2 border-[#FFD93D]/30">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#FFD93D] to-[#FF9F43]">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-foreground">Seja Premium!</span>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  Desbloqueie TUDO e ganhe mais estrelas!
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] hover:opacity-90 text-white font-bold rounded-xl"
                  asChild
                >
                  <Link href="/app/premium">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Assinar Agora
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
