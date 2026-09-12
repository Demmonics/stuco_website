import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta?.env) ? import.meta.env : ((globalThis as any)?.process?.env || {});

const supabaseUrl = (env as any)?.VITE_SUPABASE_URL || 'https://placeholder-abhiyantriki.supabase.co';
const supabaseAnonKey = (env as any)?.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  (env as any)?.VITE_SUPABASE_URL && (env as any)?.VITE_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Local fallback state manager for offline/pre-credentials registration testing
export interface LocalRegistration {
  id: string;
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  rollNumber: string;
  registeredAt: string;
}

const STORAGE_KEY = 'abhi_local_registrations';

export const localRegistrationStore = {
  getAll(): LocalRegistration[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  save(reg: Omit<LocalRegistration, 'id' | 'registeredAt'>): LocalRegistration {
    const all = this.getAll();
    const newRecord: LocalRegistration = {
      ...reg,
      id: 'reg_' + Math.random().toString(36).substring(2, 9),
      registeredAt: new Date().toISOString()
    };
    all.push(newRecord);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('LocalStorage full or unavailable', e);
    }
    return newRecord;
  },
  getByEmail(email: string): LocalRegistration[] {
    return this.getAll().filter(r => r.email.toLowerCase() === email.toLowerCase());
  },
  isRegistered(eventId: string, email: string): boolean {
    return this.getAll().some(r => r.eventId === eventId && r.email.toLowerCase() === email.toLowerCase());
  }
};
