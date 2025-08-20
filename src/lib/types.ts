export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  // Add other fields
}

export interface Category {
  id: string;
  title: string;
  type: string;
  // Add other fields
}

export interface Formation {
  id: string;
  title: string  // Support i18n
  SEO: string 
  price: number | string; // Backend sends number, frontend may format as string
  imageLink: string;
  durationDays: number;
  startDay: string; // ISO 8601 string
  max: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  imageUrl: string;
  videoUrl?: string;
  isPromo: boolean;
  reduction: number;
  isCertified: boolean;
  trainer: string;
  trainerSpeciality: string;
  trainerExp: string;
  trainerPhotoUrl: string;
  trainerBio :string;
  stepTitle?: string;
  status: 'DRAFT' | 'PUBLIC' | 'ARCHIVED';
  category: { id: string; title: string }; // Category relation
  modules?: {id: string; title: string ; content:string }[]; // Simplified
  program: { id: string; title: string ; description:string }[]; // Simplified
  tools: { id: string; title: string }[];
  steps: { id: string; title: string }[];
  description?: string;
  // Frontend-specific fields (map from backend or provide defaults)
  slug?: string;

  prerequisites?: string;
  testimonials?: Testimonial[];
  preregistrations?: PreRegistration[];
  highlights?: string[];
  updatedAt?: Date;
  createdAt?: Date;
  published: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  lastName: string;
  speciality: string;
  note: string;
  comment: string;
  imageProfileLink: string;
  datePub?: Date;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Module {
  id: string;
  title: string;
  content: string;
  // Add other fields
}

export interface Tool {
  id: string;
  title: string;
  // Add other fields
}

export interface Step {
  id: string;
  title: string;
  formationId: string;
  // Add other fields
}

export interface Post {
  id: string;
  title: string;
  content: string;
  summary: string; // Extrait de l'article (était 'excerpt')
  author: string;
  imageLink: string; // Image de couverture (était 'image')
  imageCaption?: string; // Légende de l'image
  readDuration: number; // Durée de lecture (était 'readTime')
  tags?: string[];
  status: 'DRAFT' | 'PUBLIC' | 'ARCHIVED'; // Statut (était 'published')
  categoryId: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  // Relations
  category?: { id: string; title: string };
}

export interface Video {
  id: string;
  title: string;
  linkYT: string;
  status?: 'DRAFT' | 'PUBLIC' | 'ARCHIVED';
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Diapo {
  id: string;
  altText: string;
  imageLink: string;
  status: string;
  user?: {
    id: string;
    email: string;
  };
}



export interface PreRegistration {
  createdAt: string;
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
  formationId: string;
  formationTitle:string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  formation?: Formation;
}

export interface MessagePromo {
  id: string;
  content: string;
  status: 'DRAFT' | 'PUBLIC' | 'ARCHIVED';
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}