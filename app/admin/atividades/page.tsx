import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Crown, Star, Edit, Trash2 } from 'lucide-react'
import { Activity, Category } from '@/lib/types'

export default async function AdminAtividades() {
  const supabase = await createClient()

  const { data: activities } = await supabase
    .from('activities')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('ordem')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Atividades</h1>
        <Button asChild>
          <Link href="/admin/atividades/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Atividade
          </Link>
        </Button>
      </div>

      {/* Categories Summary */}
      <div className="flex flex-wrap gap-2">
        {categories?.map((category: Category) => (
          <Badge key={category.id} variant="secondary">
            {category.nome}
          </Badge>
        ))}
      </div>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Atividades ({activities?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities?.map((activity: Activity) => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  {/* SVG Preview */}
                  <div className="h-16 w-16 rounded-lg bg-secondary/50 p-2">
                    {activity.svg_data ? (
                      <div 
                        className="h-full w-full text-foreground/60"
                        dangerouslySetInnerHTML={{ __html: activity.svg_data }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        ?
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{activity.titulo}</p>
                      {activity.is_premium && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                      {activity.is_featured && (
                        <Star className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.tipo} • {activity.category?.nome || 'Sem categoria'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Idade: {activity.idade_minima}-{activity.idade_maxima} anos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/atividades/${activity.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {(!activities || activities.length === 0) && (
              <div className="py-12 text-center text-muted-foreground">
                Nenhuma atividade cadastrada ainda.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
