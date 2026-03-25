import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { PlanType, SubscriptionPeriod } from '../types';

export interface CheckoutSession {
  plan?: PlanType;
  period?: SubscriptionPeriod;
  trilhaId?: string;
  amount: number;
}

/**
 * Simulates a payment gateway processing.
 * In a real app, this would call Stripe, Mercado Pago, etc.
 */
export const processPayment = async (session: CheckoutSession): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate 95% success rate
  return Math.random() < 0.95;
};

/**
 * Unlocks premium access after successful payment.
 */
export const unlockAccess = async (session: CheckoutSession): Promise<void> => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const userRef = doc(db, 'users', auth.currentUser.uid);
  
  if (session.plan) {
    await updateDoc(userRef, {
      plan: session.plan,
      subscriptionPeriod: session.period || 'monthly'
    });
  } else if (session.trilhaId) {
    await updateDoc(userRef, {
      purchasedCourses: arrayUnion(session.trilhaId)
    });
  }
};
