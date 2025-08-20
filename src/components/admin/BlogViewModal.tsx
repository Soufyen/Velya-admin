import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Post } from '@/lib/types';

interface BlogViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onStatusChange: (postId: string, published: boolean) => void;
}

export default function BlogViewModal({ isOpen, onClose, post, onStatusChange }: BlogViewModalProps) {
  const [isPublished, setIsPublished] = useState(post?.status === 'PUBLIC' || false);

  if (!post) return null;

  const handleStatusToggle = (checked: boolean) => {
    setIsPublished(checked);
    onStatusChange(post.id, checked);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryBadgeVariant = (categoryTitle: string) => {
    switch (categoryTitle) {
      case 'Techniques': return 'default';
      case 'Hygiène': return 'secondary';
      case 'Tendances': return 'outline';
      case 'Conseils': return 'destructive';
      case 'Actualités': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">Détails de l'article</DialogTitle>
              <DialogDescription>
                Consultez et modifiez le statut de publication de l'article
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-muted-foreground">
                {isPublished ? 'Publié' : 'Archivé'}
              </span>
              <Switch
                checked={isPublished}
                onCheckedChange={handleStatusToggle}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image de couverture */}
          {post.imageLink && (
            <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
              <img 
                src={post.imageLink} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Informations principales */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Titre</label>
              <h2 className="text-lg font-semibold mt-1">{post.title}</h2>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Extrait</label>
              <p className="mt-1 text-sm">{post.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Auteur</label>
                <p className="mt-1">{post.author}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
                <div className="mt-1">
                  <Badge variant={getCategoryBadgeVariant(post.category?.title || '')}>
                    {post.category?.title || 'Sans catégorie'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date de création</label>
                <p className="mt-1 text-sm">{formatDate(post.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Dernière modification</label>
                <p className="mt-1 text-sm">{formatDate(post.updatedAt)}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Temps de lecture estimé</label>
              <p className="mt-1">{post.readDuration} minutes</p>
            </div>
          </div>

          {/* Contenu de l'article */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Contenu</label>
            <div className="mt-2 p-4 border rounded-lg bg-muted/50 max-h-60 overflow-y-auto">
              {post.content ? (
                <div className="prose prose-sm max-w-none">
                  {/* Ici on pourrait parser le JSON du contenu, mais pour simplifier on affiche l'extrait */}
                  <p>{post.summary}</p>
                  <p className="text-muted-foreground text-xs mt-2">
                    [Contenu complet de l'article - {post.content.length} caractères]
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">Aucun contenu disponible</p>
              )}
            </div>
          </div>

          {/* Statut de publication */}
          <div className="p-4 border rounded-lg bg-background">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Statut de publication</h3>
                <p className="text-sm text-muted-foreground">
                  {isPublished ? 'Cet article est actuellement publié' : 'Cet article est en brouillon'}
                </p>
              </div>
              <Badge variant={isPublished ? 'default' : 'secondary'}>
                {isPublished ? 'Publié' : 'Archivé'}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}