import React from 'react';
import { Trash2 } from 'lucide-react';
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
import { Post } from '@/lib/types';

interface BlogDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onConfirm: (postId: string) => void;
}

export default function BlogDeleteModal({ isOpen, onClose, post, onConfirm }: BlogDeleteModalProps) {
  if (!post) return null;

  const handleConfirm = () => {
    onConfirm(post.id);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Supprimer l'article
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Êtes-vous sûr de vouloir supprimer définitivement l'article <strong>"{post.title}"</strong> ?
            </p>
            <p className="text-sm text-muted-foreground">
              Cette action est irréversible et l'article sera supprimé de façon permanente.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Oui, supprimer l'article
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}