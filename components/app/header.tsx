'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Crown, LogOut, Settings, User } from 'lucide-react'
import { Profile } from '@/lib/types'
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

  const initials = profile?.nome
    ? profile.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.[0].toUpperCase() || 'U'

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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-4 md:ml-0 ml-14">
        <h1 className="text-lg font-semibold text-foreground md:text-xl">
          Ola, {profile?.nome?.split(' ')[0] || 'Amigo'}!
        </h1>
        {isPremium && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Crown className="mr-1 h-3 w-3" />
            Premium
          </Badge>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{profile?.nome || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/app/perfil')}>
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/app/configuracoes')}>
            <Settings className="mr-2 h-4 w-4" />
            Configuracoes
          </DropdownMenuItem>
          {!isPremium && (
            <DropdownMenuItem onClick={() => router.push('/app/premium')}>
              <Crown className="mr-2 h-4 w-4" />
              Assinar Premium
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
