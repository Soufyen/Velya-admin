import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { PreRegistration } from '@/lib/types'
import { mockFormations } from '@/data/mockData'
import { User, Mail, Phone, Calendar, MessageSquare, Tag } from 'lucide-react'

interface RegistrationViewModalProps {
  registration: PreRegistration | null
  isOpen: boolean
  onClose: () => void
}

export const RegistrationViewModal: React.FC<RegistrationViewModalProps> = ({
  registration,
  isOpen,
  onClose,
}) => {
  if (!registration) return null

  const getStatusColor = (status: PreRegistration['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    }
  }

  const getStatusLabel = (status: PreRegistration['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmée'
      case 'REJECTED':
        return 'Rejetée'
      case 'PENDING':
      default:
        return 'En attente'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getFormationDetails = () => {
    const formation = mockFormations.find(
      (f) => f.id === registration.formationId
    )
    return formation
      ? {
          title: formation.title,
          category: formation.category,
          level: formation.level,
          duration: formation.duration,
          price: formation.price,
        }
      : null
  }

  const formationDetails = getFormationDetails()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            Détails de la préinscription
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Informations personnelles */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-muted-foreground'>
                Prénom
              </Label>
              <div className='flex items-center gap-2'>
                <User className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium'>{registration.name}</span>
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium text-muted-foreground'>
                Nom
              </Label>
              <div className='flex items-center gap-2'>
                <User className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium'>{registration.lastName}</span>
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium text-muted-foreground'>
                Email
              </Label>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium break-all'>
                  {registration.email}
                </span>
              </div>
            </div>

            {registration.phone && (
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-muted-foreground'>
                  Téléphone
                </Label>
                <div className='flex items-center gap-2'>
                  <Phone className='h-4 w-4 text-muted-foreground' />
                  <span className='font-medium'>{registration.phone}</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Informations de la formation */}
          {formationDetails && (
            <>
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-primary'>
                  Formation demandée
                </h3>
                <div className='bg-muted/30 p-4 rounded-lg border space-y-3'>
                  <div>
                    <Label className='text-sm font-medium text-muted-foreground'>
                      Titre de la formation
                    </Label>
                    <p className='font-medium mt-1'>{formationDetails.title}</p>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                    <div>
                      <Label className='text-sm font-medium text-muted-foreground'>
                        Catégorie
                      </Label>
                      <Badge variant='outline' className='mt-1'>
                        {formationDetails.category}
                      </Badge>
                    </div>
                    <div>
                      <Label className='text-sm font-medium text-muted-foreground'>
                        Niveau
                      </Label>
                      <Badge variant='secondary' className='mt-1'>
                        {formationDetails.level}
                      </Badge>
                    </div>
                    <div>
                      <Label className='text-sm font-medium text-muted-foreground'>
                        Durée
                      </Label>
                      <p className='text-sm font-medium mt-1'>
                        {formationDetails.duration}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className='text-sm font-medium text-muted-foreground'>
                      Prix
                    </Label>
                    <p className='text-lg font-bold text-primary mt-1'>
                      {formationDetails.price}€
                    </p>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Informations de la préinscription */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-muted-foreground'>
                Date de préinscription
              </Label>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium'>
                  {formatDate(registration.createdAt)}
                </span>
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium text-muted-foreground'>
                Statut actuel
              </Label>
              <div className='flex items-center gap-2'>
                <Tag className='h-4 w-4 text-muted-foreground' />
                <Badge className={getStatusColor(registration.status)}>
                  {getStatusLabel(registration.status)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Message du candidat */}
          {registration.message && (
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-muted-foreground'>
                Message du candidat
              </Label>
              <div className='flex items-start gap-2'>
                <MessageSquare className='h-4 w-4 text-muted-foreground mt-1 flex-shrink-0' />
                <div className='bg-muted/30 p-3 rounded-lg border'>
                  <p className='text-sm leading-relaxed'>
                    {registration.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className='flex justify-end'>
            <Button variant='outline' onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
