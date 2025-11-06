// Centralized localStorage key management for Capacitor compatibility
export const STORAGE_KEYS = {
  PREGNANCY_DATA: (userId: string) => `mamaalert_pregnancy_${userId}`,
  BABY_PROFILE: (userId: string) => `mamaalert_baby_${userId}`,
  EMERGENCY_CONTACTS: (userId: string) => `mamaalert_emergency_${userId}`,
  SYMPTOM_LOGS: (userId: string) => `mamaalert_symptoms_${userId}`,
  APPOINTMENTS: (userId: string) => `mamaalert_appointments_${userId}`,
  TRANSPORT_CONTACTS: (userId: string) => `mamaalert_transport_${userId}`,
  EMERGENCY_PLAN: (userId: string) => `mamaalert_emergency_plan_${userId}`,
  HOSPITAL_BAG: (userId: string) => `mamaalert_hospital_bag_${userId}`,
  THEME: 'mamaalert-theme',
  MODE: 'mamaalert-mode',
  ONBOARDING: 'mamaalert-onboarding-complete',
  NOTIFICATION_PERMISSION: 'mamaalert-notification-permission',
} as const;

export const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('localStorage getItem error:', error);
    return null;
  }
};

export const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error('localStorage setItem error:', error);
    return false;
  }
};

export const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('localStorage removeItem error:', error);
    return false;
  }
};
