import React from 'react'
import { User, Mail, Calendar, Settings, LogOut, Phone } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import profileAvatar from '@/assets/profile-avatar.jpg'

interface ProfileMenuProps {
  onProfileClick?: () => void
  onSettingsClick?: () => void
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  onProfileClick,
  onSettingsClick,
}) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const handleViewProfile = () => {
    navigate('/profile')
  }

  const getInitials = (fullName: string) => {
    if (!fullName) return 'NN'
    const names = fullName.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return fullName.substring(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative h-10 w-10 rounded-full'
        >
          <Avatar className='h-10 w-10'>
            <AvatarImage src={profileAvatar} alt='Profile' />
            <AvatarFallback className='bg-primary text-primary-foreground'>
              {getInitials(user?.fullName || '')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-80' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-3 p-2'>
            {/* Avatar et nom principal */}
            <div className='flex items-center space-x-3'>
              <Avatar className='h-12 w-12'>
                <AvatarImage src={profileAvatar} alt='Profile' />
                <AvatarFallback className='bg-primary text-primary-foreground text-lg'>
                  {getInitials(user?.fullName || '')}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <p className='text-base font-semibold leading-none'>
                  {user?.fullName || 'Nom non défini'}
                </p>
                <p className='text-sm text-muted-foreground mt-1'>
                  {user?.role || 'Rôle non défini'}
                </p>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className='space-y-2 pt-2 border-t'>
              <div className='flex items-center space-x-2 text-sm'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Email:</span>
                <span className='font-medium'>{user?.email || 'Non défini'}</span>
              </div>
              
              <div className='flex items-center space-x-2 text-sm'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Téléphone:</span>
                <span className='font-medium'>{user?.phone || 'Non défini'}</span>
              </div>
              
              <div className='flex items-center space-x-2 text-sm'>
                <User className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>ID:</span>
                <span className='font-medium font-mono text-xs'>
                  {user?.id ? user.id.substring(0, 8) + '...' : 'Non défini'}
                </span>
              </div>

              <div className='flex items-center space-x-2 text-sm'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Connecté depuis:</span>
                <span className='font-medium'>
                  {new Date().toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className='cursor-pointer'
          onClick={handleViewProfile}
        >
          <User className='mr-2 h-4 w-4' />
          <span>Voir le profil</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className='cursor-pointer'
          onClick={onSettingsClick}
        >
          <Settings className='mr-2 h-4 w-4' />
          <span>Paramètres</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className='cursor-pointer text-destructive focus:text-destructive'
          onClick={handleLogout}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}