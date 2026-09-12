import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FestEvent } from '../content/events';
import { FEST_EVENTS } from '../content/events';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'council_admin' | 'super_admin';
  department: string;
  lastActive: string;
}

export interface GalleryPhoto {
  id: string;
  albumId: string;
  url: string;
  caption: string;
  sortOrder: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface GalleryAlbum {
  id: string;
  year: number;
  title: string;
  description: string;
  coverImageUrl?: string;
  photos: GalleryPhoto[];
}

export interface RegistrationRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  rollNumber: string;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  ticketNumber: string;
  registeredAt: string;
}

interface CMSState {
  events: FestEvent[];
  albums: GalleryAlbum[];
  registrations: RegistrationRecord[];
  adminUsers: AdminUser[];

  // Event CMS actions
  addEvent: (event: Omit<FestEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<FestEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleEventRegistration: (id: string) => void;

  // Registrations & CSV actions
  addRegistration: (reg: Omit<RegistrationRecord, 'id' | 'ticketNumber' | 'registeredAt'>) => RegistrationRecord;
  cancelRegistration: (registrationId: string) => void;
  exportRegistrantsCSV: (eventId?: string) => string;

  // Gallery CMS actions
  addAlbum: (year: number, title: string, description: string) => void;
  addPhotoToAlbum: (albumId: string, photo: Omit<GalleryPhoto, 'id' | 'uploadedAt'>) => void;
  deletePhoto: (albumId: string, photoId: string) => void;

  // User Administration
  setUserRole: (userId: string, newRole: 'student' | 'council_admin' | 'super_admin') => void;
}

// Initial seed registrations
const INITIAL_REGISTRATIONS: RegistrationRecord[] = [
  {
    id: 'reg-001',
    eventId: 'robowars-flagship',
    eventTitle: 'RoboWars — Heavyweight Arena Combat',
    userId: 'demo-usr-student-01',
    fullName: 'Aditi Sharma',
    email: 'aditi.sharma@somaiya.edu',
    phone: '+91 98201 23456',
    college: 'K. J. Somaiya School of Engineering',
    rollNumber: '16010123045',
    status: 'confirmed',
    ticketNumber: 'ABHI-89A4B12C',
    registeredAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'reg-002',
    eventId: 'ideate-flagship',
    eventTitle: 'Ideate — National Prototype Challenge',
    userId: 'demo-usr-student-01',
    fullName: 'Aditi Sharma',
    email: 'aditi.sharma@somaiya.edu',
    phone: '+91 98201 23456',
    college: 'K. J. Somaiya School of Engineering',
    rollNumber: '16010123045',
    status: 'confirmed',
    ticketNumber: 'ABHI-56FE90D1',
    registeredAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'reg-003',
    eventId: 'robowars-flagship',
    eventTitle: 'RoboWars — Heavyweight Arena Combat',
    userId: 'demo-usr-student-02',
    fullName: 'Rohan Mehra',
    email: 'rohan.m@somaiya.edu',
    phone: '+91 98111 22334',
    college: 'VJTI Mumbai',
    rollNumber: '221080031',
    status: 'confirmed',
    ticketNumber: 'ABHI-44CC7109',
    registeredAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'reg-004',
    eventId: 'auto-expo-flagship',
    eventTitle: 'Auto Expo — Supercars & Track Prototypes',
    userId: 'demo-usr-student-03',
    fullName: 'Priya Iyer',
    email: 'priya.iyer@spit.ac.in',
    phone: '+91 99200 44556',
    college: 'Sardar Patel Institute of Technology',
    rollNumber: 'SPIT-2023-CS-40',
    status: 'confirmed',
    ticketNumber: 'ABHI-9011AE34',
    registeredAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

// Initial gallery albums
const INITIAL_ALBUMS: GalleryAlbum[] = [
  {
    id: 'album-2025',
    year: 2025,
    title: 'Abhiyantriki 2025 — Tech Vanguard',
    description: 'Highlights from the defense expo, ISRO satellite systems pavilion, and RoboWars final showdowns.',
    coverImageUrl: '/brand/kjsse.png',
    photos: [
      {
        id: 'photo-01',
        albumId: 'album-2025',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        caption: 'Combat robotics arena during semifinal clash',
        sortOrder: 1,
        uploadedBy: 'Rahul Verma',
        uploadedAt: '2025-10-15T14:30:00Z',
      },
      {
        id: 'photo-02',
        albumId: 'album-2025',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        caption: 'BARC Nuclear research reactor scale models display',
        sortOrder: 2,
        uploadedBy: 'Rahul Verma',
        uploadedAt: '2025-10-15T15:00:00Z',
      },
    ],
  },
  {
    id: 'album-2024',
    year: 2024,
    title: 'Abhiyantriki 2024 — Silver Horizon',
    description: 'Indian Army armored systems showcase and keynote hall sessions.',
    coverImageUrl: '/brand/kjsse.png',
    photos: [
      {
        id: 'photo-03',
        albumId: 'album-2024',
        url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
        caption: 'Auto Expo superbike and formula racing chassis exhibit',
        sortOrder: 1,
        uploadedBy: 'General Secretary',
        uploadedAt: '2024-10-10T12:00:00Z',
      },
    ],
  },
];

// Initial admin council users
const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'demo-usr-super-01',
    fullName: 'General Secretary (Council Lead)',
    email: 'gensec.council@somaiya.edu',
    role: 'super_admin',
    department: 'Students Council Core',
    lastActive: 'Just now',
  },
  {
    id: 'demo-usr-admin-01',
    fullName: 'Rahul Verma',
    email: 'rahul.verma@somaiya.edu',
    role: 'council_admin',
    department: 'Technical & Events Committee',
    lastActive: '12 mins ago',
  },
  {
    id: 'demo-usr-admin-02',
    fullName: 'Tanvi Joshi',
    email: 'tanvi.j@somaiya.edu',
    role: 'council_admin',
    department: 'Sponsorship & PR',
    lastActive: '2 hours ago',
  },
  {
    id: 'demo-usr-student-01',
    fullName: 'Aditi Sharma',
    email: 'aditi.sharma@somaiya.edu',
    role: 'student',
    department: 'Computer Engineering (Dept)',
    lastActive: '5 mins ago',
  },
];

/**
 * Sanitizes a field against CSV Formula Injection attacks.
 * If a cell starts with =, +, -, @, \t, or \r, spreadsheet software (Excel, Sheets)
 * may evaluate it as a formula or executable command. We prefix such cells with a single quote.
 */
export function sanitizeCSVField(val: string | number | undefined | null): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
  let clean = str.replace(/"/g, '""'); // Escape inner quotes
  if (dangerousPrefixes.some((p) => clean.startsWith(p))) {
    clean = "'" + clean;
  }
  return `"${clean}"`;
}

export const useCMSStore = create<CMSState>()(
  persist(
    (set, get) => ({
      events: FEST_EVENTS,
      albums: INITIAL_ALBUMS,
      registrations: INITIAL_REGISTRATIONS,
      adminUsers: INITIAL_ADMINS,

      addEvent: (newEventData) => {
        const newEvent: FestEvent = {
          ...newEventData,
          id: 'evt-' + Math.random().toString(36).substring(2, 8),
        };
        set((state) => ({ events: [newEvent, ...state.events] }));
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },

      toggleEventRegistration: (id) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, registration_open: !e.registration_open } : e
          ),
        }));
      },

      addRegistration: (reg) => {
        const ticketNumber = 'ABHI-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        const newReg: RegistrationRecord = {
          ...reg,
          id: 'reg-' + Math.random().toString(36).substring(2, 9),
          ticketNumber,
          registeredAt: new Date().toISOString(),
        };

        set((state) => ({
          registrations: [newReg, ...state.registrations],
        }));
        return newReg;
      },

      cancelRegistration: (registrationId) => {
        set((state) => ({
          registrations: state.registrations.map((r) =>
            r.id === registrationId ? { ...r, status: 'cancelled' } : r
          ),
        }));
      },

      exportRegistrantsCSV: (eventId) => {
        const { registrations } = get();
        const filtered = eventId
          ? registrations.filter((r) => r.eventId === eventId)
          : registrations;

        const headers = [
          'Ticket Number',
          'Event ID',
          'Event Title',
          'Attendee Name',
          'Email',
          'Phone',
          'College',
          'Roll Number',
          'Status',
          'Registered At',
        ];

        const rows = filtered.map((r) => [
          sanitizeCSVField(r.ticketNumber),
          sanitizeCSVField(r.eventId),
          sanitizeCSVField(r.eventTitle),
          sanitizeCSVField(r.fullName),
          sanitizeCSVField(r.email),
          sanitizeCSVField(r.phone),
          sanitizeCSVField(r.college),
          sanitizeCSVField(r.rollNumber),
          sanitizeCSVField(r.status),
          sanitizeCSVField(new Date(r.registeredAt).toLocaleString()),
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
        return csvContent;
      },

      addAlbum: (year, title, description) => {
        const newAlbum: GalleryAlbum = {
          id: 'album-' + Date.now(),
          year,
          title,
          description,
          photos: [],
        };
        set((state) => ({ albums: [newAlbum, ...state.albums] }));
      },

      addPhotoToAlbum: (albumId, photo) => {
        const newPhoto: GalleryPhoto = {
          ...photo,
          id: 'photo-' + Date.now(),
          uploadedAt: new Date().toISOString(),
        };
        set((state) => ({
          albums: state.albums.map((alb) =>
            alb.id === albumId ? { ...alb, photos: [...alb.photos, newPhoto] } : alb
          ),
        }));
      },

      deletePhoto: (albumId, photoId) => {
        set((state) => ({
          albums: state.albums.map((alb) =>
            alb.id === albumId
              ? { ...alb, photos: alb.photos.filter((p) => p.id !== photoId) }
              : alb
          ),
        }));
      },

      setUserRole: (userId, newRole) => {
        set((state) => ({
          adminUsers: state.adminUsers.map((u) =>
            u.id === userId ? { ...u, role: newRole } : u
          ),
        }));
      },
    }),
    {
      name: 'abhi_cms_storage',
    }
  )
);
