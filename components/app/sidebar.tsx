'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Palette, 
  Home, 
  BookOpen, 
  Calculator, 
  Globe, 
  Heart, 
  Crown,
  Printer,
  X
} from 'lucide-react'
import { Profile } from '@/lib/types'
import { useState } from 'react'

const navigation = [
  { name: 'Inicio', href: '/app', icon: Home },
  { name: 'Colorir', href: '/app/colorir', icon: Palette },
  { name: 'Alfabetizacao', href: '/app/alfabetizacao', icon: BookOpen },
  { name: 'Matematica', href: '/app/matematica', icon: Calculator },
  { name: 'Ingles', href: '/app/ingles', icon: Globe },
  { name: 'Imprimir', href: '/app/imprimir', icon: Printer },
  { name: 'Favoritos', href: '/app/favoritos', icon: Heart },
]

interface AppSidebarProps {
  profile: Profile | null
}

export function AppSidebar({ profile }: AppSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isPremium = profile?.plano === 'premium'

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Palette className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-200 ease-in-out md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/app" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Palette className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Colorir e Aprender</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/app' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Premium CTA */}
          {!isPremium && (
            <div className="border-t p-4">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <span className="font-bold text-foreground">Premium</span>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  Desbloqueie todo o conteudo!
                </p>
                <Button size="sm" className="w-full" asChild>
                  <Link href="/app/premium">
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
