import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, Calendar, Shield, Edit2, Save, X } from 'lucide-react'
import profileAvatar from '@/assets/profile-avatar.jpg'

export const AdminProfile: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const handleSave = () => {
    // Ici, vous pourriez ajouter la logique pour sauvegarder les modifications
    console.log('Sauvegarde des modifications:', editedUser)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedUser({
      fullName: user?.fullName || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    })
    setIsEditing(false)
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non disponible'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Mon Profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Carte de profil principal */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileAvatar} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {user?.fullName ? getInitials(user.fullName) : 'NN'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">
              {user?.fullName || 'Nom non défini'}
            </CardTitle>
            <CardDescription>{user?.email}</CardDescription>
            <Badge variant="secondary" className="w-fit mx-auto mt-2">
              <Shield className="h-3 w-3 mr-1" />
              Administrateur
            </Badge>
          </CardHeader>
        </Card>

        {/* Informations détaillées */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Vos informations de compte et de contact
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+33 1 23 45 67 89"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {user?.phone || 'Non défini'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={editedUser.fullName}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, fullName: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {user?.fullName || 'Non défini'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations du compte</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>ID Utilisateur</Label>
                  <p className="text-sm text-muted-foreground font-mono">
                    {user?.id || 'Non disponible'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Dernière connexion</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {formatDate(user?.lastLogin)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Statut du compte</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Actif
                  </Badge>
                  <Badge variant="secondary">
                    Administrateur
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carte de sécurité */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité
          </CardTitle>
          <CardDescription>
            Gérez la sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Mot de passe</h4>
                <p className="text-sm text-muted-foreground">
                  Dernière modification il y a plus de 30 jours
                </p>
              </div>
              <Button variant="outline" size="sm">
                Changer le mot de passe
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Authentification à deux facteurs</h4>
                <p className="text-sm text-muted-foreground">
                  Ajoutez une couche de sécurité supplémentaire
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}