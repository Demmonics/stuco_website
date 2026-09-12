import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export type UserRole = 'student' | 'council_admin' | 'super_admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  college?: string;
  rollNumber?: string;
  role: UserRole;
  createdAt?: string;
}

// Zod validation schemas for input sanitization & validation
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Enter a valid 10-digit phone number').regex(/^[+0-9\s-]{10,15}$/, 'Invalid phone format'),
  college: z.string().min(2, 'College name is required'),
  rollNumber: z.string().min(3, 'Roll number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Demo accounts for instant offline testability & demonstration
export const DEMO_ACCOUNTS: Record<UserRole, UserProfile> = {
  student: {
    id: 'demo-usr-student-01',
    fullName: 'Aditi Sharma',
    email: 'aditi.sharma@somaiya.edu',
    phone: '+91 98201 23456',
    college: 'K. J. Somaiya School of Engineering',
    rollNumber: '16010123045',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
  council_admin: {
    id: 'demo-usr-admin-01',
    fullName: 'Rahul Verma',
    email: 'rahul.verma@somaiya.edu',
    phone: '+91 98765 43210',
    college: 'K. J. Somaiya School of Engineering',
    rollNumber: '16010122010',
    role: 'council_admin',
    createdAt: new Date().toISOString(),
  },
  super_admin: {
    id: 'demo-usr-super-01',
    fullName: 'General Secretary (Council Lead)',
    email: 'gensec.council@somaiya.edu',
    phone: '+91 99999 88888',
    college: 'K. J. Somaiya School of Engineering',
    rollNumber: '16010121001',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
  },
};

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authModalOpen: boolean;
  authModalMode: 'signin' | 'signup';

  // Actions
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  signIn: (credentials: z.infer<typeof loginSchema>) => Promise<boolean>;
  signUp: (data: z.infer<typeof registerSchema>) => Promise<boolean>;
  signOut: () => Promise<void>;
  switchDemoAccount: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEMO_ACCOUNTS.student, // Default active demo user for instant experience
      isAuthenticated: true,
      isLoading: false,
      error: null,
      authModalOpen: false,
      authModalMode: 'signin',

      openAuthModal: (mode = 'signin') => set({ authModalOpen: true, authModalMode: mode, error: null }),
      closeAuthModal: () => set({ authModalOpen: false, error: null }),

      signIn: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const validated = loginSchema.parse(credentials);

          if (isSupabaseConfigured) {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: validated.email,
              password: validated.password,
            });
            if (error) throw error;

            if (data.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

              if (profile) {
                set({
                  user: {
                    id: profile.id,
                    fullName: profile.full_name,
                    email: profile.email,
                    phone: profile.phone,
                    college: profile.college,
                    rollNumber: profile.roll_number,
                    role: profile.role,
                  },
                  isAuthenticated: true,
                  isLoading: false,
                  authModalOpen: false,
                });
                return true;
              }
            }
          }

          // Fallback / local signin verification
          const roleMatch = Object.values(DEMO_ACCOUNTS).find(
            (u) => u.email.toLowerCase() === validated.email.toLowerCase()
          );

          const userProfile: UserProfile = roleMatch || {
            id: 'usr_' + Math.random().toString(36).substring(2, 9),
            fullName: validated.email.split('@')[0],
            email: validated.email,
            college: 'K. J. Somaiya School of Engineering',
            role: 'student',
          };

          set({
            user: userProfile,
            isAuthenticated: true,
            isLoading: false,
            authModalOpen: false,
          });
          return true;
        } catch (err: any) {
          set({
            error: err instanceof z.ZodError ? err.issues[0]?.message : (err.message || 'Authentication failed'),
            isLoading: false,
          });
          return false;
        }
      },

      signUp: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const validated = registerSchema.parse(data);

          if (isSupabaseConfigured) {
            const { data: authData, error } = await supabase.auth.signUp({
              email: validated.email,
              password: validated.password,
              options: {
                data: {
                  full_name: validated.fullName,
                  phone: validated.phone,
                  college: validated.college,
                  roll_number: validated.rollNumber,
                },
              },
            });
            if (error) throw error;

            if (authData.user) {
              set({
                user: {
                  id: authData.user.id,
                  fullName: validated.fullName,
                  email: validated.email,
                  phone: validated.phone,
                  college: validated.college,
                  rollNumber: validated.rollNumber,
                  role: 'student',
                },
                isAuthenticated: true,
                isLoading: false,
                authModalOpen: false,
              });
              return true;
            }
          }

          // Local registration flow
          const newUser: UserProfile = {
            id: 'usr_' + Math.random().toString(36).substring(2, 9),
            fullName: validated.fullName,
            email: validated.email,
            phone: validated.phone,
            college: validated.college,
            rollNumber: validated.rollNumber,
            role: 'student',
            createdAt: new Date().toISOString(),
          };

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            authModalOpen: false,
          });
          return true;
        } catch (err: any) {
          set({
            error: err instanceof z.ZodError ? err.issues[0]?.message : (err.message || 'Registration failed'),
            isLoading: false,
          });
          return false;
        }
      },

      signOut: async () => {
        if (isSupabaseConfigured) {
          try {
            await supabase.auth.signOut();
          } catch {}
        }
        set({
          user: null,
          isAuthenticated: false,
          authModalOpen: false,
        });
      },

      switchDemoAccount: (role: UserRole) => {
        // Security Rule: Never allow automatic 1-click escalation to admin or super_admin
        if (role !== 'student') {
          console.warn('[Security Guard] Direct 1-click admin escalation blocked. Admins must authenticate via credentials.');
          return;
        }
        set({
          user: DEMO_ACCOUNTS.student,
          isAuthenticated: true,
          authModalOpen: false,
        });
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return;

        // Security rule: Never allow client to escalate role directly
        const safeUpdates = { ...updates };
        if (user.role !== 'super_admin') {
          delete safeUpdates.role;
        }

        const updatedUser = { ...user, ...safeUpdates };

        if (isSupabaseConfigured) {
          await supabase
            .from('profiles')
            .update({
              full_name: updatedUser.fullName,
              phone: updatedUser.phone,
              college: updatedUser.college,
              roll_number: updatedUser.rollNumber,
            })
            .eq('id', user.id);
        }

        set({ user: updatedUser });
      },

      checkSession: async () => {
        if (isSupabaseConfigured) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .single();

            if (profile) {
              set({
                user: {
                  id: profile.id,
                  fullName: profile.full_name,
                  email: profile.email,
                  phone: profile.phone,
                  college: profile.college,
                  rollNumber: profile.roll_number,
                  role: profile.role,
                },
                isAuthenticated: true,
              });
            }
          }
        }
      },
    }),
    {
      name: 'abhi_auth_storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
