import React from 'react';
import { Subject, ScreenTab } from '../types';
import { ArrowRight, BookOpen } from 'lucide-react';
import { CompassCanvas } from './CompassCanvas';

interface HomeViewProps {
  onSelectSubject?: (subject: Subject) => void;
  onNavigate?: (tab: ScreenTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectSubject = (_s?: Subject) => {},
  onNavigate = (_tab?: ScreenTab) => {},
}) => {
  return (
    <div id="home-view-container" className="flex-grow flex flex-col relative overflow-hidden">
      {/* Editorial Giant Typographic Background Watermark */}
      <div className="absolute inset-0 pointer-events-none z-0 flex flex-col items-center justify-between overflow-hidden opacity-[0.03] select-none">
        <span className="font-serif font-black text-[180px] sm:text-[260px] md:text-[340px] tracking-tighter leading-none text-[#1A1A1A] transform -rotate-1 mt-12">
          ARCHIVE
        </span>
        <span className="font-serif font-black text-[180px] sm:text-[260px] md:text-[340px] tracking-tighter leading-none text-[#1A1A1A] transform rotate-1 mb-12">
          COMPASS
        </span>
      </div>

      {/* Snaking Cartographic Guide */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-center opacity-25">
        <svg
          className="w-full max-w-[1200px] h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 2400"
          fill="none"
        >
          <path
            d="M 600,0 C 680,300 520,600 600,900 C 680,1200 520,1500 600,1800 C 680,2100 550,2300 600,2400"
            stroke="#1A1A1A"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            className="snaking-path"
          />
        </svg>
      </div>

      {/* HERO SECTION */}
      <section
        id="hero-section"
        className="relative z-10 min-h-[720px] md:min-h-[820px] flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16 pt-12 pb-24"
      >
        {/* Micro Header Badge */}
        <div className="mb-6 z-20 flex items-center gap-3">
          <span className="sans-micro text-[#C4A678] border border-[#C4A678]/40 bg-[#FAF7F0] px-3.5 py-1 rounded-full">
            Selected Archive — Vol 01
          </span>
        </div>

        {/* Interactive Minimal Precision Compass */}
        <div className="relative mb-6 z-10 flex items-center justify-center">
          <CompassCanvas size={290} interactive={true} />
        </div>

        {/* Hero Headings */}
        <div className="max-w-3xl z-10">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1A1A1A] mb-6 leading-[0.95]">
            Find your direction.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#52525B] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            A precision archive of O Level academic resources. Structured for rigor, designed for clarity. Navigate your studies with the right instruments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-explore-btn"
              onClick={() => onNavigate('resources')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#1A1A1A] hover:bg-[#C4A678] hover:text-[#1A1A1A] text-white text-xs font-mono uppercase tracking-[0.18em] rounded-full transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              <span>Explore Resources</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-request-btn"
              onClick={() => onNavigate('request')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-[#EBE8E1] hover:border-[#1A1A1A] text-[#1A1A1A] text-xs font-mono uppercase tracking-[0.18em] rounded-full transition-all hover:bg-[#FAF7F0] active:scale-[0.98]"
            >
              <span>Request Resource</span>
            </button>
          </div>
        </div>
      </section>



      {/* EDITORIAL / ARCHIVAL PHILOSOPHY */}
      <section
        id="archival-philosophy-section"
        className="py-28 px-4 sm:px-8 md:px-16 max-w-[1200px] mx-auto text-center relative z-10"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="w-12 h-12 rounded-full border border-[#EBE8E1] bg-white mx-auto flex items-center justify-center text-[#1A1A1A] shadow-xs">
            <BookOpen className="w-5 h-5 text-[#C4A678]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#1A1A1A] leading-snug tracking-tight">
            “Navigating the O Level curriculum requires precision and clarity. We curate essential past papers, revision notes, and marking schemes, organizing them into a coherent archive for focused study.”
          </p>
          <div className="pt-2">
            <span className="sans-micro text-[#71717A] block">
              — Cambridge Compass Archival Board // Est. 2024
            </span>
          </div>
        </div>
      </section>

      {/* REQUEST BANNER */}
      <section
        id="request-banner-section"
        className="py-16 px-4 sm:px-8 md:px-16 bg-[#FAF7F0] border-y border-[#EBE8E1] relative z-10"
      >
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div className="space-y-1">
            <span className="sans-micro text-[#C4A678] block">Custom Submissions</span>
            <h3 className="font-serif text-3xl font-bold text-[#1A1A1A]">
              Can't find what you need?
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B]">
              Submit requests for specific syllabus notes, topical question packs, or missing examiner reports.
            </p>
          </div>
          <button
            id="banner-request-link-btn"
            onClick={() => onNavigate('request')}
            className="flex-shrink-0 px-8 py-3.5 bg-[#1A1A1A] hover:bg-[#C4A678] hover:text-[#1A1A1A] text-white rounded-full text-xs font-mono uppercase tracking-[0.18em] active:scale-[0.98] transition-all shadow-sm"
          >
            Submit Request
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
