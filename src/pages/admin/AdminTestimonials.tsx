import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit3, Trash2, Eye, Star, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Testimonial } from '@/lib/types';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, publishTestimonial } from '@/lib/api/testimonials';

const ITEMS_PER_PAGE = 10;

export default function AdminTestimonials() {
  const { toast } = useToast();
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    imageProfileLink: '',
    name: '',
    lastName: '',
    speciality: '',
    comment: '',
    note: '5'
  });

  // Load testimonials on component mount
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les témoignages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      imageProfileLink: '',
      name: '',
      lastName: '',
      speciality: '',
      comment: '',
      note: '5'
    });
  };

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        imageProfileLink: testimonial.imageProfileLink || '',
        name: testimonial.name,
        lastName: testimonial.lastName,
        speciality: testimonial.speciality,
        comment: testimonial.comment,
        note: testimonial.note
      });
    } else {
      setEditingTestimonial(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTestimonial(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, formData);
        toast({
          title: "Succès",
          description: "Témoignage modifié avec succès",
        });
      } else {
        await createTestimonial(formData);
        toast({
          title: "Succès",
          description: "Témoignage créé avec succès",
        });
      }
      
      await loadTestimonials();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le témoignage",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    setTestimonialToDelete(id);
  };

  const confirmDelete = async () => {
    if (!testimonialToDelete) return;
    
    const testimonialId = testimonialToDelete;
    
    try {
      await deleteTestimonial(testimonialId);
      toast({
        title: "Succès",
        description: "Témoignage supprimé avec succès",
      });
      setTestimonialToDelete(null);
      await loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le témoignage",
        variant: "destructive",
      });
      setTestimonialToDelete(null);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishTestimonial(id);
      toast({
        title: "Succès",
        description: "Statut du témoignage mis à jour",
      });
      await loadTestimonials();
    } catch (error) {
      console.error('Error publishing testimonial:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Filtrage des témoignages
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = searchTerm === '' || 
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || testimonial.note === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTestimonials = filteredTestimonials.slice(startIndex, endIndex);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, ratingFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Témoignages</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement des témoignages...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="spacing-responsive admin-page-container">
      {/* En-tête */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-responsive-xl font-bold text-primary">Témoignages</h1>
          <p className="text-responsive-base text-muted-foreground">
            Gérez les témoignages de vos clients
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-primary hover:opacity-90 touch-target w-full md:w-auto flex-shrink-0"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">Nouveau témoignage</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Modifier le témoignage' : 'Ajouter un témoignage'}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial 
                  ? 'Modifiez les informations du témoignage ci-dessous.'
                  : 'Remplissez les informations pour ajouter un nouveau témoignage.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Prénom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="speciality">Spécialité</Label>
                <Input
                  id="speciality"
                  value={formData.speciality}
                  onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageProfileLink">URL de l'image de profil</Label>
                <Input
                  id="imageProfileLink"
                  type="url"
                  value={formData.imageProfileLink}
                  onChange={(e) => setFormData({ ...formData, imageProfileLink: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Évaluation</Label>
                <Select
                  value={formData.note}
                  onValueChange={(value) => setFormData({ ...formData, note: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center gap-2">
                          <span>{rating}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Témoignage</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingTestimonial ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres et recherche */}
      <Card className="shadow-card">
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
          <CardTitle className="text-responsive-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="admin-filters-container flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Rechercher un témoignage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 touch-target w-full"
              />
            </div>
            <div className="admin-select-responsive flex-shrink-0">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full touch-target">
                  <SelectValue placeholder="Toutes évaluations" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  <SelectItem value="all">Toutes évaluations</SelectItem>
                  <SelectItem value="5">5 étoiles</SelectItem>
                  <SelectItem value="4">4 étoiles</SelectItem>
                  <SelectItem value="3">3 étoiles</SelectItem>
                  <SelectItem value="2">2 étoiles</SelectItem>
                  <SelectItem value="1">1 étoile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des témoignages */}
      <Card className="shadow-card">
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
          <CardTitle className="text-responsive-lg">Témoignages ({filteredTestimonials.length})</CardTitle>
          <CardDescription className="text-responsive-base">
            Liste de tous vos témoignages clients
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {testimonials.length === 0 ? 'Aucun témoignage trouvé' : 'Aucun témoignage ne correspond aux critères de recherche'}
              </p>
            </div>
          ) : (
            <>
              <div className="w-full overflow-hidden">
                <div className="overflow-x-auto">
                  <Table className="w-full min-w-[900px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Client</TableHead>
                        <TableHead className="min-w-[180px]">Spécialité</TableHead>
                        <TableHead className="min-w-[140px]">Évaluation</TableHead>
                        <TableHead className="min-w-[120px]">Date</TableHead>
                        <TableHead className="w-[120px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTestimonials.map((testimonial) => (
                        <TableRow key={testimonial.id}>
                          <TableCell className="min-w-[200px]">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage src={testimonial.imageProfileLink} alt={`${testimonial.name} ${testimonial.lastName}`} />
                                <AvatarFallback>
                                  {testimonial.name.charAt(0)}{testimonial.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {testimonial.name} {testimonial.lastName}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[180px] truncate">{testimonial.speciality}</TableCell>
                          <TableCell className="min-w-[140px]">{renderStars(parseInt(testimonial.note))}</TableCell>
                          <TableCell className="min-w-[120px]">{testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</TableCell>
                          <TableCell className="w-[120px] text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setViewingTestimonial(testimonial);
                                }}
                                className="touch-target"
                                type="button"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleOpenDialog(testimonial);
                                }}
                                className="touch-target"
                                type="button"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDelete(testimonial.id);
                                }}
                                className="touch-target"
                                type="button"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination responsive */}
              {totalPages > 1 && (
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mt-6 pt-4 border-t">
                  <div className="text-xs md:text-sm text-muted-foreground text-center lg:text-left">
                    Affichage de {((currentPage - 1) * ITEMS_PER_PAGE) + 1} à {Math.min(currentPage * ITEMS_PER_PAGE, filteredTestimonials.length)} sur {filteredTestimonials.length} témoignages
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="touch-target px-3"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden md:inline ml-1">Précédent</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8 p-0 touch-target"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="touch-target px-3"
                    >
                      <span className="hidden md:inline mr-1">Suivant</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Testimonial Dialog */}
      <Dialog open={!!viewingTestimonial} onOpenChange={() => setViewingTestimonial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du témoignage</DialogTitle>
          </DialogHeader>
          {viewingTestimonial && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={viewingTestimonial.imageProfileLink} alt={`${viewingTestimonial.name} ${viewingTestimonial.lastName}`} />
                  <AvatarFallback className="text-lg">
                    {viewingTestimonial.name.charAt(0)}{viewingTestimonial.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {viewingTestimonial.name} {viewingTestimonial.lastName}
                  </h3>
                  <p className="text-muted-foreground">{viewingTestimonial.speciality}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(parseInt(viewingTestimonial.note))}
                    <span className="text-sm text-muted-foreground">({viewingTestimonial.note}/5)</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Témoignage :</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {viewingTestimonial.comment}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Ajouté le {viewingTestimonial.createdAt ? new Date(viewingTestimonial.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const testimonial = viewingTestimonial;
                      setViewingTestimonial(null);
                      handleOpenDialog(testimonial);
                    }}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (viewingTestimonial?.id) {
                        handlePublish(viewingTestimonial.id);
                      }
                    }}
                  >
                    Publier/Dépublier
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation de suppression de témoignage */}
      <AlertDialog open={!!testimonialToDelete} onOpenChange={(open) => {
        if (!open) {
          setTestimonialToDelete(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTestimonialToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                confirmDelete();
              }} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}