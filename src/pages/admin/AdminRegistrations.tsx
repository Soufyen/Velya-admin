// src/pages/admin/AdminRegistrations.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RegistrationViewModal } from '@/components/admin/RegistrationViewModal';
import { Search, Eye, Trash2, Users } from 'lucide-react';
import {
  getPreRegistrations,
  deletePreRegistration,
  updatePreRegistrationStatus,
} from '@/lib/api/pre-registrations';
import { getFormations } from '@/lib/api/formations';
import { PreRegistration, Formation } from '@/lib/types';

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<PreRegistration[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<PreRegistration | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formationFilter, setFormationFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch registrations and formations on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [regs, forms] = await Promise.all([getPreRegistrations(), getFormations()]);
        setRegistrations(regs);
        setFormations(forms);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fonction dédiée pour le filtrage par formation
  const filterByFormation = (registration: PreRegistration, formationId: string): boolean => {
    if (formationId === 'all') {
      return true;
    }
    
    // Trouver la formation correspondante par ID
    const selectedFormation = formations.find(f => String(f.id) === formationId);
    
    // Comparer le titre de la formation de la pré-inscription avec le titre de la formation sélectionnée
    return selectedFormation && registration.formationTitle === selectedFormation.title;
  };

  // Fonction pour mapper les formations avec leurs IDs
  const getFormationOptions = () => {
    return formations.map(formation => ({
      id: String(formation.id),
      title: formation.title,
      value: String(formation.id)
    }));
  };

  // Fonction pour obtenir le titre de la formation sélectionnée
  const getSelectedFormationTitle = (formationId: string): string => {
    if (formationId === 'all') return 'Toutes les formations';
    const formation = formations.find(f => String(f.id) === formationId);
    return formation ? formation.title : 'Formation inconnue';
  };



  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;

    const matchesFormation = filterByFormation(registration, formationFilter);

    return matchesSearch && matchesStatus && matchesFormation;
  });



  const handleViewRegistration = (registration: PreRegistration) => {
    setSelectedRegistration(registration);
    setIsViewModalOpen(true);
  };

  const handleDeleteRegistration = async (id: string) => {
    try {
      await deletePreRegistration(id);
      setRegistrations(registrations.filter((reg) => reg.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la préinscription');
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, status: PreRegistration['status']) => {
    try {
      await updatePreRegistrationStatus(id, status);
      setRegistrations(
        registrations.map((reg) => (reg.id === id ? { ...reg, status } : reg))
      );
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error(err);
    }
  };

  const getStatusColor = (status: PreRegistration['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const getStatusLabel = (status: PreRegistration['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmée';
      case 'REJECTED':
        return 'Rejetée';
      case 'PENDING':
      default:
        return 'En attente';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatsCount = (status: PreRegistration['status']) => {
    return registrations.filter((reg) => reg.status === status).length;
  };

  const getFormationTitle = (registration: PreRegistration) => {
    return registration.formation?.title || registration.formationTitle || 'Formation inconnue';
  };

  const getFormationCategory = (registration: PreRegistration) => {
    return registration.formation?.category?.title || 'Non définie';
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Préinscriptions</h1>
          <p className="text-muted-foreground">
            Gérer les préinscriptions aux formations
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{getStatsCount('PENDING')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getStatsCount('CONFIRMED')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getStatsCount('REJECTED')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmées</SelectItem>
                  <SelectItem value="REJECTED">Rejetées</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select 
                value={formationFilter} 
                onValueChange={setFormationFilter}
                disabled={loading || formations.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Chargement..." : "Filtrer par formation"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les formations</SelectItem>
                  {getFormationOptions().map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="mobile-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Formation</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Décision</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        Aucune préinscription trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRegistrations.map((registration) => (
                      <TableRow key={registration.id} className="animate-fade-in">
                        <TableCell className="font-medium">{registration.name}</TableCell>
                        <TableCell className="font-medium">{registration.lastName}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{registration.email}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium line-clamp-2">{getFormationTitle(registration)}</div>
                            <Badge variant="outline" className="text-xs">
                              {getFormationCategory(registration)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{registration.phone || '-'}</TableCell>
                        <TableCell>{formatDate(registration.createdAt || new Date().toISOString())}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(registration.status)}>
                            {getStatusLabel(registration.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {/* Status change buttons */}
                            {registration.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(registration.id, 'CONFIRMED')}
                                  className="touch-target bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 font-medium"
                                >
                                  Confirmer
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(registration.id, 'REJECTED')}
                                  className="touch-target bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 font-medium"
                                >
                                  Rejeter
                                </Button>
                              </>
                            )}
                            {registration.status === 'CONFIRMED' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(registration.id, 'PENDING')}
                                  className="touch-target bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300 font-medium"
                                >
                                  En attente
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(registration.id, 'REJECTED')}
                                  className="touch-target bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 font-medium"
                                >
                                  Rejeter
                                </Button>
                              </>
                            )}
                            {registration.status === 'REJECTED' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(registration.id, 'PENDING')}
                                  className="touch-target bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300 font-medium"
                                >
                                  En attente
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(registration.id, 'CONFIRMED')}
                                  className="touch-target bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 font-medium"
                                >
                                  Confirmer
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRegistration(registration)}
                              className="touch-target"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="touch-target text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer la préinscription</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer la préinscription de {registration.name} {registration.lastName} ?
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                  <AlertDialogCancel className="w-full sm:w-auto">Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRegistration(registration.id)}
                                    className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Oui, je veux supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredRegistrations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune préinscription trouvée
              </div>
            ) : (
              filteredRegistrations.map((registration) => (
                <Card key={registration.id} className="animate-fade-in">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-responsive-base">
                            {registration.name} {registration.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {registration.email}
                          </p>
                        </div>
                        <Badge className={getStatusColor(registration.status)}>
                          {getStatusLabel(registration.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Formation</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {getFormationTitle(registration)}
                          </p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {getFormationCategory(registration)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Téléphone</p>
                            <p className="text-muted-foreground">{registration.phone || '-'}</p>
                          </div>
                          <div>
                            <p className="font-medium">Date</p>
                            <p className="text-muted-foreground">{formatDate(registration.createdAt || new Date().toISOString())}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRegistration(registration)}
                          className="flex-1 touch-target"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="touch-target">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer la préinscription</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer la préinscription de {registration.name} {registration.lastName} ?
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="w-full sm:w-auto">Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRegistration(registration.id)}
                                className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Oui, je veux supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      
                      {/* Status change buttons */}
                      <div className="flex gap-2 pt-2">
                        {registration.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(registration.id, 'CONFIRMED')}
                              className="flex-1 touch-target bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 font-medium"
                            >
                              Confirmer
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(registration.id, 'REJECTED')}
                              className="flex-1 touch-target bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 font-medium"
                            >
                              Rejeter
                            </Button>
                          </>
                        )}
                        {registration.status === 'CONFIRMED' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(registration.id, 'PENDING')}
                              className="flex-1 touch-target bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300 font-medium"
                            >
                              En attente
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(registration.id, 'REJECTED')}
                              className="flex-1 touch-target bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 font-medium"
                            >
                              Rejeter
                            </Button>
                          </>
                        )}
                        {registration.status === 'REJECTED' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(registration.id, 'PENDING')}
                              className="flex-1 touch-target bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300 font-medium"
                            >
                              En attente
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(registration.id, 'CONFIRMED')}
                              className="flex-1 touch-target bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 font-medium"
                            >
                              Confirmer
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de visualisation */}
      <RegistrationViewModal
        registration={selectedRegistration}

        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
}