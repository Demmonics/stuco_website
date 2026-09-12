import React, { useState } from 'react';
import type { UserRole } from '../../store/useAuthStore';
import { useAuthStore } from '../../store/useAuthStore';
import { soundFx } from '../../lib/audioManager';
import { X, Lock, Mail, User, Phone, School, Hash, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    signIn,
    signUp,
    switchDemoAccount,
    isLoading,
    error,
  } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('K. J. Somaiya School of Engineering');
  const [rollNumber, setRollNumber] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalMode === 'signin') {
      const ok = await signIn({ email, password });
      if (ok) {
        soundFx.play('pill', 0.5);
      }
    } else {
      const ok = await signUp({
        fullName,
        email,
        phone,
        college,
        rollNumber,
        password,
      });
      if (ok) {
        soundFx.play('extraLives', 0.5);
      }
    }
  };

  const handleDemoSwitch = (role: UserRole) => {
    switchDemoAccount(role);
    soundFx.play('eatghost', 0.4);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08090a]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full rounded-2xl p-6 sm:p-8 border border-white/15 relative max-h-[90vh] overflow-y-auto space-y-6 bg-neutral-950/90 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
              PORTAL ACCESS // KJSSE
            </span>
            <h3 className="font-serif text-2xl text-white mt-1">
              {authModalMode === 'signin' ? 'Sign In' : 'Create Account'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex border-b border-white/[0.08] pb-1 gap-6 font-mono text-xs">
          <button
            onClick={() => openAuthModal('signin')}
            className={`pb-2 border-b-2 transition-all tracking-wider ${
              authModalMode === 'signin'
                ? 'border-white text-white font-medium'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            01 // SIGN IN
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className={`pb-2 border-b-2 transition-all tracking-wider ${
              authModalMode === 'signup'
                ? 'border-white text-white font-medium'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            02 // REGISTER STUDENT
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authModalMode === 'signup' && (
            <>
              <div className="space-y-1.5">
                <label className="block font-mono text-zinc-400">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aditi Sharma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/40 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-mono text-zinc-400">Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98201 23456"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/40 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-zinc-400">Student ID *</label>
                  <div className="relative">
                    <Hash className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="16010123045"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/40 font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-zinc-400">College / Institution</label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/40 font-sans"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="block font-mono text-zinc-400">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@somaiya.edu"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/40 font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono text-zinc-400">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/40 font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 rounded-full bg-white text-black font-mono text-xs font-medium hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : authModalMode === 'signin' ? 'Sign In to Portal' : 'Register Account'}
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-400 flex items-center gap-1.5 tracking-wider">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              QUICK TEST & DEMO
            </span>
            <span className="text-[10px] font-mono text-zinc-600">Strict Auth</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center font-mono text-[11px]">
            <button
              type="button"
              onClick={() => handleDemoSwitch('student')}
              className="p-2.5 rounded-lg bg-neutral-900 border border-white/10 hover:border-white/30 text-zinc-300 transition-all hover:bg-neutral-850 flex flex-col items-center justify-center gap-0.5"
            >
              <div className="font-medium text-white">Student Demo</div>
              <div className="text-[9px] text-zinc-500">Aditi Sharma (Student)</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('rahul.verma@somaiya.edu');
                soundFx.play('pill', 0.4);
              }}
              className="p-2.5 rounded-lg bg-neutral-900 border border-white/10 hover:border-amber-500/40 text-zinc-300 transition-all hover:bg-neutral-850 flex flex-col items-center justify-center gap-0.5"
            >
              <div className="font-medium text-amber-300 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Council Admin</span>
              </div>
              <div className="text-[9px] text-zinc-500">Auto-fill & Enter Password</div>
            </button>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 text-center">
            Council & Super Admin access requires password authentication. Automatic 1-click elevation is disabled.
          </p>
        </div>
      </div>
    </div>
  );
};
