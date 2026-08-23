import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Subject } from '../types';
import { ChevronLeft, ChevronRight, ArrowRight, Folder, FileText, Sparkles } from 'lucide-react';

interface SubjectFlowCarouselProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
}

export const SubjectFlowCarousel: React.FC<SubjectFlowCarouselProps> = ({
  subjects,
  onSelectSubject,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = subjects.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  // Drag / Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diff = dragCurrentX - dragStartX;
    if (diff > 50) {
      handlePrev();
    } else if (diff < -50) {
      handleNext();
    }
    setIsDragging(false);
    setDragStartX(0);
    setDragCurrentX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const diff = dragCurrentX - dragStartX;
    if (diff > 60) {
      handlePrev();
    } else if (diff < -60) {
      handleNext();
    }
    setIsDragging(false);
    setDragStartX(0);
    setDragCurrentX(0);
  };

  return (
    <div
      id="subject-3d-flow-carousel"
      className="relative w-full select-none py-6"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(false)}
    >
      {/* 3D Stage Container */}
      <div
        ref={containerRef}
        className="relative h-[420px] sm:h-[460px] md:h-[480px] w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {subjects.map((subject, index) => {
          // Calculate circular or bounded offset
          let offset = index - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isCenter = offset === 0;
          const isImmediateNeighbor = Math.abs(offset) === 1;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          // 3D positioning calculations
          const xOffset = offset * 210; // horizontal separation
          const zOffset = -Math.abs(offset) * 140; // depth pushback
          const yRotation = offset > 0 ? -32 : offset < 0 ? 32 : 0; // 3D Y angle
          const scale = isCenter ? 1 : 1 - Math.abs(offset) * 0.12;
          const opacity = isCenter ? 1 : Math.max(0.35, 1 - Math.abs(offset) * 0.35);
          const zIndex = 30 - Math.abs(offset) * 5;

          const patternClass =
            subject.pattern === 'math'
              ? 'bg-pattern-math'
              : subject.pattern === 'physics'
              ? 'bg-pattern-physics'
              : subject.pattern === 'chemistry'
              ? 'bg-pattern-chemistry'
              : subject.pattern === 'cs'
              ? 'bg-pattern-cs'
              : subject.pattern === 'biology'
              ? 'bg-pattern-biology'
              : 'bg-pattern-math';

          return (
            <div
              key={subject.id}
              id={`flow-card-${subject.id}`}
              onClick={(e) => {
                if (isDragging && Math.abs(dragCurrentX - dragStartX) > 10) return;
                if (isCenter) {
                  onSelectSubject(subject);
                } else {
                  setActiveIndex(index);
                }
              }}
              style={{
                transform: `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${yRotation}deg) scale(${scale})`,
                zIndex,
                opacity,
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease, box-shadow 0.5s ease',
              }}
              className={`absolute w-[300px] sm:w-[350px] md:w-[380px] h-[360px] sm:h-[390px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer border transition-all duration-300 ${
                isCenter
                  ? 'bg-[#FDFCF9] border-[#1A1A1A] shadow-2xl ring-1 ring-[#1A1A1A]/10'
                  : 'bg-white/95 border-[#EBE8E1] shadow-md hover:border-[#71717A]'
              }`}
            >
              {/* Pattern Watermark Background */}
              <div
                className={`absolute inset-0 rounded-2xl ${patternClass} opacity-50 pointer-events-none`}
              />

              {/* Card Top: Code & Level */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-[11px] font-mono font-bold tracking-[0.2em] text-[#71717A] uppercase">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        isCenter ? 'bg-[#C4A678] animate-pulse' : 'bg-[#A1A1AA]'
                      }`}
                    />
                    CODE [{subject.syllabusCode}]
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#EBE8E1] text-[#1A1A1A] font-semibold">
                    {subject.level}
                  </span>
                </div>

                <h3
                  className={`font-serif font-bold text-[#1A1A1A] mb-2 leading-tight transition-colors ${
                    isCenter ? 'text-2xl sm:text-3xl text-[#1A1A1A]' : 'text-xl sm:text-2xl text-[#52525B]'
                  }`}
                >
                  {subject.name}
                </h3>

                <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed line-clamp-3 mb-4">
                  {subject.tagline || subject.description}
                </p>

                {/* Directory Badges Preview */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {subject.directories.slice(0, 3).map((dir) => (
                    <span
                      key={dir}
                      className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF7F0] border border-[#EBE8E1] text-[#71717A]"
                    >
                      <Folder className="w-2.5 h-2.5 text-[#C4A678]" />
                      {dir}
                    </span>
                  ))}
                  {subject.directories.length > 3 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md text-[#A1A1AA]">
                      +{subject.directories.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 pt-4 border-t border-[#EBE8E1] flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#71717A]">
                  <FileText className="w-3.5 h-3.5 text-[#A1A1AA]" />
                  <span>{subject.documentCount} Documents</span>
                </div>

                {isCenter ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSubject(subject);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#C4A678] hover:text-[#1A1A1A] text-white text-[11px] font-mono uppercase tracking-[0.18em] rounded-full transition-all duration-200 shadow-sm active:scale-95 font-semibold"
                  >
                    <span>Examine Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider group-hover:text-[#1A1A1A]">
                    Click to Focus
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel Controls & Subject Selector Pill Tabs */}
      <div className="mt-4 flex flex-col items-center gap-6">
        {/* Navigation Buttons and Dots */}
        <div className="flex items-center justify-center gap-6">
          <button
            id="flow-carousel-prev-btn"
            onClick={handlePrev}
            aria-label="Previous subject card"
            className="w-11 h-11 rounded-full border border-[#EBE8E1] bg-white hover:border-[#1A1A1A] hover:bg-[#FAF7F0] flex items-center justify-center text-[#1A1A1A] transition-all shadow-xs active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {subjects.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Jump to ${s.name}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? 'w-8 bg-[#1A1A1A]'
                    : 'w-2 bg-[#EBE8E1] hover:bg-[#A1A1AA]'
                }`}
              />
            ))}
          </div>

          <button
            id="flow-carousel-next-btn"
            onClick={handleNext}
            aria-label="Next subject card"
            className="w-11 h-11 rounded-full border border-[#EBE8E1] bg-white hover:border-[#1A1A1A] hover:bg-[#FAF7F0] flex items-center justify-center text-[#1A1A1A] transition-all shadow-xs active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Subject Tabs Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl px-4">
          {subjects.map((sub, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={sub.id}
                id={`carousel-subject-tab-${sub.id}`}
                onClick={() => setActiveIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white shadow-xs font-bold ring-1 ring-[#1A1A1A]'
                    : 'bg-white border border-[#EBE8E1] text-[#71717A] hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`text-[10px] ${
                    isActive ? 'text-[#C4A678]' : 'text-[#A1A1AA]'
                  }`}
                >
                  [{sub.syllabusCode}]
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
