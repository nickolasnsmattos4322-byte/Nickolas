import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/app/sidebar'
import { AppHeader } from '@/components/app/header'
import { getProfileWithAdminCheck } from '@/lib/admin'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getProfileWithAdminCheck()

  if (!user) {
    redirect('/entrar')
  }

  return (
    <div className="flex min-h-screen bg-[#FFF9F0]">
      <AppSidebar profile={profile} />
      <div className="flex flex-1 flex-col md:pl-72">
        <AppHeader profile={profile} user={user} />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
