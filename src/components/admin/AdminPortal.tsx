import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCMSStore } from '../../store/useCMSStore';
import type { FestEvent } from '../../content/events';
import { soundFx } from '../../lib/audioManager';
import {
  Shield,
  Calendar,
  Image,
  Users,
  UserCheck,
  Plus,
  ExternalLink,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Upload,
  ArrowLeft,
  Search,
  Download,
  Lock,
} from 'lucide-react';

interface AdminPortalProps {
  onBackToFest: () => void;
}

type EventCategory = 'Defense & Space' | 'Robotics' | 'Expos' | 'Ideate' | 'Competitions & Coding';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToFest }) => {
  const { user } = useAuthStore();
  const {
    events,
    albums,
    registrations,
    adminUsers,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleEventRegistration,
    exportRegistrantsCSV,
    addAlbum,
    addPhotoToAlbum,
    deletePhoto,
    setUserRole,
  } = useCMSStore();

  const [activeTab, setActiveTab] = useState<'events' | 'gallery' | 'registrants' | 'users'>('events');

  // Event Modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<{
    title: string;
    category: EventCategory;
    subtitle: string;
    description: string;
    google_form_url: string;
    registration_open: boolean;
  }>({
    title: '',
    category: 'Robotics',
    subtitle: '',
    description: '',
    google_form_url: '',
    registration_open: true,
  });

  // Registrants state
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Gallery state
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(albums[0]?.id || '');
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumYear, setNewAlbumYear] = useState(2026);
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoCaption, setPhotoCaption] = useState('');

  // Security Gate: Ensure only council_admin or super_admin have access
  const isAuthorized = user?.role === 'council_admin' || user?.role === 'super_admin';

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4 pt-24">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
          <Lock className="w-12 h-12" />
        </div>
        <h2 className="font-display font-bold text-2xl text-white">Restricted Council Terminal</h2>
        <p className="text-slate-400 text-sm max-w-md">
          Access to the Abhiyantriki Admin CMS requires verified <span className="text-cyan-400 font-mono">council_admin</span> or <span className="text-signal-yellow font-mono">super_admin</span> credentials.
        </p>
        <button
          onClick={onBackToFest}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-space-950 font-display font-bold text-sm"
        >
          Return to Festival Site
        </button>
      </div>
    );
  }

  // Handle Event Create/Update
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    // Ensure Google Form embed URL has ?embedded=true appended per 09-ADMIN-CMS-GOOGLE-FORMS.md
    let cleanUrl = eventForm.google_form_url.trim();
    if (cleanUrl && cleanUrl.includes('docs.google.com/forms') && !cleanUrl.includes('embedded=true')) {
      cleanUrl += cleanUrl.includes('?') ? '&embedded=true' : '?embedded=true';
    }

    if (editingEventId) {
      updateEvent(editingEventId, {
        ...eventForm,
        google_form_url: cleanUrl || null,
      });
    } else {
      addEvent({
        ...eventForm,
        google_form_url: cleanUrl || null,
      });
    }

    soundFx.play('pill', 0.5);
    setIsEventModalOpen(false);
    setEditingEventId(null);
  };

  // Open Event Modal
  const handleOpenEventModal = (event?: FestEvent) => {
    if (event) {
      setEditingEventId(event.id);
      setEventForm({
        title: event.title,
        category: event.category,
        subtitle: event.subtitle || '',
        description: event.description,
        google_form_url: event.google_form_url || '',
        registration_open: event.registration_open,
      });
    } else {
      setEditingEventId(null);
      setEventForm({
        title: '',
        category: 'Robotics',
        subtitle: '',
        description: '',
        google_form_url: '',
        registration_open: true,
      });
    }
    setIsEventModalOpen(true);
  };

  // CSV Export Trigger
  const handleExportCSV = () => {
    soundFx.play('extraLives', 0.5);
    const eventIdParam = selectedEventFilter === 'all' ? undefined : selectedEventFilter;
    const csvData = exportRegistrantsCSV(eventIdParam);

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `abhiyantriki_registrations_${selectedEventFilter}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Gallery Photo Upload with client-side image compression & EXIF stripping via Canvas
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAlbumId) return;

    // MIME validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Security validation: Only JPEG, PNG, or WEBP image formats are accepted.');
      return;
    }

    // Size limit: 8MB
    if (file.size > 8 * 1024 * 1024) {
      alert('Security validation: Image size exceeds 8MB maximum threshold.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new window.Image();
      img.onload = () => {
        // Draw onto canvas to strip EXIF GPS metadata & recompress
        const canvas = document.createElement('canvas');
        const maxDimension = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          addPhotoToAlbum(selectedAlbumId, {
            albumId: selectedAlbumId,
            url: compressedDataUrl,
            caption: photoCaption || file.name.replace(/\.[^/.]+$/, ''),
            sortOrder: 1,
            uploadedBy: user?.fullName || 'Council Admin',
          });

          setPhotoCaption('');
          if (fileInputRef.current) fileInputRef.current.value = '';
          soundFx.play('pill', 0.5);
        }
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const currentAlbum = albums.find((a) => a.id === selectedAlbumId) || albums[0];

  // Filtered registrants
  const filteredRegistrations = registrations.filter((r) => {
    const matchesEvent = selectedEventFilter === 'all' || r.eventId === selectedEventFilter;
    const matchesSearch =
      searchQuery === '' ||
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 pt-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ocean-700/60 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.play('pill', 0.4);
              onBackToFest();
            }}
            className="p-2 rounded-xl glass-panel-interactive text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono">Back to Fest</span>
          </button>
          <div>
            <span className="text-xs font-mono text-signal-yellow uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              KJSSE STUDENTS COUNCIL // ADMIN CMS
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Festival Management Control Center
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-ocean-800/60 border border-cyan-400/30 text-cyan-300">
            Role: {user.role.toUpperCase()}
          </span>
          <span className="text-slate-400">({user.fullName})</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-ocean-700/60 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'events'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
              : 'glass-panel text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          01 // Events Manager ({events.length})
        </button>

        <button
          onClick={() => setActiveTab('registrants')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'registrants'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
              : 'glass-panel text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          02 // Registrants & CSV ({registrations.length})
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'gallery'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
              : 'glass-panel text-slate-400 hover:text-white'
          }`}
        >
          <Image className="w-4 h-4" />
          03 // Gallery CMS ({albums.length} Albums)
        </button>

        {user.role === 'super_admin' && (
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-bold'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            04 // Admin Roles ({adminUsers.length})
          </button>
        )}
      </div>

      {/* =========================================================================
          TAB 1: EVENTS MANAGER
      ========================================================================= */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl text-white">Events & Competitions</h2>
              <p className="text-xs text-slate-400 font-mono">
                Manage live registrations, toggle event statuses, or attach Google Form embeds.
              </p>
            </div>
            <button
              onClick={() => handleOpenEventModal()}
              className="px-4 py-2 rounded-xl bg-signal-yellow text-space-950 font-display font-semibold text-xs flex items-center gap-1.5 hover:brightness-110 shadow-[0_0_15px_rgba(238,230,56,0.3)]"
            >
              <Plus className="w-4 h-4" />
              Add New Event
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="glass-panel p-5 rounded-2xl border border-ocean-700/60 hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ocean-700/60 text-cyan-300 border border-cyan-400/20">
                      {evt.category}
                    </span>
                    <button
                      onClick={() => toggleEventRegistration(evt.id)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 font-bold ${
                        evt.registration_open
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {evt.registration_open ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> OPEN
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> CLOSED
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-base text-white">{evt.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">{evt.description}</p>
                </div>

                <div className="pt-3 border-t border-ocean-700/60 space-y-3">
                  <div className="text-[11px] font-mono">
                    <span className="text-slate-400">Mode: </span>
                    {evt.google_form_url ? (
                      <span className="text-cyan-300 font-semibold flex items-center gap-1 mt-0.5 truncate">
                        <ExternalLink className="w-3 h-3 shrink-0" /> Embedded Google Form
                      </span>
                    ) : (
                      <span className="text-signal-yellow font-semibold mt-0.5 block">
                        Native Fest Registration
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleOpenEventModal(evt)}
                      className="p-1.5 rounded-lg glass-panel-interactive text-slate-300 hover:text-white"
                      title="Edit Event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${evt.title}"?`)) {
                          deleteEvent(evt.id);
                        }
                      }}
                      className="p-1.5 rounded-lg glass-panel-interactive text-slate-400 hover:text-red-400"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: REGISTRANTS & CSV EXPORT
      ========================================================================= */}
      {activeTab === 'registrants' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl text-white">Attendee Registrations</h2>
              <p className="text-xs text-slate-400 font-mono">
                Real-time attendee list. Exports are sanitized against CSV Formula Injection.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-space-950 font-display font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Download className="w-4 h-4" />
              Export CSV ({filteredRegistrations.length})
            </button>
          </div>

          {/* Filters and Search Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-ocean-700/60 flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-space-900/80 px-3 py-2 border border-ocean-700 text-xs">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, roll number, or ticket..."
                className="w-full bg-transparent text-white focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 shrink-0">Filter Event:</span>
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-space-900 border border-ocean-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Events & Workshops</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Registrants Table */}
          <div className="glass-panel rounded-2xl border border-ocean-700/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-space-900/90 text-cyan-300 border-b border-ocean-700/60 uppercase">
                  <tr>
                    <th className="p-3.5">Ticket #</th>
                    <th className="p-3.5">Attendee Name</th>
                    <th className="p-3.5">Roll Number</th>
                    <th className="p-3.5">College</th>
                    <th className="p-3.5">Event Title</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ocean-800/40 text-slate-300">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No registrations found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((r) => (
                      <tr key={r.id} className="hover:bg-space-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-cyan-300">{r.ticketNumber}</td>
                        <td className="p-3.5 text-white font-sans font-medium">{r.fullName}</td>
                        <td className="p-3.5 text-slate-300">{r.rollNumber}</td>
                        <td className="p-3.5 text-slate-400 max-w-[150px] truncate">{r.college}</td>
                        <td className="p-3.5 text-white max-w-[200px] truncate">{r.eventTitle}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}
                          >
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400 text-[11px]">
                          {new Date(r.registeredAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: GALLERY CMS
      ========================================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl text-white">Past Editions Photo Gallery</h2>
              <p className="text-xs text-slate-400 font-mono">
                Uploads are compressed client-side and EXIF camera location data is stripped via HTML5 Canvas.
              </p>
            </div>

            <button
              onClick={() => setIsAlbumModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-signal-yellow text-space-950 font-display font-semibold text-xs flex items-center gap-1.5 hover:brightness-110"
            >
              <Plus className="w-4 h-4" />
              Create Album
            </button>
          </div>

          {/* Album Selector & Upload Bar */}
          <div className="glass-panel p-5 rounded-2xl border border-ocean-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400">Select Album:</span>
              <div className="flex flex-wrap gap-2">
                {albums.map((alb) => (
                  <button
                    key={alb.id}
                    onClick={() => setSelectedAlbumId(alb.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      currentAlbum?.id === alb.id
                        ? 'bg-cyan-500 text-space-950 font-bold'
                        : 'bg-space-900 border border-ocean-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {alb.year} — {alb.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload form */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="Photo caption..."
                className="px-3 py-1.5 rounded-lg bg-space-900 border border-ocean-700 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload-input"
              />
              <label
                htmlFor="photo-upload-input"
                className="px-4 py-1.5 rounded-lg bg-cyan-400 text-space-950 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:brightness-110"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Photo
              </label>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentAlbum?.photos.map((photo) => (
              <div
                key={photo.id}
                className="glass-panel rounded-xl overflow-hidden border border-ocean-700/60 group relative space-y-2"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3">
                  <p className="text-xs text-white font-medium truncate">{photo.caption}</p>
                  <p className="text-[10px] text-slate-400 font-mono">By: {photo.uploadedBy}</p>
                </div>
                <button
                  onClick={() => deletePhoto(currentAlbum.id, photo.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-space-950/80 text-red-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ADMIN ROLES & USERS (super_admin only)
      ========================================================================= */}
      {activeTab === 'users' && user.role === 'super_admin' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-white">Students Council Roles</h2>
            <p className="text-xs text-slate-400 font-mono">
              Role delegation for council committees. Protected server-side by Row Level Security.
            </p>
          </div>

          <div className="glass-panel rounded-2xl border border-ocean-700/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-space-900/90 text-cyan-300 border-b border-ocean-700/60 uppercase">
                  <tr>
                    <th className="p-3.5">Council Member</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Current Role</th>
                    <th className="p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ocean-800/40 text-slate-300">
                  {adminUsers.map((adm) => (
                    <tr key={adm.id} className="hover:bg-space-800/40 transition-colors">
                      <td className="p-3.5 text-white font-sans font-medium">{adm.fullName}</td>
                      <td className="p-3.5 text-slate-400">{adm.email}</td>
                      <td className="p-3.5 text-slate-300">{adm.department}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            adm.role === 'super_admin'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : adm.role === 'council_admin'
                              ? 'bg-signal-yellow/20 text-signal-yellow border border-signal-yellow/30'
                              : 'bg-slate-700/40 text-slate-300'
                          }`}
                        >
                          {adm.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {adm.role !== 'super_admin' && (
                          <button
                            onClick={() => {
                              const nextRole = adm.role === 'student' ? 'council_admin' : 'student';
                              setUserRole(adm.id, nextRole);
                              soundFx.play('eatghost', 0.4);
                            }}
                            className="px-2.5 py-1 rounded-lg glass-panel-interactive text-cyan-300 hover:text-white text-[11px]"
                          >
                            {adm.role === 'student' ? 'Promote to Admin' : 'Demote to Student'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Event Add/Edit Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-space-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-cyan-400/40 space-y-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-bold text-xl text-white">
              {editingEventId ? 'Edit Event' : 'Create New Event'}
            </h3>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-mono text-slate-300">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. RoboWars Heavyweight Clash"
                  className="w-full px-3.5 py-2 rounded-xl bg-space-900 border border-ocean-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-slate-300">Category *</label>
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as EventCategory })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-900 border border-ocean-700 text-white focus:outline-none"
                >
                  <option value="Defense & Space">Defense & Space</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Expos">Expos</option>
                  <option value="Ideate">Ideate</option>
                  <option value="Competitions & Coding">Competitions & Coding</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-slate-300">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={eventForm.subtitle}
                  onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })}
                  placeholder="e.g. 60kg Combat Bots Destruction"
                  className="w-full px-3.5 py-2 rounded-xl bg-space-900 border border-ocean-700 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-slate-300">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Detailed event rules and overview..."
                  className="w-full px-3.5 py-2 rounded-xl bg-space-900 border border-ocean-700 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-space-900/80 border border-ocean-700">
                <label className="block font-mono text-cyan-300 font-semibold">
                  Google Form Embed URL (Optional)
                </label>
                <p className="text-[11px] text-slate-400">
                  If you have an external Google Form, paste its URL here. The site will embed it directly with glassmorphic framing instead of native registration.
                </p>
                <input
                  type="url"
                  value={eventForm.google_form_url}
                  onChange={(e) => setEventForm({ ...eventForm, google_form_url: e.target.value })}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  className="w-full px-3.5 py-2 rounded-lg bg-space-950 border border-ocean-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reg_open_check"
                  checked={eventForm.registration_open}
                  onChange={(e) => setEventForm({ ...eventForm, registration_open: e.target.checked })}
                  className="rounded border-ocean-700 text-cyan-500"
                />
                <label htmlFor="reg_open_check" className="font-mono text-slate-200">
                  Accept Registrations (Registration Open)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-signal-yellow text-space-950 font-display font-bold text-xs hover:brightness-110"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Album Creation Modal */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 bg-space-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full rounded-2xl p-6 border border-cyan-400/40 space-y-4 text-xs">
            <h3 className="font-display font-bold text-lg text-white">Create Past Fest Album</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-mono text-slate-300 mb-1">Edition Year</label>
                <input
                  type="number"
                  value={newAlbumYear}
                  onChange={(e) => setNewAlbumYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-space-900 border border-ocean-700 text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-slate-300 mb-1">Album Title</label>
                <input
                  type="text"
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  placeholder="e.g. Abhiyantriki 2026 — Vanguard"
                  className="w-full px-3 py-2 rounded-xl bg-space-900 border border-ocean-700 text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  placeholder="Album summary..."
                  className="w-full px-3 py-2 rounded-xl bg-space-900 border border-ocean-700 text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAlbumModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newAlbumTitle.trim()) {
                    addAlbum(newAlbumYear, newAlbumTitle, newAlbumDesc);
                    setIsAlbumModalOpen(false);
                    setNewAlbumTitle('');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-signal-yellow text-space-950 font-display font-bold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
