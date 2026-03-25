import * as firestore from './firestoreService';
import { 
  Trilha, 
  Modulo, 
  Aula, 
  Progress, 
  UserProfile, 
  PlatformSettings,
  Subscription,
  Payment
} from '../types';

/**
 * Unified API interface for the platform.
 * This layer allows switching between different backends (Firebase, Supabase, etc.)
 * by changing the underlying implementation.
 */
export const api = {
  // Users & Profiles
  users: {
    getAll: firestore.getAllUsers,
    getProfile: firestore.getUserProfile,
    saveProfile: firestore.saveUserProfile,
  },

  // Learning Paths (Trilhas)
  trilhas: {
    getAll: firestore.getTrilhas,
    save: firestore.saveTrilha,
    delete: firestore.deleteTrilha,
  },

  // Modules
  modulos: {
    getByTrilha: firestore.getModulos,
    save: firestore.saveModulo,
    delete: firestore.deleteModulo,
  },

  // Lessons (Aulas)
  aulas: {
    getByModulo: firestore.getAulas,
    save: firestore.saveAula,
    delete: firestore.deleteAula,
  },

  // Progress Tracking
  progress: {
    markComplete: firestore.markLessonComplete,
    subscribe: firestore.getProgress,
  },

  // Subscriptions
  subscriptions: {
    get: firestore.getSubscription,
    update: firestore.updateSubscription,
  },

  // Payments
  payments: {
    save: firestore.savePayment,
    getByUser: firestore.getUserPayments,
  },

  // Settings
  settings: {
    get: firestore.getPlatformSettings,
    save: firestore.savePlatformSettings,
  }
};
