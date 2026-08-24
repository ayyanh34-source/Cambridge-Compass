import React from 'react';
import { ScreenTab } from '../types';
import { Compass, ChevronUp } from 'lucide-react';

interface FooterProps {
  onNavigate?: (tab: ScreenTab) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate = (_tab?: ScreenTab) => {},
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-app-footer"
      className="bg-[#FDFCF9] border-t border-[#EBE8E1] relative z-10 mt-auto"
    >
      {/* Scroll to top indicator */}
      <button
        id="footer-scroll-top-btn"
        onClick={scrollToTop}
        className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border border-[#1A1A1A] rounded-full flex items-center justify-center shadow-xs hover:bg-[#1A1A1A] hover:text-white transition-all group"
        title="Scroll to summit"
      >
        <ChevronUp className="w-3.5 h-3.5 text-[#1A1A1A] group-hover:text-white group-hover:-translate-y-0.5 transition-transform" />
      </button>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 md:px-16 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Col */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <Compass className="w-4 h-4 text-[#C4A678]" />
            <span className="font-serif text-xl font-bold text-[#1A1A1A]">
              Cambridge Compass
            </span>
          </div>
          <p className="text-xs text-[#71717A] max-w-sm">
            Curated archival resources, structured syllabus roadmaps, and topical study guides for Cambridge International O Level examinations.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#A1A1AA]">
            <span>Vol. 01 / Ed. 2026</span>
            <span>•</span>
            <span>52°12'19"N // 0°07'01"E</span>
            <span>•</span>
            <span className="text-[#C4A678]">Archival Stack</span>
          </div>
        </div>

        {/* Right Col Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-[11px] font-mono uppercase tracking-[0.18em] text-[#71717A]">
          <button
            onClick={() => onNavigate('about')}
            className="hover:text-[#1A1A1A] hover:underline transition-colors"
          >
            About
          </button>
          <button
            onClick={() => onNavigate('request')}
            className="hover:text-[#1A1A1A] text-[#1A1A1A] font-semibold hover:underline transition-colors"
          >
            Request Resource
          </button>
          <button
            onClick={() => onNavigate('whats-new')}
            className="hover:text-[#1A1A1A] hover:underline transition-colors"
          >
            What's New
          </button>
          <button
            onClick={() => onNavigate('resources')}
            className="hover:text-[#1A1A1A] hover:underline transition-colors"
          >
            Resources
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
