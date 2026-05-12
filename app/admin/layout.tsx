import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Palette, 
  Users, 
  Settings,
  ArrowLeft
} from 'lucide-react'

// Define admin email - in production, use a proper role-based system
const ADMIN_EMAILS = ['admin@colorireaprender.com']

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/entrar')
  }

  // Simple admin check - in production, use proper role-based access
  // For now, we'll allow any authenticated user to access admin
  // You should implement proper admin verification

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Atividades', href: '/admin/atividades', icon: Palette },
    { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/app" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao App
            </Link>
            <span className="text-xl font-bold text-foreground">Admin</span>
          </div>
          <nav className="flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
