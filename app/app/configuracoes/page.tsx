import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, CreditCard, Bell, Shield, HelpCircle } from 'lucide-react'

const settings = [
  {
    title: 'Perfil',
    description: 'Gerencie suas informações pessoais',
    icon: User,
    href: '/app/perfil',
  },
  {
    title: 'Assinatura',
    description: 'Gerencie seu plano e pagamentos',
    icon: CreditCard,
    href: '/app/premium',
  },
  {
    title: 'Notificações',
    description: 'Configure suas preferências de notificação',
    icon: Bell,
    href: '#',
    disabled: true,
  },
  {
    title: 'Privacidade',
    description: 'Configurações de privacidade e dados',
    icon: Shield,
    href: '/privacidade',
  },
  {
    title: 'Ajuda',
    description: 'Central de ajuda e suporte',
    icon: HelpCircle,
    href: '#',
    disabled: true,
  },
]

export default function ConfiguracoesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="space-y-4">
        {settings.map((setting) => (
          <Card key={setting.title} className={setting.disabled ? 'opacity-50' : ''}>
            <CardContent className="p-0">
              {setting.disabled ? (
                <div className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <setting.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{setting.title}</h3>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Em breve</p>
                  </div>
                </div>
              ) : (
                <Link href={setting.href} className="flex items-center gap-4 p-6 transition-colors hover:bg-secondary/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <setting.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{setting.title}</h3>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
