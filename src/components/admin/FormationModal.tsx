import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getCategories } from '@/lib/api/categories';
import { Category } from '@/types';

interface FormationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formation: any) => void;
  formation?: any;
  mode?: 'create' | 'edit';
}

interface ProgramBlock {
  id: string;
  title: string;
  description: string;
}

interface Material {
  id: string;
  name: string;
}

interface ProcessStep {
  id: string;
  text: string;
}

export default function FormationModal({ isOpen, onClose, onSave, formation, mode = 'create' }: FormationModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Informations générales
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [formationCategories, setFormationCategories] = useState<Category[]>([]);
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [price, setPrice] = useState('');
  const [promoEnabled, setPromoEnabled] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isCertifying, setIsCertifying] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();

  // Détails de la formation
  const [programBlocks, setProgramBlocks] = useState<ProgramBlock[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [trainerImage, setTrainerImage] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [trainerSpecialty, setTrainerSpecialty] = useState('');
  const [trainerExperience, setTrainerExperience] = useState('');

  // Déroulement
  const [processTitle, setProcessTitle] = useState('');
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [videoLink, setVideoLink] = useState('');

  // Génération automatique du slug
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  }, [title, slug]);

  const addProgramBlock = () => {
    const newBlock: ProgramBlock = {
      id: Date.now().toString(),
      title: '',
      description: ''
    };
    setProgramBlocks([...programBlocks, newBlock]);
  };

  const updateProgramBlock = (id: string, field: string, value: string) => {
    setProgramBlocks(programBlocks.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  const removeProgramBlock = (id: string) => {
    setProgramBlocks(programBlocks.filter(block => block.id !== id));
  };

  const addMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      name: ''
    };
    setMaterials([...materials, newMaterial]);
  };

  const updateMaterial = (id: string, name: string) => {
    setMaterials(materials.map(material => 
      material.id === id ? { ...material, name } : material
    ));
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  const addProcessStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      text: ''
    };
    setProcessSteps([...processSteps, newStep]);
  };

  const updateProcessStep = (id: string, text: string) => {
    setProcessSteps(processSteps.map(step => 
      step.id === id ? { ...step, text } : step
    ));
  };

  const removeProcessStep = (id: string) => {
    setProcessSteps(processSteps.filter(step => step.id !== id));
  };

  // Charger les catégories de type FORMATION
  useEffect(() => {
    if (isOpen) {
      loadFormationCategories();
    }
  }, [isOpen]);

  const loadFormationCategories = async () => {
    try {
      const categories = await getCategories();
      const formationCats = categories.filter(cat => cat.type === 'FORMATION');
      setFormationCategories(formationCats);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (!title || !slug || !categoryId || !level) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const formation = {
      title,
      slug,
      categoryId,
      level,
      duration: parseInt(duration),
      maxParticipants: parseInt(maxParticipants),
      price: parseFloat(price),
      promoEnabled,
      promoDiscount: promoEnabled ? parseInt(promoDiscount) : 0,
      description,
      coverImage,
      isCertifying,
      startDate: startDate?.toISOString(),
      programBlocks,
      materials,
      trainer: {
        image: trainerImage,
        name: trainerName,
        specialty: trainerSpecialty,
        experience: parseInt(trainerExperience)
      },
      process: {
        title: processTitle,
        steps: processSteps,
        videoLink
      }
    };

    onSave(formation);
    resetForm();
    onClose();
    
    toast({
      title: "Formation créée",
      description: "La formation a été créée avec succès"
    });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setTitle('');
    setSlug('');
    setCategoryId('');
    setLevel('');
    setDuration('');
    setMaxParticipants('');
    setPrice('');
    setPromoEnabled(false);
    setPromoDiscount('');
    setDescription('');
    setCoverImage('');
    setIsCertifying(false);
    setStartDate(undefined);
    setProgramBlocks([]);
    setMaterials([]);
    setTrainerImage('');
    setTrainerName('');
    setTrainerSpecialty('');
    setTrainerExperience('');
    setProcessTitle('');
    setProcessSteps([]);
    setVideoLink('');
  };

  // Pré-remplir le formulaire en mode édition
  React.useEffect(() => {
    if (mode === 'edit' && formation && isOpen) {
      setTitle(formation.title || '');
      setSlug(formation.slug || '');
      setCategoryId(formation.categoryId || '');
      setLevel(formation.level || '');
      setDuration(formation.duration?.toString() || '');
      setMaxParticipants(formation.maxParticipants?.toString() || '');
      setPrice(formation.price?.toString() || '');
      setPromoEnabled(formation.promoEnabled || false);
      setPromoDiscount(formation.promoDiscount?.toString() || '');
      setDescription(formation.description || '');
      setCoverImage(formation.coverImage || '');
      setIsCertifying(formation.isCertifying || false);
      setStartDate(formation.startDate ? new Date(formation.startDate) : undefined);
      setProgramBlocks(formation.programBlocks || []);
      setMaterials(formation.materials || []);
      setTrainerImage(formation.trainer?.image || '');
      setTrainerName(formation.trainer?.name || '');
      setTrainerSpecialty(formation.trainer?.specialty || '');
      setTrainerExperience(formation.trainer?.experience?.toString() || '');
      setProcessTitle(formation.process?.title || '');
      setProcessSteps(formation.process?.steps || []);
      setVideoLink(formation.process?.videoLink || '');
    } else if (mode === 'create' && isOpen) {
      resetForm();
    }
  }, [mode, formation, isOpen]);

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">
            Titre de la formation *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Formation React Avancée"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="slug" className="text-sm font-medium">
            Slug SEO *
          </Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="formation-react-avancee"
            className="mt-1 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL: /formations/{slug}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm font-medium">Catégorie *</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {formationCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium">Niveau *</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Débutant">Débutant</SelectItem>
              <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
              <SelectItem value="Avancé">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration" className="text-sm font-medium">
            Durée (jours)
          </Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="5"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxParticipants" className="text-sm font-medium">
            Participants max
          </Label>
          <Input
            id="maxParticipants"
            type="number"
            min="1"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            placeholder="20"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="price" className="text-sm font-medium">
            Prix (TND)
          </Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="299"
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={promoEnabled}
            onCheckedChange={setPromoEnabled}
          />
          <Label className="text-sm font-medium">Mode promotion</Label>
        </div>
        {promoEnabled && (
          <div className="w-full md:w-1/3">
            <Label htmlFor="promoDiscount" className="text-sm font-medium">
              Réduction (%)
            </Label>
            <Input
              id="promoDiscount"
              type="number"
              value={promoDiscount}
              onChange={(e) => setPromoDiscount(e.target.value)}
              placeholder="20"
              max="99"
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre formation..."
          rows={4}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="coverImage" className="text-sm font-medium">
          Image de couverture (.webp)
        </Label>
        <Input
          id="coverImage"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/image.webp"
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Date de début</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-1",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "PPP", { locale: fr })
              ) : (
                <span>Sélectionner une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={isCertifying}
          onCheckedChange={setIsCertifying}
        />
        <Label className="text-sm font-medium">Formation certifiante</Label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Programme de formation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {programBlocks.map((block) => (
            <div key={block.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Input
                  value={block.title}
                  onChange={(e) => updateProgramBlock(block.id, 'title', e.target.value)}
                  placeholder="Titre du module"
                  className="font-medium"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProgramBlock(block.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={block.description}
                onChange={(e) => updateProgramBlock(block.id, 'description', e.target.value)}
                placeholder="Description du module"
                rows={2}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addProgramBlock}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un module
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Matériel inclus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {materials.map((material) => (
            <div key={material.id} className="flex items-center space-x-2">
              <Input
                value={material.name}
                onChange={(e) => updateMaterial(material.id, e.target.value)}
                placeholder="Ex: Manuel PDF, Accès plateforme..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMaterial(material.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addMaterial}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter du matériel
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Formateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="trainerImage" className="text-sm font-medium">
              Image de profil
            </Label>
            <Input
              id="trainerImage"
              value={trainerImage}
              onChange={(e) => setTrainerImage(e.target.value)}
              placeholder="https://example.com/profile.jpg"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trainerName" className="text-sm font-medium">
                Nom et prénom
              </Label>
              <Input
                id="trainerName"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="trainerSpecialty" className="text-sm font-medium">
                Spécialité
              </Label>
              <Input
                id="trainerSpecialty"
                value={trainerSpecialty}
                onChange={(e) => setTrainerSpecialty(e.target.value)}
                placeholder="Expert React/Node.js"
                className="mt-1"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <Label htmlFor="trainerExperience" className="text-sm font-medium">
              Années d'expérience
            </Label>
            <Input
              id="trainerExperience"
              type="number"
              min="1"
              value={trainerExperience}
              onChange={(e) => setTrainerExperience(e.target.value)}
              placeholder="10"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="processTitle" className="text-sm font-medium">
          Titre du déroulement
        </Label>
        <Input
          id="processTitle"
          value={processTitle}
          onChange={(e) => setProcessTitle(e.target.value)}
          placeholder="Comment se déroule la formation"
          className="mt-1"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Étapes du déroulement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {processSteps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-2">
              <Badge variant="secondary" className="shrink-0">
                {index + 1}
              </Badge>
              <Input
                value={step.text}
                onChange={(e) => updateProcessStep(step.id, e.target.value)}
                placeholder="Décrivez cette étape..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeProcessStep(step.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addProcessStep}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une étape
          </Button>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="videoLink" className="text-sm font-medium">
          Lien vidéo YouTube
        </Label>
        <Input
          id="videoLink"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="mt-1"
        />
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            {mode === 'edit' ? 'Modifier la formation' : 'Créer une nouvelle formation'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Indicateur d'étapes */}
          <div className="flex items-center justify-center space-x-2 py-4 border-b">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep === step
                      ? 'bg-primary text-primary-foreground'
                      : currentStep > step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      currentStep > step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Titres des étapes */}
          <div className="text-center py-3 border-b">
            <h3 className="font-medium">
              {currentStep === 1 && 'Informations générales'}
              {currentStep === 2 && 'Détails de la formation'}
              {currentStep === 3 && 'Déroulement'}
            </h3>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          {/* Actions */}
          <div className="border-t p-4 flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Précédent
                </Button>
              )}
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              {currentStep < 3 ? (
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  Suivant
                </Button>
              ) : mode === 'edit' ? (
                <Button 
                  onClick={() => {
                    const formationData = {
                      ...formation,
                      title,
                      slug,
                      category,
                      level,
                      duration: parseInt(duration),
                      maxParticipants: parseInt(maxParticipants),
                      price: parseFloat(price),
                      promoEnabled,
                      promoDiscount: promoEnabled ? parseInt(promoDiscount) : 0,
                      description,
                      coverImage,
                      isCertifying,
                      startDate: startDate?.toISOString(),
                      programBlocks,
                      materials,
                      trainer: {
                        image: trainerImage,
                        name: trainerName,
                        specialty: trainerSpecialty,
                        experience: parseInt(trainerExperience)
                      },
                      process: {
                        title: processTitle,
                        steps: processSteps,
                        videoLink
                      },
                      published: true,
                      updatedAt: new Date().toISOString()
                    };
                    onSave(formationData);
                    onClose();
                    toast({
                      title: "Formation publiée",
                      description: "La formation a été publiée avec succès"
                    });
                  }}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Modifier
                </Button>
              ) : (
                <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
                  Créer la formation
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}