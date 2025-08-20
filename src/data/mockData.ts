// Données mockées pour la démonstration de l'interface admin

export interface Formation {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Expert';
  category: 'Sourcils' | 'Lèvres' | 'Yeux' | 'Hygiène';
  published: boolean;
  createdAt: string;
  updatedAt: string;
  registrations: number;
  startDate?: string;
  image?: string;
}

// BlogPost interface removed - using Post from types.ts instead

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  published: boolean;
  createdAt: string;
  image?: string;
}

export interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  formationId: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
  message?: string;
}

export interface DashboardStats {
  totalFormations: number;
  publishedFormations: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalRegistrations: number;
  confirmedRegistrations: number;
  pendingRegistrations: number;
}

export interface ChartData {
  month: string;
  registrations: number;
  confirmations: number;
}

// Mock data
export const mockFormations: Formation[] = [
  {
    id: '1',
    title: 'Initiation au maquillage permanent des sourcils',
    description: 'Apprenez les techniques de base du maquillage permanent des sourcils, de la conception à la réalisation',
    price: 890,
    duration: '3 jours',
    level: 'Débutant',
    category: 'Sourcils',
    published: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    registrations: 28,
    startDate: '2024-03-15T09:00:00Z',
  },
  {
    id: '2',
    title: 'Perfectionnement en microblading',
    description: 'Perfectionnez votre technique de microblading avec des méthodes avancées',
    price: 1250,
    duration: '4 jours',
    level: 'Intermédiaire',
    category: 'Sourcils',
    published: true,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-05T16:20:00Z',
    registrations: 15,
    startDate: '2024-03-25T09:00:00Z',
  },
  {
    id: '3',
    title: 'Formation hygiène et salubrité',
    description: 'Formation obligatoire sur les normes d\'hygiène et de salubrité en institut de beauté',
    price: 180,
    duration: '1 jour',
    level: 'Débutant',
    category: 'Hygiène',
    published: true,
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-02-20T10:15:00Z',
    registrations: 42,
    startDate: '2024-04-10T10:00:00Z',
  },
  {
    id: '4',
    title: 'Techniques avancées en dermopigmentation des lèvres',
    description: 'Maîtrisez les techniques avancées de dermopigmentation pour sublimer les lèvres',
    price: 1100,
    duration: '3 jours',
    level: 'Expert',
    category: 'Lèvres',
    published: true,
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-02-22T11:30:00Z',
    registrations: 12,
    startDate: '2024-04-20T09:00:00Z',
  },
  {
    id: '5',
    title: 'Maquillage permanent des yeux - eye-liner',
    description: 'Formation complète au maquillage permanent de l\'eye-liner et techniques associées',
    price: 950,
    duration: '2 jours',
    level: 'Intermédiaire',
    category: 'Yeux',
    published: false,
    createdAt: '2024-02-25T10:30:00Z',
    updatedAt: '2024-02-28T15:20:00Z',
    registrations: 8,
    startDate: '2024-05-05T09:00:00Z',
  },
];

// Mock blog posts data - using Post interface from types.ts
export const mockBlogPosts = [
  {
    id: '1',
    title: 'Quelle technique de maquillage permanent choisir pour les sourcils ?',
    summary: 'Guide complet pour choisir entre microblading, powder brows et autres techniques selon votre type de peau.',
    content: 'Contenu complet de l\'article...',
    categoryId: '1',
    status: 'PUBLIC',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T10:30:00Z',
    author: 'Sarah Velya',
    readDuration: 8,
  },
  {
    id: '2',
    title: 'Les erreurs à éviter en pigmentation des lèvres',
    summary: 'Découvrez les 10 erreurs les plus courantes en dermopigmentation des lèvres et comment les éviter.',
    content: 'Contenu complet de l\'article...',
    categoryId: '2',
    status: 'PUBLIC',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-22T14:45:00Z',
    author: 'Julie Martin',
    readDuration: 6,
  },
  {
    id: '3',
    title: 'Hygiène en institut : les normes à respecter en 2025',
    summary: 'Mise à jour complète des protocoles d\'hygiène et de stérilisation pour les professionnels de la beauté.',
    content: 'Contenu complet de l\'article...',
    categoryId: '3',
    status: 'DRAFT',
    createdAt: '2024-02-01T07:30:00Z',
    updatedAt: '2024-02-03T11:20:00Z',
    author: 'Dr. Sophie Bernard',
    readDuration: 12,
  },
  {
    id: '4',
    title: 'Tendances beauté 2025 : ce que les clientes attendent vraiment',
    summary: 'Analyse des nouvelles tendances en maquillage permanent et attentes des clientes pour 2025.',
    content: 'Contenu complet de l\'article...',
    categoryId: '4',
    status: 'PUBLIC',
    createdAt: '2024-02-05T14:20:00Z',
    updatedAt: '2024-02-07T09:15:00Z',
    author: 'Emma Wilson',
    readDuration: 5,
  },
  {
    id: '5',
    title: 'Comment choisir ses pigments pour le maquillage permanent',
    summary: 'Guide pratique pour sélectionner les meilleurs pigments selon le type de peau et la carnation.',
    content: 'Contenu complet de l\'article...',
    categoryId: '1',
    status: 'PUBLIC',
    createdAt: '2024-02-10T16:45:00Z',
    updatedAt: '2024-02-12T11:30:00Z',
    author: 'Pierre Durand',
    readDuration: 7,
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Camille Dubois',
    role: 'Esthéticienne',
    company: 'Institut Belle Époque',
    content: 'Formation microblading exceptionnelle ! Sarah m\'a donné toutes les clés pour réussir. Mes clientes sont ravies du résultat.',
    rating: 5,
    published: true,
    createdAt: '2024-01-25T14:00:00Z',
  },
  {
    id: '2',
    name: 'Laura Martinez',
    role: 'Dermopigmentiste',
    company: 'Beauty Studio LM',
    content: 'La formation lèvres de Velya Academy a révolutionné ma pratique. Technique impeccable et suivi personnalisé.',
    rating: 5,
    published: true,
    createdAt: '2024-02-05T16:30:00Z',
  },
  {
    id: '3',
    name: 'Sophie Moreau',
    role: 'Reconversion professionnelle',
    content: 'Débutante complète, j\'ai été accompagnée avec patience. Formation hygiène très complète et rassurante.',
    rating: 4,
    published: false,
    createdAt: '2024-02-10T10:15:00Z',
  },
];

