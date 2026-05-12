import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Palette, Crown, Activity } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: premiumUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('plano', 'premium')

  const { count: totalActivities } = await supabase
    .from('activities')
    .select('*', { count: 'exact', head: true })

  const { count: totalCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  const stats = [
    {
      title: 'Total de Usuarios',
      value: totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Usuarios Premium',
      value: premiumUsers || 0,
      icon: Crown,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Atividades',
      value: totalActivities || 0,
      icon: Palette,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      title: 'Categorias',
      value: totalCategories || 0,
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ]

  // Recent users
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Recentes</CardTitle>
          <CardDescription>Ultimos usuarios cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers?.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{user.nome || 'Sem nome'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    user.plano === 'premium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.plano === 'premium' ? 'Premium' : 'Gratuito'}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
