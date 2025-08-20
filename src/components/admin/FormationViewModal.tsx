import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Formation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { archiveFormation, publishFormation } from '@/lib/api';

interface FormationViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formation: Formation | null;
  onUpdateStatus: (id: string, published: boolean) => void;
}

export default function FormationViewModal({ 
  isOpen, 
  onClose, 
  formation, 
  onUpdateStatus 
}: FormationViewModalProps) {
  const { toast } = useToast();
  const [published, setPublished] = useState(formation?.published || false);

  if (!formation) return null;

const handleStatusChange = async (newStatus: boolean) => {
  setPublished(newStatus);
  try {
    if (newStatus) {
      await publishFormation(formation.id);
      
    } else {
      await archiveFormation(formation.id);
    
    }
    onUpdateStatus(formation.id, newStatus);
    toast({
      title: newStatus ? "Formation publiée" : "Formation archivée",
      description: newStatus 
        ? "La formation est maintenant visible par les utilisateurs"
        : "La formation a été archivée et n'est plus visible"
    });
  } catch (error) {
    setPublished(!newStatus); // revert UI
    toast({
      title: "Erreur",
      description: "Impossible de mettre à jour le statut de la formation.",
      variant: "destructive"
    });
  }
};

  const getLevelBadgeVariant = (level: Formation['level']) => {
    switch (level) {
      case 'BEGINNER': return 'secondary';
      case 'INTERMEDIATE': return 'default';
      case 'ADVANCED': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            Détails de la formation
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* En-tête avec informations principales */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary mb-3">{formation.title}</h2>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant={getLevelBadgeVariant(formation.level)}>
                  {formation.level}
                </Badge>
                {/* <span className="text-sm text-muted-foreground">
                {formation.duration} 
                  • {formation.preregistrations.length} inscriptions
                </span> */}
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-muted/50 rounded-lg px-4 py-2">
              <Label htmlFor="published-toggle" className="text-sm font-medium">
                {formation.status === 'PUBLIC' ?   'Archivé':'Publié'}
              </Label>
              <Switch
                id="published-toggle"
                checked={formation.status === 'PUBLIC' ? !published : published}
                onCheckedChange={() => handleStatusChange(!published)}
              />


            </div>
          </div>

          {/* Grille d'informations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations générales */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Prix</span>
                        <p className="text-xl font-semibold text-primary">{formation.price} TND</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Durée</span>
                        <p className="font-medium">{formation.durationDays} jour(s)</p>
                      </div>
                      {/* <div>
                        <span className="text-sm font-medium text-muted-foreground">Inscriptions</span>
                        <p className="font-medium">{formation.preregistrations.length} participant(s)</p>
                      </div> */}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Créée le</span>
                        <p className="font-medium">{new Date(formation.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Modifiée le</span>
                        <p className="font-medium">{new Date(formation.updatedAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      {formation.startDay && (
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Date de début</span>
                          <p className="font-medium">{format(new Date(formation.startDay), "PPP", { locale: fr })}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{formation.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t p-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}