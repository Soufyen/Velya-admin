import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Formation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface FormationDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  formation: Formation;
  onDelete: (id: string) => void;
}

export default function FormationDeleteModal({ 
  isOpen, 
  onClose, 
  formation, 
  onDelete 
}: FormationDeleteModalProps) {
  const { toast } = useToast();

  if (!formation) return null;

  const handleDelete = () => {
    onDelete(formation.id);
    onClose();
    toast({
      title: "Formation supprimée",
      description: "La formation a été supprimée avec succès",
      variant: "destructive"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Supprimer la formation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-1">{formation.title}</h4>
            <p className="text-xs text-muted-foreground">
              {/* {formation.preregistrations.length} */}
               inscription(s) • {formation.price} TND
            </p>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="flex-1"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Oui, je veux supprimer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}