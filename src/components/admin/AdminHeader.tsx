import React from 'react'
import { Menu } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { ProfileMenu } from './ProfileMenu'

export const AdminHeader: React.FC = () => {
  const { user } = useAuth()

  return (
    <header className='h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50'>
      <div className='flex items-center justify-between h-full px-4 md:px-6'>
        <div className='flex items-center gap-4'>
          <SidebarTrigger className='lg:hidden'>
            <Menu className='h-5 w-5' />
          </SidebarTrigger>

          <div className='hidden sm:block'>
            <h1 className='text-lg font-semibold text-primary'>
              Administration
            </h1>
            <p className='text-sm text-muted-foreground'>Gestion du contenu</p>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          {/* Affichage du nom de l'admin */}
          <div className='hidden md:flex flex-col items-end'>
            <p className='text-sm font-medium text-foreground'>
              {user?.fullName || 'Nom non défini'}
            </p>
            <p className='text-xs text-muted-foreground'>{user?.email}</p>
          </div>

          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
