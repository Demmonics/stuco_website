import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCMSStore } from '../../store/useCMSStore';
import { FEST_EVENTS } from '../../content/events';
import { localRegistrationStore, isSupabaseConfigured, supabase } from '../../lib/supabaseClient';
import { EmbeddedGoogleForm } from './EmbeddedGoogleForm';
import { soundFx } from '../../lib/audioManager';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, ShieldAlert, Ticket } from 'lucide-react';

interface RegistrationModalProps {
  onOpenDashboard?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ onOpenDashboard }) => {
  const { selectedEventForRegistration, closeRegistrationModal } = useUIStore();
  const { user } = useAuthStore();
  const { events, addRegistration } = useCMSStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('K. J. Somaiya School of Engineering');
  const [rollNumber, setRollNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill from authenticated student profile if available
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCollege(user.college || 'K. J. Somaiya School of Engineering');
      setRollNumber(user.rollNumber || '');
    }
  }, [user, selectedEventForRegistration]);

  if (!selectedEventForRegistration) return null;

  // Search in both CMS events and static content
  const event = events.find((e) => e.id === selectedEventForRegistration) ||
    FEST_EVENTS.find((e) => e.id === selectedEventForRegistration);

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    // Save to CMS store so it immediately updates Student Dashboard and Admin Registrants Table
    const newReg = addRegistration({
      eventId: event.id,
      eventTitle: event.title,
      userId: user?.id || 'usr-guest-' + Math.random().toString(36).substring(2, 7),
      fullName,
      email,
      phone,
      college,
      rollNumber,
      status: 'confirmed',
    });

    setConfirmedTicket(newReg.ticketNumber);

    // Save to local registry fallback
    localRegistrationStore.save({
      eventId: event.id,
      fullName,
      email,
      phone,
      college,
      rollNumber,
    });

    // If Supabase is configured, also persist to Postgres registrations table
    if (isSupabaseConfigured && user) {
      try {
        await supabase.from('registrations').insert({
          event_id: event.id,
          user_id: user.id,
          status: 'confirmed',
          ticket_number: newReg.ticketNumber,
        });
      } catch (e) {
        console.warn('Supabase remote sync warning:', e);
      }
    }

    setIsSuccess(true);
    soundFx.play('extraLives', 0.5);

    try {
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0DB8D3', '#1B7FDC', '#EEE638', '#16F686'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMsg('');
    closeRegistrationModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-space-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-xl w-full rounded-2xl p-6 sm:p-8 border border-white/15 relative max-h-[90vh] overflow-y-auto space-y-6 bg-neutral-950/90 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
              {event.category} // REGISTRATION
            </span>
            <h3 className="font-serif text-2xl text-white mt-1">
              {event.title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If event has a Google Form URL set, embed it */}
        {event.google_form_url ? (
          <EmbeddedGoogleForm formUrl={event.google_form_url} />
        ) : isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-zinc-200 mx-auto" />
            <div className="font-serif text-2xl text-white">
              Registration Confirmed
            </div>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Your registration pass for <span className="text-white font-medium">{event.title}</span> has been confirmed.
            </p>

            <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 max-w-sm mx-auto text-xs font-mono space-y-1">
              <div className="text-zinc-500">Pass Ticket Number:</div>
              <div className="text-base font-semibold text-white tracking-widest">
                {confirmedTicket}
              </div>
              <div className="text-zinc-500 text-[11px] pt-1">Attendee: {fullName}</div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              {onOpenDashboard && (
                <button
                  onClick={() => {
                    handleClose();
                    onOpenDashboard();
                  }}
                  className="px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs flex items-center gap-2 hover:bg-neutral-200 transition-all"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  View in My Passes
                </button>
              )}
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-full border border-white/15 text-zinc-300 font-mono text-xs hover:border-white hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-400">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aditi Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-zinc-400">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aditi@somaiya.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-zinc-400">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-zinc-400">
                  College / Institution
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. KJSSE / IIT Bombay"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-zinc-400">
                  Roll / Student ID (Optional)
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 16010123045"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-full border border-white/10 text-zinc-400 hover:text-white font-mono text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-medium hover:bg-neutral-200 transition-all active:scale-95"
              >
                Confirm Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
