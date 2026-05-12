import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Mail, Calendar, Activity } from 'lucide-react'
import { Profile } from '@/lib/types'

export default async function AdminUsuarios() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const premiumCount = users?.filter(u => u.plano === 'premium').length || 0
  const freeCount = users?.filter(u => u.plano === 'free').length || 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Usuarios</h1>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Total de Usuarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{premiumCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Usuarios Premium</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{freeCount}</div>
            <p className="text-sm text-muted-foreground">Usuarios Gratuitos</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users?.map((user: Profile) => (
              <div 
                key={user.id} 
                className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.nome || 'Sem nome'}</p>
                    {user.plano === 'premium' && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Crown className="mr-1 h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Cadastro: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    Desenhos: {user.desenhos_gratis_usados}
                  </div>
                  {user.plano === 'premium' && user.data_renovacao && (
                    <div className="text-muted-foreground">
                      Renova: {new Date(user.data_renovacao).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {(!users || users.length === 0) && (
              <div className="py-12 text-center text-muted-foreground">
                Nenhum usuario cadastrado ainda.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
