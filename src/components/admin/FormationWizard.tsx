/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import {
  X,
  Plus,
  Trash2,
  Upload,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { createFormationWithRelations, updateFormation, updateFormationWithRelations } from '@/lib/api/formations'
import { getCategories } from '@/lib/api/categories'
import { createModule, updateModule, deleteModule } from '@/lib/api/modules'
import { createTool, updateTool, deleteTool } from '@/lib/api/tools'
import { createStep, updateStep, deleteStep } from '@/lib/api/steps'
import { Formation, Category } from '@/lib/types'

interface FormationWizardProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (formation: Formation) => void
  formation?: Formation // Formation à éditer (optionnel)
}

interface Module {
  id: string
  title: string
  content: string
}

interface Tool {
  id: string
  title: string
}

interface Step {
  id: string
  title: string
}

const STEPS = [
  {
    id: 1,
    title: 'Informations générales',
    description: 'Titre, catégorie, prix...',
  },
  {
    id: 2,
    title: 'Programme & Matériels',
    description: 'Modules, outils, formateur...',
  },
  {
    id: 3,
    title: 'Étapes du processus',
    description: 'Déroulement de la formation...',
  },
]

export default function FormationWizard({
  isOpen,
  onClose,
  onSuccess,
  formation,
}: FormationWizardProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1: General Information
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [level, setLevel] = useState('')
  const [price, setPrice] = useState('')
  const [durationDays, setDurationDays] = useState('')
  const [max, setMax] = useState('')
  const [imageLink, setImageLink] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [isPromo, setIsPromo] = useState(false)
  const [reduction, setReduction] = useState('')
  const [isCertified, setIsCertified] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)

  // Step 2: Program & Materials
  const [modules, setModules] = useState<Module[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [trainerSpeciality, setTrainerSpeciality] = useState('')
  const [trainerExp, setTrainerExp] = useState('')
  const [trainerBio, setTrainerBio] = useState('')
  const [trainerPhotoUrl, setTrainerPhotoUrl] = useState('')
  const [trainerName, setTrainerName] = useState('')

  // Step 3: Process Steps
  const [stepTitle, setStepTitle] = useState('')
  const [steps, setSteps] = useState<Step[]>([])

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setSlug(generatedSlug)
    }
  }, [title, slug])

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories()
        const formationCategories = categoriesData.filter(cat => cat.type === 'FORMATION')
        setCategories(formationCategories)
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
        toast({
          title: 'Erreur',
          description: 'Erreur lors du chargement des catégories',
          variant: 'destructive',
        })
      }
    }
    loadCategories()
  }, [])

  // Reset form when formation prop changes
  useEffect(() => {
    if (formation) {
      // Edit mode - populate with formation data
      setTitle(formation.title || '')
      setSlug(formation.slug || '')
      setDescription(formation.description || '')
      setCategoryId(formation.category?.id || '')
      setLevel(formation.level || '')
      setPrice(formation.price?.toString() || '')
      setDurationDays(formation.durationDays?.toString() || '')
      setMax(formation.max?.toString() || '')
      setImageLink(formation.imageLink || '')
      setImageUrl(formation.imageUrl || '')
      setVideoUrl(formation.videoUrl || '')
      setIsPromo(formation.isPromo || false)
      setReduction(formation.reduction?.toString() || '')
      setIsCertified(formation.isCertified || false)
      setStartDate(formation.startDay ? new Date(formation.startDay) : undefined)
      
      // Handle modules - check both modules and program fields
      const modulesData = formation.modules || formation.program || []
      setModules(modulesData.map(m => ({ 
        id: m.id.toString(), 
        title: m.title, 
        content: m.content || m.description || '' 
      })))
      
      setTools(formation.tools?.map(t => ({ id: t.id.toString(), title: t.title })) || [])
      setTrainerSpeciality(formation.trainerSpeciality || '')
      setTrainerExp(formation.trainerExp || '')
      setTrainerBio(formation.trainerBio || '')
      setTrainerPhotoUrl(formation.trainerPhotoUrl || '')
      setTrainerName(formation.trainer || '')
      setStepTitle(formation.stepTitle || '')
      setSteps(formation.steps?.map(s => ({ id: s.id.toString(), title: s.title })) || [])
    } else {
      // Create mode - reset to empty values
      setTitle('')
      setSlug('')
      setDescription('')
      setCategoryId('')
      setLevel('')
      setPrice('')
      setDurationDays('')
      setMax('')
      setImageLink('')
      setImageUrl('')
      setVideoUrl('')
      setIsPromo(false)
      setReduction('')
      setIsCertified(false)
      setStartDate(undefined)
      setModules([])
      setTools([])
      setTrainerSpeciality('')
      setTrainerExp('')
      setTrainerBio('')
      setTrainerPhotoUrl('')
      setTrainerName('')
      setSteps([])
    }
  }, [formation])

  // Reset form when modal closes (only in create mode)
  useEffect(() => {
    if (!isOpen && !formation) {
      resetForm()
    }
  }, [isOpen, formation])

  const resetForm = () => {
    setCurrentStep(1)
    setTitle('')
    setSlug('')
    setDescription('')
    setCategoryId('')
    setLevel('')
    setPrice('')
    setDurationDays('')
    setMax('')
    setImageLink('')
    setImageUrl('')
    setVideoUrl('')
    setIsPromo(false)
    setReduction('')
    setIsCertified(false)
    setStartDate(undefined)
    setModules([])
    setTools([])
    setTrainerSpeciality('')
    setTrainerExp('')
    setTrainerBio('')
    setTrainerPhotoUrl('')
    setTrainerName('')
    setStepTitle('')
    setSteps([])
  }

  // Module management
  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: '',
      content: '',
    }
    setModules([...modules, newModule])
  }

  const updateModule = (id: string, field: keyof Module, value: string) => {
    setModules(
      modules.map((module) =>
        module.id === id ? { ...module, [field]: value } : module
      )
    )
  }

  const removeModule = (id: string) => {
    setModules(modules.filter((module) => module.id !== id))
  }

  // Tool management
  const addTool = () => {
    const newTool: Tool = {
      id: Date.now().toString(),
      title: '',
    }
    setTools([...tools, newTool])
  }

  const updateTool = (id: string, title: string) => {
    setTools(tools.map((tool) => (tool.id === id ? { ...tool, title } : tool)))
  }

  const removeTool = (id: string) => {
    setTools(tools.filter((tool) => tool.id !== id))
  }

  // Step management
  const addStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      title: '',
    }
    setSteps([...steps, newStep])
  }

  const updateStep = (id: string, title: string) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, title } : step)))
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  // Validation functions
  const validateStep1 = () => {
    if (!title.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le titre est obligatoire',
        variant: 'destructive',
      })
      return false
    }
    if (!categoryId) {
      toast({
        title: 'Erreur',
        description: 'La catégorie est obligatoire',
        variant: 'destructive',
      })
      return false
    }
    if (!level) {
      toast({
        title: 'Erreur',
        description: 'Le niveau est obligatoire',
        variant: 'destructive',
      })
      return false
    }
    if (!price || parseFloat(price) <= 0) {
      toast({
        title: 'Erreur',
        description: 'Le prix doit être un nombre positif',
        variant: 'destructive',
      })
      return false
    }
    if (!durationDays || parseInt(durationDays) <= 0) {
      toast({
        title: 'Erreur',
        description: 'La durée doit être un nombre positif',
        variant: 'destructive',
      })
      return false
    }
    if (!max || parseInt(max) <= 0) {
      toast({
        title: 'Erreur',
        description: 'Le nombre maximum de participants doit être positif',
        variant: 'destructive',
      })
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (modules.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Au moins un module est requis',
        variant: 'destructive',
      })
      return false
    }
    if (modules.some((m) => !m.title.trim() || !m.content.trim())) {
      toast({
        title: 'Erreur',
        description: 'Tous les modules doivent avoir un titre et un contenu',
        variant: 'destructive',
      })
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!stepTitle.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le titre du processus est obligatoire',
        variant: 'destructive',
      })
      return false
    }
    if (steps.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Au moins une étape est requise',
        variant: 'destructive',
      })
      return false
    }
    if (steps.some((s) => !s.title.trim())) {
      toast({
        title: 'Erreur',
        description: 'Toutes les étapes doivent avoir un titre',
        variant: 'destructive',
      })
      return false
    }
    return true
  }

  // Navigation
  const handleNext = () => {
    let isValid = false

    switch (currentStep) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        break
      default:
        isValid = true
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Submit formation
  const handleSubmit = async () => {
    if (!validateStep3()) return

    setIsSubmitting(true)

    try {
      const formationData: any = {}
      
      // En mode édition, n'inclure que les champs modifiés
      if (formation) {
        // Seulement inclure les champs qui ont des valeurs
        if (title) formationData.title = title
        if (title) formationData.SEO = title
        if (description) formationData.description = description
        if (categoryId) formationData.categoryId = categoryId
        if (level) formationData.level = level
        if (price) formationData.price = parseFloat(price.toString())
        if (durationDays) formationData.durationDays = parseInt(durationDays.toString())
        if (max) formationData.max = parseInt(max.toString())
        if (imageLink) formationData.imageLink = imageLink
        if (imageUrl) formationData.imageUrl = imageUrl
        if (videoUrl) formationData.videoUrl = videoUrl
        formationData.isPromo = isPromo
        if (isPromo && reduction) formationData.reduction = parseInt(reduction)
        formationData.isCertified = isCertified
        if (startDate) formationData.startDay = startDate
        if (trainerName) formationData.trainer = trainerName
        if (trainerSpeciality) formationData.trainerSpeciality = trainerSpeciality
        if (trainerExp) formationData.trainerExp = trainerExp
        if (trainerBio) formationData.trainerBio = trainerBio
        if (trainerPhotoUrl) formationData.trainerPhotoUrl = trainerPhotoUrl
        if (stepTitle) formationData.stepTitle = stepTitle
      } else {
        // Mode création - valeurs par défaut requises
        formationData.title = title || 'Formation sans titre'
        formationData.SEO = title || 'Formation sans titre'
        formationData.description = description || 'Description de la formation'
        formationData.categoryId = categoryId
        formationData.level = level || 'BEGINNER'
        formationData.price = price ? parseFloat(price.toString()) : 100
        formationData.durationDays = durationDays ? parseInt(durationDays.toString()) : 5
        formationData.max = max ? parseInt(max.toString()) : 20
        formationData.imageLink = imageLink || 'https://example.com/default-image.jpg'
        formationData.imageUrl = imageUrl || 'https://example.com/default-image.jpg'
        formationData.videoUrl = videoUrl || ''
        formationData.isPromo = isPromo || false
        formationData.reduction = isPromo && reduction ? parseInt(reduction) : 1
        formationData.isCertified = isCertified || false
        formationData.startDay = startDate ? startDate : new Date()
        formationData.trainer = trainerName || 'Formateur expert'
        formationData.trainerSpeciality = trainerSpeciality || 'Expert en formation'
        formationData.trainerExp = trainerExp || "5 ans d'expérience"
        formationData.trainerBio = trainerBio || 'Formateur expérimenté dans son domaine'
        formationData.trainerPhotoUrl = trainerPhotoUrl || 'https://example.com/default-trainer.jpg'
        formationData.stepTitle = stepTitle || 'Processus de formation'
        formationData.status = 'DRAFT'
        formationData.modules = modules.map(({ id, ...module }) => module)
        formationData.tools = tools.map(({ id, ...tool }) => tool)
        formationData.steps = steps.map(({ id, ...step }) => step)
      }

      let result
      if (formation) {
        // Mode édition - inclure modules, tools et steps dans formationData
        formationData.modules = modules.map(({ id, ...module }) => module)
        formationData.tools = tools.map(({ id, ...tool }) => tool)
        formationData.steps = steps.map(({ id, ...step }) => step)
        
        result = await updateFormationWithRelations(formation.id, formationData)
        
        toast({
          title: 'Formation mise à jour',
          description: 'La formation et toutes ses relations ont été mises à jour avec succès.',
        })
      } else {
        // Mode création
        result = await createFormationWithRelations(formationData)
        toast({
          title: 'Formation créée',
          description: 'La formation a été créée avec succès',
        })
      }

      onSuccess(result)
      onClose()
    } catch (error: any) {
      console.error('Erreur lors de la création de la formation:', error)
      
      let errorMessage = formation 
        ? 'Une erreur est survenue lors de la mise à jour de la formation'
        : 'Une erreur est survenue lors de la création de la formation'
      
      if (error?.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message.join(', ')
        } else {
          errorMessage = error.response.data.message
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast({
        title: 'Erreur de validation',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => (
    <div className='flex items-center justify-center space-x-4 mb-6'>
      {STEPS.map((step, index) => (
        <div key={step.id} className='flex items-center'>
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium',
              currentStep === step.id
                ? 'bg-primary text-primary-foreground border-primary'
                : currentStep > step.id
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-background text-muted-foreground border-muted-foreground'
            )}
          >
            {currentStep > step.id ? <Check className='w-4 h-4' /> : step.id}
          </div>
          <div className='ml-2 hidden sm:block'>
            <div
              className={cn(
                'text-sm font-medium',
                currentStep === step.id
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {step.title}
            </div>
            <div className='text-xs text-muted-foreground'>
              {step.description}
            </div>
          </div>
          {index < STEPS.length - 1 && (
            <ChevronRight className='w-4 h-4 text-muted-foreground mx-2' />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='title' className='text-sm font-medium'>
            Titre de la formation *
          </Label>
          <Input
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Ex: Formation React Avancée'
            className='mt-1'
          />
        </div>
        <div>
          <Label htmlFor='slug' className='text-sm font-medium'>
            Slug SEO *
          </Label>
          <Input
            id='slug'
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder='formation-react-avancee'
            className='mt-1 font-mono text-sm'
          />
          <p className='text-xs text-muted-foreground mt-1'>
            URL: /formations/{slug}
          </p>
        </div>
      </div>

      <div>
        <Label htmlFor='description' className='text-sm font-medium'>
          Description
        </Label>
        <Textarea
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Décrivez votre formation...'
          rows={4}
          className='mt-1'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <Label className='text-sm font-medium'>Catégorie *</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className='mt-1'>
              <SelectValue placeholder='Sélectionner' />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className='text-sm font-medium'>Niveau *</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className='mt-1'>
              <SelectValue placeholder='Sélectionner' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='BEGINNER'>Débutant</SelectItem>
              <SelectItem value='INTERMEDIATE'>Intermédiaire</SelectItem>
              <SelectItem value='ADVANCED'>Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='durationDays' className='text-sm font-medium'>
            Durée (jours)
          </Label>
          <Input
            id='durationDays'
            type='number'
            min='1'
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            placeholder='5'
            className='mt-1'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='max' className='text-sm font-medium'>
            Participants max
          </Label>
          <Input
            id='max'
            type='number'
            min='1'
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder='20'
            className='mt-1'
          />
        </div>
        <div>
          <Label htmlFor='price' className='text-sm font-medium'>
            Prix (TND)
          </Label>
          <Input
            id='price'
            type='number'
            min='0'
            step='0.01'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='299'
            className='mt-1'
          />
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Switch checked={isPromo} onCheckedChange={setIsPromo} />
          <Label className='text-sm font-medium'>Mode promotion</Label>
        </div>
        {isPromo && (
          <div className='w-full md:w-1/3'>
            <Label htmlFor='reduction' className='text-sm font-medium'>
              Réduction (%)
            </Label>
            <Input
              id='reduction'
              type='number'
              value={reduction}
              onChange={(e) => setReduction(e.target.value)}
              placeholder='20'
              max='99'
              className='mt-1'
            />
          </div>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        <Switch checked={isCertified} onCheckedChange={setIsCertified} />
        <Label className='text-sm font-medium'>Formation certifiante</Label>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='imageLink' className='text-sm font-medium'>
            Image de couverture (URL)
          </Label>
          <Input
            id='imageLink'
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            placeholder='https://example.com/image.jpg'
            className='mt-1'
          />
        </div>
        <div>
          <Label htmlFor='videoUrl' className='text-sm font-medium'>
            Vidéo de présentation (URL)
          </Label>
          <Input
            id='videoUrl'
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder='https://youtube.com/watch?v=...'
            className='mt-1'
          />
        </div>
      </div>

      <div>
        <Label className='text-sm font-medium'>Date de début</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-full justify-start text-left font-normal mt-1',
                !startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {startDate
                ? format(startDate, 'PPP', { locale: fr })
                : 'Sélectionner une date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className='space-y-6'>
       {/* Trainer Section */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du formateur</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='trainerName' className='text-sm font-medium'>
              Nom du formateur
            </Label>
            <Input
              id='trainerName'
              value={trainerName}
              onChange={(e) => setTrainerName(e.target.value)}
              placeholder='Ex: Jean Dupont'
              className='mt-1'
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label
                htmlFor='trainerSpeciality'
                className='text-sm font-medium'
              >
                Spécialité
              </Label>
              <Input
                id='trainerSpeciality'
                value={trainerSpeciality}
                onChange={(e) => setTrainerSpeciality(e.target.value)}
                placeholder='Ex: Développeur Full Stack'
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='trainerExp' className='text-sm font-medium'>
                Années d'expérience
              </Label>
              <Input
                id='trainerExp'
                type='number'
                min='0'
                value={trainerExp}
                onChange={(e) => setTrainerExp(e.target.value)}
                placeholder='5'
                className='mt-1'
              />
            </div>
          </div>
          <div>
            <Label htmlFor='trainerBio' className='text-sm font-medium'>
              Biographie
            </Label>
            <Textarea
              id='trainerBio'
              value={trainerBio}
              onChange={(e) => setTrainerBio(e.target.value)}
              placeholder='Biographie du formateur...'
              rows={3}
              className='mt-1'
            />
          </div>
          <div>
            <Label htmlFor='trainerPhotoUrl' className='text-sm font-medium'>
              Photo du formateur (URL)
            </Label>
            <Input
              id='trainerPhotoUrl'
              value={trainerPhotoUrl}
              onChange={(e) => setTrainerPhotoUrl(e.target.value)}
              placeholder='https://example.com/photo.jpg'
              className='mt-1'
            />
          </div>
        </CardContent>
      </Card>
      {/* Modules Section */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Modules du programme
            <Button onClick={addModule} size='sm'>
              <Plus className='w-4 h-4 mr-2' />
              Ajouter un module
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {modules.length === 0 ? (
            <p className='text-muted-foreground text-center py-4'>
              Aucun module ajouté. Cliquez sur "Ajouter un module" pour
              commencer.
            </p>
          ) : (
            modules.map((module) => (
              <div key={module.id} className='border rounded-lg p-4 space-y-3'>
                <div className='flex items-center justify-between'>
                  <Input
                    value={module.title}
                    onChange={(e) =>
                      updateModule(module.id, 'title', e.target.value)
                    }
                    placeholder='Titre du module'
                    className='flex-1 mr-2'
                  />
                  <Button
                    onClick={() => removeModule(module.id)}
                    variant='outline'
                    size='sm'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
                <Textarea
                  value={module.content}
                  onChange={(e) =>
                    updateModule(module.id, 'content', e.target.value)
                  }
                  placeholder='Contenu du module'
                  rows={3}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Tools Section */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Outils et matériels
            <Button onClick={addTool} size='sm'>
              <Plus className='w-4 h-4 mr-2' />
              Ajouter un outil
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {tools.length === 0 ? (
            <p className='text-muted-foreground text-center py-4'>
              Aucun outil ajouté. Cliquez sur "Ajouter un outil" pour commencer.
            </p>
          ) : (
            tools.map((tool) => (
              <div key={tool.id} className='flex items-center space-x-2'>
                <Input
                  value={tool.title}
                  onChange={(e) => updateTool(tool.id, e.target.value)}
                  placeholder="Nom de l'outil"
                  className='flex-1'
                />
                <Button
                  onClick={() => removeTool(tool.id)}
                  variant='outline'
                  size='sm'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

     
    </div>
  )

  const renderStep3 = () => (
    <div className='space-y-6'>
      <div>
        <Label htmlFor='stepTitle' className='text-sm font-medium'>
          Titre du processus *
        </Label>
        <Input
          id='stepTitle'
          value={stepTitle}
          onChange={(e) => setStepTitle(e.target.value)}
          placeholder='Ex: Comment se déroule la formation'
          className='mt-1'
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Étapes du processus
            <Button onClick={addStep} size='sm'>
              <Plus className='w-4 h-4 mr-2' />
              Ajouter une étape
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {steps.length === 0 ? (
            <p className='text-muted-foreground text-center py-4'>
              Aucune étape ajoutée. Cliquez sur "Ajouter une étape" pour
              commencer.
            </p>
          ) : (
            steps.map((step, index) => (
              <div key={step.id} className='flex items-center space-x-2'>
                <Badge
                  variant='outline'
                  className='min-w-[2rem] justify-center'
                >
                  {index + 1}
                </Badge>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep(step.id, e.target.value)}
                  placeholder="Titre de l'étape"
                  className='flex-1'
                />
                <Button
                  onClick={() => removeStep(step.id)}
                  variant='outline'
                  size='sm'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
          {formation ? 'Modifier la formation' : 'Créer une nouvelle formation'}
        </DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-hidden flex flex-col'>
          {renderStepIndicator()}

          <div className='flex-1 overflow-y-auto px-1'>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          <div className='border-t pt-4 mt-6 flex items-center justify-between'>
            <Button
              variant='outline'
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className='w-4 h-4 mr-2' />
              Précédent
            </Button>

            <div className='flex space-x-2'>
              <Button variant='outline' onClick={onClose}>
                Annuler
              </Button>

              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Suivant
                  <ChevronRight className='w-4 h-4 ml-2' />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className='bg-gradient-primary hover:opacity-90'
                >
                  {isSubmitting ? 'Création...' : 'Créer la formation'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
