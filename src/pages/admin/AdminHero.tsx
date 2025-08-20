import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Plus, Trash2, Edit3, Save, X, Upload, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MessagePromo, Diapo, Video } from '@/lib/types';
import { 
  getMessagePromos, 
  createMessagePromo, 
  updateMessagePromo, 
  deleteMessagePromo,
  updateMessagePromoStatus 
} from '@/lib/api/message-promos';
import { 
  getDiapos, 
  createDiapo, 
  updateDiapo, 
  deleteDiapo,
  updateDiapoStatus 
} from '@/lib/api/diapos';
import { 
  getVideos, 
  getAdminVideos,
  createVideo, 
  updateVideo, 
  deleteVideo as deleteVideoAPI,
  publishVideo 
} from '@/lib/api/videos';

// Fonction utilitaire pour extraire l'ID YouTube et générer l'URL de la miniature
const getYouTubeThumbnail = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=320&h=180&fit=crop';
  }
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=320&h=180&fit=crop';
};

export default function AdminHero() {
  const { toast } = useToast();
  
  // États pour les messages promotionnels
  const [promoMessages, setPromoMessages] = useState<MessagePromo[]>([]);
  const [newPromoMessage, setNewPromoMessage] = useState('');
  const [newPromoContent, setNewPromoContent] = useState('');
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [editingPromoText, setEditingPromoText] = useState('');
  const [loadingPromos, setLoadingPromos] = useState(true);
  
  // États pour les vidéos YouTube
  const [videos, setVideos] = useState<Video[]>([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingVideoTitle, setEditingVideoTitle] = useState('');
  const [editingVideoUrl, setEditingVideoUrl] = useState('');
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tempYoutubeUrl, setTempYoutubeUrl] = useState('');
  
  // États pour les confirmations de suppression
  const [promoToDelete, setPromoToDelete] = useState<string | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  
  // États pour les images du diaporama
  const [slideImages, setSlideImages] = useState<Diapo[]>([]);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingImageTitle, setEditingImageTitle] = useState('');
  const [editingImageUrl, setEditingImageUrl] = useState('');
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingSlides, setLoadingSlides] = useState(true);
  const [newImageAlt, setNewImageAlt] = useState('');

  // Chargement des données au montage du composant
  useEffect(() => {
    loadPromoMessages();
    loadVideos();
    loadSlideImages();
  }, []);

  // Fonctions de chargement des données
  const loadPromoMessages = async () => {
    try {
      setLoadingPromos(true);
      const data = await getMessagePromos();
      setPromoMessages(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages promotionnels",
        variant: "destructive",
      });
    } finally {
      setLoadingPromos(false);
    }
  };

  const loadVideos = async () => {
    try {
      setLoadingVideos(true);
      const data = await getAdminVideos();
      setVideos(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les vidéos",
        variant: "destructive",
      });
    } finally {
      setLoadingVideos(false);
    }
  };

  const loadSlideImages = async () => {
    try {
      setLoadingSlides(true);
      const data = await getDiapos();
      setSlideImages(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les images du diaporama",
        variant: "destructive",
      });
    } finally {
      setLoadingSlides(false);
    }
  };

  // Fonctions pour les messages promotionnels
  const addPromoMessage = async () => {
    if (newPromoContent.trim() && newPromoContent.length <= 70 && promoMessages.length < 5) {
      try {
        const newMessage = await createMessagePromo({
          content: newPromoContent.trim(),
          status: 'DRAFT'
        });
        setPromoMessages([...promoMessages, newMessage]);
        setNewPromoContent('');
        toast({
          title: "Message ajouté",
          description: "Le message promotionnel a été ajouté avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le message promotionnel",
          variant: "destructive",
        });
      }
    }
  };

  const deletePromoMessage = (id: string) => {
    setPromoToDelete(id);
  };

  const confirmDeletePromo = async () => {
    if (!promoToDelete) return;
    
    try {
      await deleteMessagePromo(promoToDelete);
      setPromoMessages(promoMessages.filter(msg => msg.id !== promoToDelete));
      toast({
        title: "Message supprimé",
        description: "Le message promotionnel a été supprimé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message promotionnel",
        variant: "destructive",
      });
    } finally {
      setPromoToDelete(null);
    }
  };

  const startEditingPromo = (message: MessagePromo) => {
    setEditingPromoId(message.id);
    setEditingPromoText(message.content);
  };

  const savePromoEdit = async () => {
    if (editingPromoText.trim() && editingPromoText.length <= 200) {
      try {
        const updatedMessage = await updateMessagePromo(editingPromoId!, {
          content: editingPromoText.trim()
        });
        setPromoMessages(promoMessages.map(msg => 
          msg.id === editingPromoId ? updatedMessage : msg
        ));
        setEditingPromoId(null);
        setEditingPromoText('');
        toast({
          title: "Message modifié",
          description: "Le message promotionnel a été mis à jour.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier le message promotionnel",
          variant: "destructive",
        });
      }
    }
  };

  const cancelPromoEdit = () => {
    setEditingPromoId(null);
    setEditingPromoText('');
  };

  const togglePromoActive = async (id: string) => {
    try {
      const message = promoMessages.find(msg => msg.id === id);
      if (message) {
        const newStatus = message.status === 'PUBLIC' ? 'DRAFT' : 'PUBLIC';
        const updatedMessage = await updateMessagePromoStatus(id, newStatus);
        setPromoMessages(promoMessages.map(msg => 
          msg.id === id ? updatedMessage : msg
        ));
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du message",
        variant: "destructive",
      });
    }
  };

  // Fonctions pour les vidéos YouTube
  const addVideo = async () => {
    if (newVideoTitle.trim() && newVideoUrl.trim()) {
      try {
        await createVideo({
          title: newVideoTitle.trim(),
          linkYT: newVideoUrl.trim()
        });
        // Recharger les vidéos depuis le serveur pour éviter les problèmes de synchronisation
        await loadVideos();
        setNewVideoTitle('');
        setNewVideoUrl('');
        toast({
          title: "Vidéo ajoutée",
          description: "La vidéo a été ajoutée avec succès.",
        });
      } catch (error) {
        console.error('Erreur lors de l\'ajout:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la vidéo",
          variant: "destructive",
        });
      }
    }
  };

  const deleteVideoHandler = (id: string) => {
    setVideoToDelete(id);
  };

  const confirmDeleteVideo = async () => {
    if (!videoToDelete) return;
    
    try {
      await deleteVideoAPI(videoToDelete);
      // Recharger les vidéos depuis le serveur pour éviter les problèmes de synchronisation
      await loadVideos();
      toast({
        title: "Vidéo supprimée",
        description: "La vidéo a été supprimée.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la vidéo",
        variant: "destructive",
      });
    } finally {
      setVideoToDelete(null);
    }
  };

  const publishVideoHandler = async (id: string) => {
    try {
      await publishVideo(id);
      await loadVideos();
      toast({
        title: "Statut de publication mis à jour",
        description: "Le statut de publication de la vidéo a été modifié.",
      });
    } catch (error) {
      console.error('Erreur lors de la publication de la vidéo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de publication",
        variant: "destructive",
      });
    }
  };

  const startEditingVideo = (video: Video) => {
    setEditingVideoId(video.id);
    setEditingVideoTitle(video.title);
    setEditingVideoUrl(video.linkYT);
  };

  const saveVideoEdit = async () => {
    if (editingVideoTitle.trim() && editingVideoUrl.trim()) {
      try {
        await updateVideo(editingVideoId!, {
          title: editingVideoTitle.trim(),
          linkYT: editingVideoUrl.trim()
        });
        // Recharger les vidéos depuis le serveur pour éviter les problèmes de synchronisation
        await loadVideos();
        setEditingVideoId(null);
        setEditingVideoTitle('');
        setEditingVideoUrl('');
        toast({
          title: "Vidéo modifiée",
          description: "La vidéo a été mise à jour.",
        });
      } catch (error) {
        console.error('Erreur lors de la modification:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier la vidéo",
          variant: "destructive",
        });
      }
    }
  };

  const cancelVideoEdit = () => {
    setEditingVideoId(null);
    setEditingVideoTitle('');
    setEditingVideoUrl('');
  };

  // Fonctions pour les images du diaporama
  const addSlideImage = async () => {
    if (newImageTitle.trim() && newImageUrl.trim()) {
      try {
        const newImage = await createDiapo({
          altText: newImageTitle.trim(),
          imageLink: newImageUrl.trim(),
          status: 'DRAFT'
        });
        setSlideImages([...slideImages, newImage]);
        setNewImageTitle('');
        setNewImageUrl('');
        toast({
          title: "Image ajoutée",
          description: "L'image a été ajoutée au diaporama.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'image",
          variant: "destructive",
        });
      }
    }
  };

  const deleteSlideImage = (id: string) => {
    setImageToDelete(id);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;
    
    try {
      await deleteDiapo(imageToDelete);
      setSlideImages(slideImages.filter(img => img.id !== imageToDelete));
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée du diaporama.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive",
      });
    } finally {
      setImageToDelete(null);
    }
  };

  const startEditingImage = (image: Diapo) => {
    setEditingImageId(image.id);
    setEditingImageTitle(image.altText);
    setEditingImageUrl(image.imageLink);
  };

  const saveImageEdit = async () => {
    if (editingImageTitle.trim() && editingImageUrl.trim()) {
      try {
        const updatedImage = await updateDiapo(editingImageId!, {
          altText: editingImageTitle.trim(),
          imageLink: editingImageUrl.trim()
        });
        setSlideImages(slideImages.map(img => 
          img.id === editingImageId ? updatedImage : img
        ));
        setEditingImageId(null);
        setEditingImageTitle('');
        setEditingImageUrl('');
        toast({
          title: "Image modifiée",
          description: "L'image a été mise à jour.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'image",
          variant: "destructive",
        });
      }
    }
  };

  const cancelImageEdit = () => {
    setEditingImageId(null);
    setEditingImageTitle('');
    setEditingImageUrl('');
  };

  const toggleImageStatus = async (id: string) => {
    try {
      const updatedImage = await updateDiapoStatus(id, '');
      setSlideImages(slideImages.map(img => 
        img.id === id ? updatedImage : img
      ));
      toast({
        title: "Statut modifié",
        description: "Le statut de l'image a été mis à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le statut de l'image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Hero Section</h1>
        <p className="text-muted-foreground">
          Gérez les éléments de la section hero de votre site
        </p>
      </div>

      <Tabs defaultValue="promo" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-0 h-auto sm:h-10">
          <TabsTrigger value="promo" className="text-xs sm:text-sm">Messages promotionnels</TabsTrigger>
          <TabsTrigger value="video" className="text-xs sm:text-sm">Vidéo YouTube</TabsTrigger>
          <TabsTrigger value="images" className="text-xs sm:text-sm">Images diaporama</TabsTrigger>
        </TabsList>

        {/* Messages promotionnels */}
        <TabsContent value="promo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Messages promotionnels
                <Badge variant="secondary">{promoMessages.length}/5</Badge>
              </CardTitle>
              <CardDescription>
                Gérez les messages affichés dans la topbar. Maximum 70 caractères par message.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulaire d'ajout */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Nouveau message promotionnel..."
                    value={newPromoContent}
                    onChange={(e) => setNewPromoContent(e.target.value)}
                    maxLength={70}
                    disabled={promoMessages.length >= 5}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {newPromoContent.length}/70 caractères
                  </div>
                </div>
                <Button 
                  onClick={addPromoMessage}
                  disabled={!newPromoContent.trim() || newPromoContent.length > 70 || promoMessages.length >= 5}
                  className="w-full sm:w-auto touch-target"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              {/* Liste des messages */}
              <div className="space-y-3">
                {promoMessages.map((message) => (
                  <div key={message.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      {editingPromoId === message.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editingPromoText}
                            onChange={(e) => setEditingPromoText(e.target.value)}
                            maxLength={70}
                          />
                          <div className="text-xs text-muted-foreground">
                            {editingPromoText.length}/70 caractères
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm break-words">{message.content}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <Badge variant={message.status === 'PUBLIC' ? "default" : "secondary"} className="w-fit">
                      {message.status === 'PUBLIC' ? "Public" : "Brouillon"}
                      </Badge>
                      
                      {editingPromoId === message.id ? (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={savePromoEdit} className="touch-target">
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelPromoEdit} className="touch-target">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePromoActive(message.id)}
                            className="touch-target text-xs"
                          >
                            {message.status === 'PUBLIC' ? "Mettre en brouillon" : "Publier"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingPromo(message)}
                            className="touch-target"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePromoMessage(message.id)}
                            className="touch-target"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vidéos YouTube */}
        <TabsContent value="video" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Vidéos YouTube
                <Badge variant="secondary">{videos.length}</Badge>
              </CardTitle>
              <CardDescription>
                Gérez les vidéos YouTube disponibles pour la présentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulaire d'ajout */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="video-title">Titre de la vidéo</Label>
                    <Input
                      id="video-title"
                      placeholder="Titre de la vidéo"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="video-url">URL YouTube</Label>
                    <Input
                      id="video-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  onClick={addVideo}
                  disabled={!newVideoTitle.trim() || !newVideoUrl.trim()}
                  className="w-full sm:w-auto touch-target"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la vidéo
                </Button>
              </div>

              {/* Liste des vidéos */}
              <div className="space-y-3">
                {loadingVideos ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Chargement des vidéos...</p>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune vidéo ajoutée</p>
                  </div>
                ) : (
                  videos.map((video) => (
                    <div key={video.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg">
                      {/* Miniature de la vidéo */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-18 bg-muted rounded overflow-hidden relative group">
                          <img
                            src={getYouTubeThumbnail(video.linkYT)}
                            alt={`Miniature de ${video.title}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=320&h=180&fit=crop';
                            }}
                          />
                          {/* Icône play overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {editingVideoId === video.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editingVideoTitle}
                              onChange={(e) => setEditingVideoTitle(e.target.value)}
                              placeholder="Titre de la vidéo"
                            />
                            <Input
                              value={editingVideoUrl}
                              onChange={(e) => setEditingVideoUrl(e.target.value)}
                              placeholder="URL YouTube"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-sm">{video.title}</p>
                            <p className="text-xs text-muted-foreground break-all">{video.linkYT}</p>
                            <div className="mt-1">
                              <Badge variant={video.status === 'PUBLIC' ? "default" : "secondary"} className="text-xs">
                                {video.status === 'PUBLIC' ? "Publié" : "Brouillon"}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {editingVideoId === video.id ? (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={saveVideoEdit} className="touch-target">
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelVideoEdit} className="touch-target">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          <Button
                            size="sm"
                            variant={video.status === 'PUBLIC' ? "default" : "outline"}
                            onClick={() => publishVideoHandler(video.id)}
                            className="touch-target"
                            title={video.status === 'PUBLIC' ? "Dépublier la vidéo" : "Publier la vidéo"}
                          >
                            {video.status === 'PUBLIC' ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingVideo(video)}
                            className="touch-target"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteVideoHandler(video.id)}
                            className="touch-target text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images diaporama */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Images du diaporama
                <Badge variant="secondary">
                  {slideImages.filter(img => img.status === 'PUBLIC').length}/5 publiques
                </Badge>
              </CardTitle>
              <CardDescription>
                Gérez les images affichées dans le diaporama de la hero section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulaire d'ajout */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="image-title">Texte alternatif</Label>
                    <Input
                      id="image-title"
                      placeholder="Description de l'image"
                      value={newImageTitle}
                      onChange={(e) => setNewImageTitle(e.target.value)}
                      disabled={slideImages.filter(img => img.status === 'PUBLIC').length >= 5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-url">URL de l'image</Label>
                    <Input
                      id="image-url"
                      placeholder="https://example.com/image.jpg"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      disabled={slideImages.filter(img => img.status === 'PUBLIC').length >= 5}
                    />
                  </div>
                </div>
                <Button 
                  onClick={addSlideImage}
                  disabled={!newImageTitle.trim() || !newImageUrl.trim() || slideImages.filter(img => img.status === 'PUBLIC').length >= 5}
                  className="w-full sm:w-auto touch-target"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter l'image
                </Button>
              </div>

              {/* Liste des images */}
              <div className="space-y-3">
                {loadingSlides ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Chargement des images...</p>
                  </div>
                ) : slideImages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune image ajoutée</p>
                  </div>
                ) : (
                  slideImages.map((image) => (
                    <div key={image.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-muted rounded overflow-hidden">
                          <img
                            src={image.imageLink}
                            alt={image.altText}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=80&h=80&fit=crop';
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {editingImageId === image.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editingImageTitle}
                              onChange={(e) => setEditingImageTitle(e.target.value)}
                              placeholder="Texte alternatif"
                            />
                            <Input
                              value={editingImageUrl}
                              onChange={(e) => setEditingImageUrl(e.target.value)}
                              placeholder="URL de l'image"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-sm">{image.altText}</p>
                            <p className="text-xs text-muted-foreground break-all">{image.imageLink}</p>
                            <div className="mt-1">
                              <Badge variant={image.status === 'PUBLIC' ? "default" : "secondary"} className="text-xs">
                                {image.status === 'PUBLIC' ? "Publié" : "Brouillon"}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {editingImageId === image.id ? (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={saveImageEdit} className="touch-target">
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelImageEdit} className="touch-target">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          <Button
                            size="sm"
                            variant={image.status === 'PUBLIC' ? "default" : "outline"}
                            onClick={() => toggleImageStatus(image.id)}
                            className="touch-target"
                            title={image.status === 'PUBLIC' ? "Dépublier l'image" : "Publier l'image"}
                          >
                            {image.status === 'PUBLIC' ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingImage(image)}
                            className="touch-target"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteSlideImage(image.id)}
                            className="touch-target text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation de suppression de message promotionnel */}
      <AlertDialog open={!!promoToDelete} onOpenChange={() => setPromoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce message promotionnel ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePromo} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation de suppression de vidéo */}
      <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette vidéo ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteVideo} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation de suppression d'image */}
      <AlertDialog open={!!imageToDelete} onOpenChange={() => setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette image du diaporama ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteImage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}