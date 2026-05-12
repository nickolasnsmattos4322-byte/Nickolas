import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity } from '@/lib/types'
import { Printer, Crown, Lock, Download } from 'lucide-react'

export default async function ImprimirPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: activities } = await supabase
    .from('activities')
    .select('*, category:categories(*)')
    .order('ordem')

  const isPremium = profile?.plano === 'premium'

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-600">
            <Printer className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Imprimir</h1>
            <p className="text-muted-foreground">Baixe atividades para imprimir e colorir!</p>
          </div>
        </div>
      </div>

      {!isPremium && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">Recurso Premium</h3>
              <p className="text-sm text-muted-foreground">
                Assine o Premium para baixar todas as atividades em PDF para imprimir!
              </p>
            </div>
            <Button asChild>
              <Link href="/app/premium">
                Assinar Premium
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {activities?.map((activity: Activity) => (
          <Card key={activity.id} className="group relative overflow-hidden">
            <div className="relative aspect-square bg-secondary/30 p-6">
              {activity.svg_data ? (
                <div 
                  className="flex h-full w-full items-center justify-center text-foreground/60"
                  dangerouslySetInnerHTML={{ __html: activity.svg_data }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Printer className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}
              
              {!isPremium && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Premium</span>
                  </div>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <h4 className="mb-2 font-bold text-foreground line-clamp-1">
                {activity.titulo}
              </h4>
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={!isPremium}
                asChild={isPremium}
              >
                {isPremium ? (
                  <a href={`/api/print/${activity.id}`} download>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </a>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Premium
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
