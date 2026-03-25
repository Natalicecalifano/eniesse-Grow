export type UserRole = 'student' | 'producer' | 'specialist' | 'admin';
export type PlanType = 'free' | 'grow' | 'grow_pro';
export type SubscriptionPeriod = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete';
export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  specialties?: string[];
  plan?: PlanType;
  subscriptionPeriod?: SubscriptionPeriod;
  subscriptionStatus?: SubscriptionStatus;
  stripeCustomerId?: string;
  purchasedCourses?: string[]; // IDs of trilhas purchased individually
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  uid: string;
  plan: PlanType;
  period: SubscriptionPeriod;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  uid: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: 'subscription' | 'course_purchase';
  courseId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
}

export interface Trilha {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  isPremium?: boolean;
  price?: number; // For one-time purchase
  order: number;
  published: boolean;
  instructorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Modulo {
  id: string;
  trilhaId: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
}

export interface Aula {
  id: string;
  trilhaId: string;
  moduloId: string;
  title: string;
  slug: string;
  content?: string;
  videoUrl?: string;
  duration?: number; // in minutes
  order: number;
  checklist?: string[];
  isPremium?: boolean;
  isFreePreview?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  uid: string;
  trilhaId: string;
  aulaId: string;
  completed: boolean;
  completedAt?: string;
  lastWatchedAt?: string;
  watchTime?: number; // in seconds
}

export interface PlatformSettings {
  name: string;
  logo?: string;
  primaryColor: string;
  accentColor: string;
  pricing: {
    grow: { monthly: number; annual: number };
    growPro: { monthly: number; annual: number };
  };
}
