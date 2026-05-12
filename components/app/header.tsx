'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Crown, LogOut, Settings, User, Star, Bell, Sparkles, Trophy } from 'lucide-react'
import { Profile, AVATARS, calculateLevel } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface AppHeaderProps {
  profile: Profile | null
  user: SupabaseUser
}

export function AppHeader({ profile, user }: AppHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const isPremium = profile?.plano === 'premium'
  const avatar = AVATARS.find(a => a.id === profile?.avatar) || AVATARS[0]
  const nivel = profile?.nivel || calculateLevel(profile?.xp || 0)

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Erro ao sair')
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b-4 border-[#FFE4EC] bg-white px-4 md:px-6">
      <div className="flex items-center gap-4 md:ml-0 ml-16">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{['🌞', '🌈', '⭐', '🎨', '🦋'][new Date().getDay() % 5]}</span>
          <div>
            <h1 className="text-xl font-bold text-foreground md:text-2xl">
              Ola, <span className="bg-gradient-to-r from-[#FF6B9D] to-[#A66CFF] bg-clip-text text-transparent">{profile?.nome?.split(' ')[0] || 'Amigo'}</span>!
            </h1>
            <p className="text-sm text-muted-foreground">Que tal aprender algo novo hoje?</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Stars Display */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FFF8E1] to-[#FFE4EC] border-2 border-[#FFD93D]/30">
          <Star className="h-5 w-5 fill-[#FFD93D] text-[#FFD93D]" />
          <span className="font-bold text-foreground">{profile?.estrelas || 0}</span>
        </div>

        {/* Level Badge */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#E8F8EA] to-[#E8F0FF] border-2 border-[#6BCB77]/30">
          <Trophy className="h-5 w-5 text-[#6BCB77]" />
          <span className="font-bold text-foreground">Nivel {nivel}</span>
        </div>

        {/* Premium Badge */}
        {isPremium ? (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#A66CFF] to-[#FF6B9D] text-white">
            <Crown className="h-5 w-5" />
            <span className="font-bold">Premium</span>
          </div>
        ) : (
          <Button 
            className="hidden sm:flex bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] hover:opacity-90 text-white font-bold rounded-xl"
            asChild
          >
            <Link href="/app/premium">
              <Sparkles className="mr-2 h-4 w-4" />
              Seja Premium
            </Link>
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-[#FFE4EC]">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B9D] text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-2xl hover:bg-[#FFE4EC] p-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFE4EC] to-[#FFF0F5] text-2xl border-2 border-[#FF6B9D]/30">
                {avatar.emoji}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl border-2 border-[#FFE4EC] p-2">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3 p-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFE4EC] to-[#FFF0F5] text-2xl">
                  {avatar.emoji}
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-bold">{profile?.nome || 'Usuario'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#FFE4EC]" />
            
            {/* Mobile stats */}
            <div className="md:hidden p-2 space-y-2">
              <div className="flex items-center justify-between px-2 py-1 rounded-xl bg-[#FFF8E1]">
                <span className="text-sm text-muted-foreground">Estrelas</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#FFD93D] text-[#FFD93D]" />
                  <span className="font-bold">{profile?.estrelas || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded-xl bg-[#E8F8EA]">
                <span className="text-sm text-muted-foreground">Nivel</span>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-[#6BCB77]" />
                  <span className="font-bold">{nivel}</span>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="md:hidden bg-[#FFE4EC]" />

            <DropdownMenuItem 
              onClick={() => router.push('/app/perfil')}
              className="rounded-xl hover:bg-[#FFE4EC] cursor-pointer"
            >
              <User className="mr-2 h-4 w-4 text-[#FF6B9D]" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => router.push('/app/conquistas')}
              className="rounded-xl hover:bg-[#FFE4EC] cursor-pointer"
            >
              <Trophy className="mr-2 h-4 w-4 text-[#FFD93D]" />
              Conquistas
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => router.push('/app/configuracoes')}
              className="rounded-xl hover:bg-[#FFE4EC] cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4 text-[#4D96FF]" />
              Configuracoes
            </DropdownMenuItem>
            {!isPremium && (
              <DropdownMenuItem 
                onClick={() => router.push('/app/premium')}
                className="rounded-xl hover:bg-[#FFF8E1] cursor-pointer"
              >
                <Crown className="mr-2 h-4 w-4 text-[#FF9F43]" />
                Assinar Premium
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-[#FFE4EC]" />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="rounded-xl hover:bg-[#FFE4EC] cursor-pointer text-[#FF4757]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
