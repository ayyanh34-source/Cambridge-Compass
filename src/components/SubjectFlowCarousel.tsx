import React, { useRef } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { Subject } from '../types';
import { ArrowLeft, ArrowRight, Folder, ArrowUpRight } from 'lucide-react';

interface SubjectFlowCarouselProps {
  onSelectSubject: (subject: Subject) => void;
}

export const SubjectFlowCarousel: React.FC<SubjectFlowCarouselProps> = ({ onSelectSubject }) => {
  const { subjects, loading, error } = useSubjects();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="max-w-[1240px] w-full mx-auto px-4 sm:px-8 md:px-12 py-12">
        <div className="text-center text-sm font-mono text-[#71717A]">Loading subjects...</div>
      </section>
    );
  }

  if (error || subjects.length === 0) return null;

  return (
    <section id="home-subject-carousel" className="max-w-[1240px] w-full mx-auto px-4 sm:px-8 md:px-12 py-12 md:py-16">
      <div className="flex items-end justify-between mb-6 pb-4 border-b border-[#EBE8E1]">
        <div>
          <span className="sans-micro text-[#C4A678] block mb-1.5">Curriculum Directory</span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Explore by Subject
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-full border border-[#EBE8E1] bg-white text-[#71717A] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
            aria-label="Scroll left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-full border border-[#EBE8E1] bg-white text-[#71717A] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
            aria-label="Scroll right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
      >
        {subjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => onSelectSubject(subject)}
            className="tactile-card group cursor-pointer flex-shrink-0 w-[260px] snap-start rounded-2xl p-6 bg-white border border-[#EBE8E1] hover:border-[#1A1A1A] transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between h-[200px]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                {subject.syllabusCode ? (
                  <span className="text-[10px] font-mono font-bold tracking-[0.15em] text-[#71717A] uppercase">
                    [{subject.syllabusCode}]
                  </span>
                ) : (
                  <span />
                )}
                <ArrowUpRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#C4A678] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] group-hover:text-[#C4A678] transition-colors leading-snug">
                {subject.name}
              </h3>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#EBE8E1] text-[11px] font-mono text-[#71717A]">
              <span className="flex items-center gap-1">
                <Folder className="w-3 h-3 text-[#C4A678]" />
                {subject.categories.length} categories
              </span>
              <span>{subject.documentCount} docs</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubjectFlowCarousel;