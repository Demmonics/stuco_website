import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import type { RegistrationRecord } from '../../store/useCMSStore';
import { useCMSStore } from '../../store/useCMSStore';
import { soundFx } from '../../lib/audioManager';
import {
  QrCode,
  Ticket,
  Calendar,
  Building,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Download,
  Trash2,
} from 'lucide-react';

interface StudentDashboardProps {
  onBackToFest: () => void;
  onBrowseEvents: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onBackToFest,
  onBrowseEvents,
}) => {
  const { user, signOut } = useAuthStore();
  const { registrations, cancelRegistration } = useCMSStore();
  const [activeTicket, setActiveTicket] = useState<RegistrationRecord | null>(null);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-signal-yellow" />
        <h2 className="font-display font-bold text-2xl text-white">Authentication Required</h2>
        <p className="text-slate-400 text-sm max-w-md">
          Please sign in to access your registered events and festival digital passes.
        </p>
        <button
          onClick={onBackToFest}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-space-950 font-display font-bold text-sm"
        >
          Return to Fest Home
        </button>
      </div>
    );
  }

  // Get user's own registrations
  const userRegistrations = registrations.filter(
    (r) => r.userId === user.id || r.email.toLowerCase() === user.email.toLowerCase()
  );

  const handleCancel = (regId: string) => {
    cancelRegistration(regId);
    setCancelModalId(null);
    soundFx.play('die', 0.4);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 pt-24">
      {/* Top action bar */}
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
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              STUDENT ADMISSION TERMINAL
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              My Festival Pass & Registrations
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.play('pill', 0.4);
              onBrowseEvents();
            }}
            className="px-4 py-2 rounded-xl bg-signal-yellow text-space-950 font-display font-semibold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(238,230,56,0.3)]"
          >
            + Register More Events
          </button>
          <button
            onClick={() => signOut()}
            className="px-3.5 py-2 rounded-xl glass-panel-interactive text-slate-400 hover:text-red-400 text-xs font-mono"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Student Profile & Digital Pass Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column: Student Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-400/40 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-display font-black text-2xl shadow-[0_0_20px_rgba(13,184,211,0.5)]">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">{user.fullName}</h3>
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="uppercase">{user.role} Verified</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-ocean-700/60 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> Roll Number:
                </span>
                <span className="font-semibold text-white">{user.rollNumber || '16010123045'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-cyan-400" /> College:
                </span>
                <span className="font-semibold text-white truncate max-w-[170px] text-right">
                  {user.college || 'KJSSE'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Email:</span>
                <span className="font-semibold text-slate-200 truncate max-w-[170px]">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Active Passes:</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  {userRegistrations.filter((r) => r.status === 'confirmed').length}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-space-900/80 border border-ocean-700 text-[11px] text-slate-400 font-mono space-y-1">
                <p className="text-cyan-300 font-semibold">Campus Gate Entry Notice:</p>
                <p>
                  Present this digital QR badge at the Somaiya Vidyavihar campus entry gates and event arena check-in counters.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 columns: Digital Festival Pass & Event Registrations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cyberpunk Holographic Digital Badge */}
          <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-space-900 via-space-950 to-ocean-950 border border-cyan-400/60 shadow-[0_0_35px_rgba(13,184,211,0.2)] overflow-hidden">
            {/* Background grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0DB8D310_1px,transparent_1px),linear-gradient(to_bottom,#0DB8D310_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-signal-green animate-ping" />
                  OFFICIAL ALL-ACCESS FESTIVAL TICKET
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
                  ABHIYANTRIKI 2026
                </h2>
                <p className="text-slate-300 text-xs font-mono">
                  Somaiya Vidyavihar University • Mumbai, India
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="px-2.5 py-1 rounded bg-ocean-800/80 text-[11px] font-mono text-cyan-300 border border-cyan-400/20">
                    ID: {userRegistrations[0]?.ticketNumber || 'ABHI-ENTRY-2026'}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-[11px] font-mono text-emerald-300 border border-emerald-500/30">
                    STATUS: ACTIVE
                  </span>
                </div>
              </div>

              {/* Dynamic QR Badge */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white text-space-950 shadow-2xl space-y-2 shrink-0 border-2 border-cyan-400">
                <QrCode className="w-28 h-28 text-space-950" />
                <span className="font-mono text-[9px] font-bold tracking-widest text-slate-700">
                  SCAN TO VERIFY
                </span>
              </div>
            </div>

            {/* Bottom barcode simulation */}
            <div className="relative z-10 mt-6 pt-4 border-t border-ocean-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-signal-yellow" />
                <span>Holder: {user.fullName}</span>
              </div>
              <div className="tracking-[0.25em] font-mono text-[10px] text-cyan-300">
                ||||| | |||| ||| || |||||| | ||||| |||| || |
              </div>
            </div>
          </div>

          {/* List of Registered Events */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Registered Events & Workshops ({userRegistrations.length})
            </h3>

            {userRegistrations.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center space-y-4 border border-ocean-700/60">
                <p className="text-slate-400 text-sm">
                  You haven't registered for any events yet. Explore RoboWars, Ideate, and Auto Expo!
                </p>
                <button
                  onClick={onBrowseEvents}
                  className="px-6 py-2.5 rounded-xl bg-signal-yellow text-space-950 font-display font-bold text-xs"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="glass-panel p-5 rounded-2xl border border-ocean-700/60 hover:border-cyan-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-ocean-700/60 text-cyan-300 border border-cyan-400/20">
                          {reg.ticketNumber}
                        </span>
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                            reg.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {reg.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-base text-white">
                        {reg.eventTitle}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Registered on: {new Date(reg.registeredAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          soundFx.play('pill', 0.4);
                          setActiveTicket(reg);
                        }}
                        className="px-3.5 py-1.5 rounded-lg glass-panel-interactive text-cyan-300 hover:text-white text-xs font-mono flex items-center gap-1"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        Pass Details
                      </button>

                      {reg.status === 'confirmed' && (
                        <button
                          onClick={() => setCancelModalId(reg.id)}
                          className="p-2 rounded-lg glass-panel-interactive text-slate-400 hover:text-red-400 transition-colors"
                          title="Cancel Registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-space-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full rounded-2xl p-6 border border-red-500/40 space-y-4">
            <h4 className="font-display font-bold text-lg text-white">Confirm Cancellation</h4>
            <p className="text-xs text-slate-300">
              Are you sure you want to cancel this registration? Your reserved seat will be released to waitlisted students.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelModalId(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Keep Pass
              </button>
              <button
                onClick={() => handleCancel(cancelModalId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-display font-bold text-xs hover:bg-red-500"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 bg-space-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-cyan-400/50 space-y-5">
            <div className="flex items-center justify-between border-b border-ocean-700/60 pb-3">
              <span className="font-mono text-xs text-cyan-400 font-bold">DIGITAL PASS VERIFICATION</span>
              <button
                onClick={() => setActiveTicket(null)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-display font-bold text-xl text-white">{activeTicket.eventTitle}</h3>
              <div className="p-4 rounded-xl bg-space-900/90 border border-ocean-700 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pass Serial:</span>
                  <span className="text-cyan-300 font-bold">{activeTicket.ticketNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Attendee:</span>
                  <span className="text-white">{activeTicket.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">College:</span>
                  <span className="text-white truncate max-w-[200px]">{activeTicket.college}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Roll No:</span>
                  <span className="text-white">{activeTicket.rollNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center p-4 bg-white rounded-xl">
              <QrCode className="w-32 h-32 text-space-950" />
            </div>

            <button
              onClick={() => {
                soundFx.play('extraLives', 0.4);
                window.print();
              }}
              className="w-full py-2.5 rounded-xl bg-signal-yellow text-space-950 font-display font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110"
            >
              <Download className="w-4 h-4" />
              Print / Save Ticket Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