export const mockRegistrations: Registration[] = [
  {
    id: '1',
    firstName: 'Marine',
    lastName: 'Dubois',
    email: 'marine.dubois@example.com',
    phone: '+33123456789',
    formationId: '1',
    status: 'confirmed',
    createdAt: '2024-01-16T09:30:00Z',
    message: 'Esthéticienne depuis 5 ans, je souhaite me spécialiser dans le maquillage permanent des sourcils. Cette formation semble parfaite pour débuter.',
  },
  {
    id: '2',
    firstName: 'Jessica',
    lastName: 'Martin',
    email: 'jessica.martin@example.com',
    phone: '+33987654321',
    formationId: '2',
    status: 'pending',
    createdAt: '2024-02-02T14:20:00Z',
    message: 'J\'ai déjà suivi la formation initiation sourcils et souhaite me perfectionner en microblading. Quand aura lieu la prochaine session ?',
  },
  {
    id: '3',
    firstName: 'Amélie',
    lastName: 'Rousseau',
    email: 'amelie.rousseau@example.com',
    phone: '+33456789123',
    formationId: '3',
    status: 'confirmed',
    createdAt: '2024-01-18T11:45:00Z',
    message: 'Je dois valider ma formation hygiène avant d\'ouvrir mon institut. Merci de me confirmer les dates disponibles.',
  },
  {
    id: '4',
    firstName: 'Lucie',
    lastName: 'Moreau',
    email: 'lucie.moreau@example.com',
    formationId: '4',
    status: 'rejected',
    createdAt: '2024-02-10T16:30:00Z',
    message: 'Intéressée par la formation lèvres niveau expert, mais je n\'ai pas encore le niveau requis. Que me conseillez-vous ?',
  },
  {
    id: '5',
    firstName: 'Céline',
    lastName: 'Bernard',
    email: 'celine.bernard@example.com',
    phone: '+33321654987',
    formationId: '5',
    status: 'pending',
    createdAt: '2024-02-15T10:15:00Z',
    message: 'Dermopigmentiste avec 2 ans d\'expérience sourcils/lèvres, je souhaite étendre mes compétences aux yeux.',
  },
];

export const mockChartData: ChartData[] = [
  { month: 'Jan', registrations: 65, confirmations: 45 },
  { month: 'Fév', registrations: 78, confirmations: 56 },
  { month: 'Mar', registrations: 82, confirmations: 68 },
  { month: 'Avr', registrations: 94, confirmations: 72 },
  { month: 'Mai', registrations: 88, confirmations: 75 },
  { month: 'Jun', registrations: 92, confirmations: 80 },
];

export const getDashboardStats = (): DashboardStats => {
  const publishedFormations = mockFormations.filter(f => f.published).length;
  const publishedBlogPosts = mockBlogPosts.filter(b => b.status === 'PUBLIC').length;
  const confirmedRegistrations = mockRegistrations.filter(r => r.status === 'confirmed').length;
  const pendingRegistrations = mockRegistrations.filter(r => r.status === 'pending').length;

  return {
    totalFormations: mockFormations.length,
    publishedFormations,
    totalBlogPosts: mockBlogPosts.length,
    publishedBlogPosts,
    totalRegistrations: mockRegistrations.length,
    confirmedRegistrations,
    pendingRegistrations,
  };
};