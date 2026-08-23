import React, { useState } from 'react';
import { Compass, ShieldCheck, Target, Users, MapPin, ChevronDown, Send } from 'lucide-react';
import { ScreenTab } from '../types';

interface AboutViewProps {
  onNavigate: (tab: ScreenTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are the resources officially verified for Cambridge O Level?',
      a: 'All past papers, marking schemes, and syllabus guides are strictly indexed from official Cambridge Assessment International Education (CAIE) syllabuses. Specimen papers and topical question booklets are checked for syllabus code accuracy (e.g., Math 4024, Physics 5054, Chemistry 5070).',
    },
    {
      q: 'How frequently are new materials and topical worksheets uploaded?',
      a: 'Our archival team reviews student requests and syllabus releases on a bi-weekly cycle. Whenever exam sessions (May/June and Oct/Nov) conclude and official papers become public, we compile, categorize, and verify them.',
    },
    {
      q: 'Can students or educators request specific topic notes?',
      a: 'Yes! Navigate to our "Request a Resource" tab. You can request specific chapter notes (e.g., Kinematics, Organic Chemistry, Logic Gates) or full yearly past paper bundles. Our curators prioritize the most frequently requested materials.',
    },
    {
      q: 'Why the compass aesthetic?',
      a: 'A compass represents orientation, precision, and reliable navigation through challenging academic terrain. We believe studying for O Levels should feel like navigating with calibrated instruments, not wading through cluttered forums.',
    },
  ];

  return (
    <div id="about-view" className="flex-grow max-w-[1200px] w-full mx-auto px-4 sm:px-8 md:px-16 py-12 md:py-20">
      {/* Header */}
      <div className="mb-16 text-center max-w-3xl mx-auto pb-8 border-b border-[#EBE8E1]">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#EBE8E1] flex items-center justify-center text-[#1A1A1A] mx-auto mb-4 shadow-xs">
          <Compass className="w-6 h-6 text-[#C4A678]" />
        </div>
        <span className="sans-micro text-[#C4A678] block mb-2">Institutional Manifesto</span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A1A] tracking-tight mb-4">
          About Cambridge Compass
        </h1>
        <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
          A precision scholarly archive engineered for academic rigor and focused navigation of Cambridge International qualifications.
        </p>
      </div>

      {/* 3 Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="tactile-card p-8 rounded-2xl bg-white border border-[#EBE8E1] flex flex-col justify-between hover:border-[#1A1A1A] transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#EBE8E1] flex items-center justify-center text-[#1A1A1A] mb-6">
              <ShieldCheck className="w-5 h-5 text-[#C4A678]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
              Curated with Rigor
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
              Every past paper, worksheet, and topical problem set is systematically audited against official CAIE syllabus specifications.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#EBE8E1] sans-micro text-[#71717A]">
            Syllabus Standards Compliant
          </div>
        </div>

        <div className="tactile-card p-8 rounded-2xl bg-white border border-[#EBE8E1] flex flex-col justify-between hover:border-[#1A1A1A] transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#EBE8E1] flex items-center justify-center text-[#1A1A1A] mb-6">
              <Target className="w-5 h-5 text-[#C4A678]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
              Clean Navigation
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
              Designed as a focused instrument for study—free from clutter, noise, or dead links. Find what you need with archival swiftness.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#EBE8E1] sans-micro text-[#71717A]">
            Distraction-Free Environment
          </div>
        </div>

        <div className="tactile-card p-8 rounded-2xl bg-white border border-[#EBE8E1] flex flex-col justify-between hover:border-[#1A1A1A] transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#EBE8E1] flex items-center justify-center text-[#1A1A1A] mb-6">
              <Users className="w-5 h-5 text-[#C4A678]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
              Community Directed
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
              Our archive grows around real student demand. Petitions submitted via the curation board guide the sourcing of new revision dossiers.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#EBE8E1] sans-micro text-[#71717A]">
            48h Archival Cycle
          </div>
        </div>
      </div>

      {/* Cartographic Coordinates Section */}
      <div className="bg-white border border-[#EBE8E1] rounded-2xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 sans-micro text-[#71717A] mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#C4A678]" />
            Archival Coordinates
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
            Grounded in Scholarly Tradition
          </h2>
          <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
            Inspired by the historic libraries and scholarly heritage of Cambridge, England. We bring the same precision and quiet focus to modern online examination preparation.
          </p>
        </div>

        <div className="bg-[#FAF7F0] border border-[#EBE8E1] rounded-xl p-6 text-center font-mono text-xs shadow-xs min-w-[200px]">
          <span className="text-[10px] text-[#71717A] uppercase tracking-[0.2em] block mb-1">
            ORIGIN DATUM
          </span>
          <p className="text-lg font-bold text-[#1A1A1A]">52°12'19.4"N</p>
          <p className="text-lg font-bold text-[#1A1A1A]">0°07'01.5"E</p>
          <span className="text-[10px] text-[#71717A] block mt-1 font-mono">Cambridge, UK</span>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="max-w-3xl mx-auto space-y-4 mb-16">
        <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-6 text-center">
          Frequently Asked Inquiries
        </h2>

        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#EBE8E1] rounded-xl overflow-hidden transition-all shadow-xs"
          >
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif font-bold text-sm text-[#1A1A1A] hover:bg-[#FAF7F0] transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#71717A] transition-transform duration-200 ${
                  openFaq === idx ? 'rotate-180 text-[#C4A678]' : ''
                }`}
              />
            </button>
            {openFaq === idx && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-[#52525B] leading-relaxed border-t border-[#EBE8E1] pt-3 animate-fade-in">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center py-10 border-t border-[#EBE8E1]">
        <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">
          Looking for a specific past paper or revision booklet?
        </h3>
        <p className="text-xs text-[#71717A] mb-6 font-mono">
          Submit your petition to our curation board and we'll source it.
        </p>
        <button
          onClick={() => onNavigate('request')}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A1A1A] hover:bg-[#C4A678] hover:text-[#1A1A1A] text-white text-xs font-mono uppercase tracking-[0.18em] rounded-full shadow-xs transition-all duration-200"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Lodge Resource Petition</span>
        </button>
      </div>
    </div>
  );
};
