import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db, auth } from '@/src/firebase';
import { 
  Trilha, 
  Modulo, 
  Aula, 
  Progress, 
  UserProfile, 
  PlatformSettings,
  Subscription,
  Payment
} from '@/src/types';

// ... (OperationType and FirestoreErrorInfo unchanged)

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const path = 'users';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const saveTrilha = async (trilha: Trilha): Promise<void> => {
  const path = `trilhas/${trilha.id}`;
  try {
    await setDoc(doc(db, 'trilhas', trilha.id), trilha);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteTrilha = async (trilhaId: string): Promise<void> => {
  const path = `trilhas/${trilhaId}`;
  try {
    await deleteDoc(doc(db, 'trilhas', trilhaId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const saveModulo = async (trilhaId: string, modulo: Modulo): Promise<void> => {
  const path = `trilhas/${trilhaId}/modulos/${modulo.id}`;
  try {
    await setDoc(doc(db, 'trilhas', trilhaId, 'modulos', modulo.id), modulo);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteModulo = async (trilhaId: string, moduloId: string): Promise<void> => {
  const path = `trilhas/${trilhaId}/modulos/${moduloId}`;
  try {
    await deleteDoc(doc(db, 'trilhas', trilhaId, 'modulos', moduloId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const saveAula = async (trilhaId: string, moduloId: string, aula: Aula): Promise<void> => {
  const path = `trilhas/${trilhaId}/modulos/${moduloId}/aulas/${aula.id}`;
  try {
    await setDoc(doc(db, 'trilhas', trilhaId, 'modulos', moduloId, 'aulas', aula.id), aula);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteAula = async (trilhaId: string, moduloId: string, aulaId: string): Promise<void> => {
  const path = `trilhas/${trilhaId}/modulos/${moduloId}/aulas/${aulaId}`;
  try {
    await deleteDoc(doc(db, 'trilhas', trilhaId, 'modulos', moduloId, 'aulas', aulaId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const getPlatformSettings = async (): Promise<PlatformSettings | null> => {
  const path = 'settings/platform';
  try {
    const snapshot = await getDoc(doc(db, path));
    return snapshot.exists() ? snapshot.data() as PlatformSettings : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const savePlatformSettings = async (settings: PlatformSettings): Promise<void> => {
  const path = 'settings/platform';
  try {
    await setDoc(doc(db, path), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const getTrilhas = async (): Promise<Trilha[]> => {
  const path = 'trilhas';
  try {
    const q = query(collection(db, path));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trilha));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getModulos = async (trilhaId: string): Promise<Modulo[]> => {
  const path = `trilhas/${trilhaId}/modulos`;
  try {
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Modulo));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getAulas = async (trilhaId: string, moduloId: string): Promise<Aula[]> => {
  const path = `trilhas/${trilhaId}/modulos/${moduloId}/aulas`;
  try {
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Aula));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, path);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  const path = `users/${profile.uid}`;
  try {
    const now = new Date().toISOString();
    await setDoc(doc(db, path), {
      ...profile,
      createdAt: profile.createdAt || now,
      updatedAt: now
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const updateSubscription = async (subscription: Subscription): Promise<void> => {
  const path = `subscriptions/${subscription.id}`;
  try {
    await setDoc(doc(db, 'subscriptions', subscription.id), subscription);
    
    // Also update user profile
    await updateDoc(doc(db, 'users', subscription.uid), {
      plan: subscription.plan,
      subscriptionPeriod: subscription.period,
      subscriptionStatus: subscription.status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getSubscription = async (uid: string): Promise<Subscription | null> => {
  const path = 'subscriptions';
  try {
    const q = query(collection(db, path), where('uid', '==', uid), orderBy('createdAt', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as Subscription;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const savePayment = async (payment: Payment): Promise<void> => {
  const path = `payments/${payment.id}`;
  try {
    await setDoc(doc(db, 'payments', payment.id), payment);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserPayments = async (uid: string): Promise<Payment[]> => {
  const path = 'payments';
  try {
    const q = query(collection(db, path), where('uid', '==', uid), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Payment);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const markLessonComplete = async (uid: string, trilhaId: string, aulaId: string, completed: boolean): Promise<void> => {
  const path = `users/${uid}/progress/${aulaId}`;
  try {
    const now = new Date().toISOString();
    await setDoc(doc(db, path), {
      id: aulaId,
      uid,
      trilhaId,
      aulaId,
      completed,
      completedAt: completed ? now : null,
      lastWatchedAt: now
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getProgress = (uid: string, callback: (progress: Progress[]) => void) => {
  const path = `users/${uid}/progress`;
  try {
    const q = query(collection(db, path));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => doc.data() as Progress));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};
