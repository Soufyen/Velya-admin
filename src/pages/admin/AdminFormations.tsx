/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import FormationModal from '../../components/admin/FormationModal';
import FormationWizard from '../../components/admin/FormationWizard';
import FormationViewModal from '../../components/admin/FormationViewModal';
import FormationDeleteModal from '../../components/admin/FormationDeleteModal';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { toast } from 'react-toastify';
import { createFormation, getAdminFormations, updateFormation, deleteFormation, publishFormation, draftFormation, archiveFormation } from '../../lib/api';
import { Formation } from '../../lib/types';

export default function AdminFormations() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  // Fetch formations on mount
  useEffect(() => {
    async function fetchFormations() {
      setIsLoading(true);
      try {
        const data = await getAdminFormations();
        if (!Array.isArray(data)) {
          throw new Error('API did not return an array');
        }
        console.log('Fetched formations:', data); // Debug log
        setFormations(data);
      } catch (error: any) {
        toast.error(`Erreur lors du chargement des formations: ${error.message || 'Erreur inconnue'}`);
        console.error('Error fetching formations:', error);
        setFormations([]); // Reset state to prevent rendering issues
      } finally {
        setIsLoading(false);
      }
    }
    fetchFormations();
  }, []);

  // Get unique categories for the filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = Array.from(new Set(formations.map(f => f.category?.title || 'Inconnu'))).sort();
    return categories;
  }, [formations]);

  // Memoized filtering and pagination
  const filteredFormations = useMemo(() => {
    return formations.filter(formation => {
      const title = formation.title  || '';
      const description = formation.description || '';
      const categoryTitle = formation.category?.title || '';
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || categoryFilter === 'all' || categoryTitle === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [formations, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredFormations.length / itemsPerPage);
  const paginatedFormations = useMemo(() => {
    return filteredFormations.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredFormations, currentPage]);

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'Sourcils': return 'default';
      case 'Lèvres': return 'secondary';
      case 'Yeux': return 'outline';
      case 'Hygiène': return 'destructive';
      default: return 'secondary';
    }
  };

  // Handle create/edit formation
  const handleCreateFormation = async (formation: Partial<Formation>) => {
    try {
      if (modalMode === 'create') {
        // const newFormation = await createFormation(formation);
        // setFormations([newFormation, ...formations]);
        // toast.success('Formation créée avec succès.');
        alert(JSON.stringify(formation));
      } else if (selectedFormation) {
        const updatedFormation = await updateFormation(selectedFormation.id, formation);
        setFormations(formations.map(f => f.id === updatedFormation.id ? updatedFormation : f));
        toast.success('Formation mise à jour avec succès.');
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(`Erreur lors de la sauvegarde de la formation: ${error.message || 'Erreur inconnue'}`);
      console.error('Error saving formation:', error);
    }
  };

  // Handle wizard success
  const handleWizardSuccess = (updatedFormation: Formation) => {
    if (selectedFormation) {
      // Mode édition - mettre à jour la formation existante
      setFormations(formations.map(f => 
        f.id === updatedFormation.id ? updatedFormation : f
      ));
      toast.success('Formation mise à jour avec succès.');
    } else {
      // Mode création - ajouter la nouvelle formation
      setFormations([updatedFormation, ...formations]);
      toast.success('Formation créée avec succès.');
    }
    setSelectedFormation(null);
  };

  // Handle view formation
  const handleViewFormation = (formation: Formation) => {
    setSelectedFormation(formation);
    setShowViewModal(true);
  };

  // Handle edit formation
  const handleEditFormation = (formation: Formation) => {
    setSelectedFormation(formation);
    setShowWizard(true);
  };

  // Handle delete formation
  const handleDeleteFormation = (formation: Formation) => {
    setSelectedFormation(formation);
    setShowDeleteModal(true);
  };

  // Handle confirm delete
const handleConfirmDelete = async (id: string) => {
  try {
    setFormations(prev => prev.filter(f => f.id !== id));
    await deleteFormation(id);
    toast.success('Formation supprimée avec succès.');
    setShowDeleteModal(false);
    setSelectedFormation(null);
    
  } catch (error: any) {
    toast.error(`Erreur lors de la suppression de la formation: ${error.message || 'Erreur inconnue'}`);
    console.error('Error deleting formation:', error);
  }
  
};

  // Handle status update (publish/draft)
  const handleUpdateStatus = async (id: string, published: boolean) => {
    try {
      const updatedFormation = published ? await publishFormation(id) : await archiveFormation(id);
      setFormations(formations.map(f => f.id === id ? updatedFormation : f));
      toast.success(`Formation ${published ? 'publiée' : 'archivée'} avec succès.`);
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour du statut: ${error.message || 'Erreur inconnue'}`);
      console.error('Error updating formation status:', error);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFormation(null);
    setModalMode('create');
  };

  // Debug: Log state to console
  console.log('Formations:', formations);
  console.log('Filtered Formations:', filteredFormations);
  console.log('Paginated Formations:', paginatedFormations);

  return (
    <div className="spacing-responsive admin-page-container">
      {/* Fallback UI for debugging */}
      {formations.length === 0 && !isLoading && (
        <div className="text-center py-4">Aucune donnée disponible. Vérifiez l'API.</div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-responsive-xl font-bold text-primary">Formations</h1>
          <p className="text-responsive-base text-muted-foreground">
            Gérez vos formations et cours en ligne
          </p>
        </div>
        <Button
          className="bg-gradient-primary hover:opacity-90 touch-target w-full md:w-auto flex-shrink-0"
          onClick={() => setShowWizard(true)}
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">Nouvelle formation</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-card">
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
          <CardTitle className="text-responsive-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="admin-filters-container flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 touch-target w-full"
                disabled={isLoading}
              />
            </div>
            <div className="admin-select-responsive flex-shrink-0">
              <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={isLoading}>
                <SelectTrigger className="w-full touch-target">
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formations List */}
      <Card className="shadow-card">
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
          <CardTitle className="text-responsive-lg">Formations ({filteredFormations.length})</CardTitle>
          <CardDescription className="text-responsive-base">
            Liste de toutes vos formations disponibles
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="w-full overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead className="min-w-[200px]">Formation</TableHead>
                    <TableHead className="min-w-[120px]">Catégorie</TableHead>
                    <TableHead className="min-w-[100px]">Prix</TableHead>
                    <TableHead className="min-w-[100px]">Durée</TableHead>
                    <TableHead className="min-w-[110px]">Inscriptions</TableHead>
                    <TableHead className="min-w-[100px]">Statut</TableHead>
                    <TableHead className="w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : paginatedFormations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        Aucune formation trouvée.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedFormations.map((formation) => {
                      const description = formation.SEO || '';
                      const truncatedDescription = description.length > 60 ? `${description.substring(0, 60)}...` : description;
                      return (
                        <TableRow key={formation.id}>
                          <TableCell className="w-[80px]">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                              {formation.imageLink ? (
                                <img
                                  src={formation.imageLink}
                                  alt={formation.title || 'Formation'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <ImageIcon className={`w-6 h-6 text-gray-400 ${formation.imageLink ? 'hidden' : 'flex'}`} />

                            </div>
                          </TableCell>
                          <TableCell className="min-w-[200px]">
                            <div>
                              <div className="font-medium">
                                {formation.title|| 'Sans titre'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {truncatedDescription || 'Aucune description'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[120px]">
                            <Badge variant={getCategoryBadgeVariant(formation.category?.title || 'Inconnu')}>
                              {formation.category?.title || 'Inconnu'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium min-w-[100px]">
                            {typeof formation.price === 'number' ? `${formation.price} TND` : formation.price || 'N/A'}
                          </TableCell>
                          <TableCell className="min-w-[100px]">{formation.durationDays || 0} jours</TableCell>
                          <TableCell className="min-w-[110px]">
                            <span className="font-medium">{formation.preregistrations?.length }/{formation.max}</span>
                          </TableCell>
                          <TableCell className="min-w-[100px]">
                            <Badge variant={formation.status === 'PUBLIC' ? 'default' : 'outline'}>
                              {formation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[120px] text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewFormation(formation)}
                                className="touch-target"
                                aria-label={`Voir la formation ${formation.title || 'Sans titre'}`}
                                disabled={isLoading}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditFormation(formation)}
                                className="touch-target"
                                aria-label={`Modifier la formation ${formation.title || 'Sans titre'}`}
                                disabled={isLoading}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteFormation(formation)}
                                className="touch-target"
                                aria-label={`Supprimer la formation ${formation.title || 'Sans titre'}`}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mt-6 pt-4 border-t">
              <div className="text-xs md:text-sm text-muted-foreground text-center lg:text-left">
                Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredFormations.length)} sur {filteredFormations.length} formations
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="touch-target px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden md:inline ml-1">Précédent</span>
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                    let page;
                    if (totalPages <= 3) {
                      page = i + 1;
                    } else if (currentPage <= 2) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      page = totalPages - 2 + i;
                    } else {
                      page = currentPage - 1 + i;
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-8 p-0 touch-target text-xs"
                        disabled={isLoading}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || isLoading}
                  className="touch-target px-3"
                >
                  <span className="hidden md:inline mr-1">Suivant</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <FormationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleCreateFormation}
        formation={selectedFormation}
        mode={modalMode}
      />

      <FormationViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        formation={selectedFormation}
        onUpdateStatus={handleUpdateStatus}
      />

      <FormationDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        formation={selectedFormation}
        onDelete={handleConfirmDelete}
      />

      <FormationWizard
        isOpen={showWizard}
        onClose={() => {
          setShowWizard(false);
          setSelectedFormation(null);
        }}
        onSuccess={handleWizardSuccess}
        formation={selectedFormation}
      />
    </div>
  );
}