import React, { useState } from 'react';
import { X, Compass, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, name: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('alex.vance@cambridge-prep.edu');
  const [name, setName] = useState('Alex Vance');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(email, name);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 z-[100] bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFCF9] rounded-2xl border border-[#EBE8E1] shadow-2xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#71717A] hover:text-[#1A1A1A] rounded-full hover:bg-[#FAF7F0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl border border-[#EBE8E1] bg-white mx-auto flex items-center justify-center text-[#1A1A1A] mb-3 shadow-xs">
            <Compass className="w-6 h-6 text-[#C4A678]" />
          </div>
          <span className="sans-micro text-[#C4A678] block mb-1">Scholar Authentication</span>
          <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Cambridge Compass
          </h2>
          <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
            Sign in to track your examination syllabus progress, save annotations, and submit archival requests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="sans-micro text-[#1A1A1A] block mb-1.5 font-bold">
              Scholar Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 bg-white border border-[#EBE8E1] rounded-xl px-3.5 text-xs font-mono text-[#1A1A1A] focus:border-[#1A1A1A] outline-none shadow-2xs transition-colors"
            />
          </div>

          <div>
            <label className="sans-micro text-[#1A1A1A] block mb-1.5 font-bold">
              Academic Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 bg-white border border-[#EBE8E1] rounded-xl pl-10 pr-3.5 text-xs font-mono text-[#1A1A1A] focus:border-[#1A1A1A] outline-none shadow-2xs transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="sans-micro text-[#1A1A1A] block mb-1.5 font-bold">
              Access Token / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-white border border-[#EBE8E1] rounded-xl pl-10 pr-3.5 text-xs font-mono text-[#1A1A1A] focus:border-[#1A1A1A] outline-none shadow-2xs transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#1A1A1A] hover:bg-[#C4A678] hover:text-[#1A1A1A] text-white text-xs font-mono uppercase tracking-[0.18em] rounded-full transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98 mt-3 font-semibold"
          >
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Authenticate Scholar'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#EBE8E1] text-center text-[10px] font-mono text-[#71717A]">
          <span>Demonstration scholar profile configured with verified O Level syllabus history.</span>
        </div>
      </div>
    </div>
  );
};
