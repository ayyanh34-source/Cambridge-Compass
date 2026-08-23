import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FolderOpen, FileText, ChevronRight, BookOpen } from 'lucide-react';
import { SUBJECTS_DATA, RESOURCE_DOCUMENTS } from '../data/mockData';
import { Subject, ResourceDocument } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubject: (subject: Subject) => void;
  onSelectDocument: (doc: ResourceDocument) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSubject,
  onSelectDocument,
}) => {
  const [query, setQuery] = useState('Math');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();

  const matchedSubjects = normalizedQuery
    ? SUBJECTS_DATA.filter(
        (s) =>
          s.name.toLowerCase().includes(normalizedQuery) ||
          s.syllabusCode.toLowerCase().includes(normalizedQuery) ||
          s.topics.some((t) => t.toLowerCase().includes(normalizedQuery))
      )
    : SUBJECTS_DATA.slice(0, 3);

  const matchedDocuments = normalizedQuery
    ? RESOURCE_DOCUMENTS.filter(
        (d) =>
          d.title.toLowerCase().includes(normalizedQuery) ||
          d.subjectName.toLowerCase().includes(normalizedQuery) ||
          d.syllabusCode.toLowerCase().includes(normalizedQuery) ||
          (d.topic && d.topic.toLowerCase().includes(normalizedQuery)) ||
          d.description.toLowerCase().includes(normalizedQuery)
      )
    : RESOURCE_DOCUMENTS.slice(0, 4);

  return (
    <div
      id="search-overlay"
      className="fixed inset-0 bg-[#FDFCF9]/98 z-[100] backdrop-blur-md flex flex-col pt-16 px-4 md:px-16 overflow-y-auto animate-fade-in text-[#1A1A1A]"
    >
      {/* Close button */}
      <button
        id="search-close-btn"
        onClick={onClose}
        aria-label="Close search"
        className="absolute top-6 right-6 md:right-16 p-2.5 text-[#71717A] hover:text-[#1A1A1A] transition-colors rounded-full hover:bg-[#FAF7F0] border border-transparent hover:border-[#EBE8E1]"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Search Content Container */}
      <div className="max-w-3xl w-full mx-auto mt-8 md:mt-12 flex flex-col space-y-10 pb-20">
        <span className="sans-micro text-[#C4A678] text-center block">
          Archival Search Index
        </span>

        {/* Search input field */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#71717A] pointer-events-none" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search curricula, syllabus codes, papers..."
            className="w-full bg-white border border-[#EBE8E1] rounded-2xl text-2xl md:text-3xl font-serif font-bold text-[#1A1A1A] placeholder-[#A1A1AA] py-5 pl-14 pr-24 outline-none focus:border-[#1A1A1A] shadow-xs transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[10px] uppercase font-mono px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#1A1A1A] hover:text-white rounded-full text-[#71717A] border border-[#EBE8E1] transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Results list */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE8E1]">
            <h3 className="sans-micro text-[#71717A]">
              Matching Records {matchedSubjects.length + matchedDocuments.length > 0 && `[${matchedSubjects.length + matchedDocuments.length}]`}
            </h3>
            <span className="text-[10px] text-[#A1A1AA] font-mono uppercase tracking-widest">Esc to dismiss</span>
          </div>

          <div className="flex flex-col space-y-3">
            {/* Subjects Results */}
            {matchedSubjects.map((subject) => (
              <button
                key={subject.id}
                id={`search-result-subject-${subject.id}`}
                onClick={() => {
                  onSelectSubject(subject);
                  onClose();
                }}
                className="w-full text-left flex items-center justify-between p-4 sm:p-5 bg-white rounded-xl border border-[#EBE8E1] hover:border-[#1A1A1A] hover:shadow-xs transition-all group active:scale-[0.99]"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#EBE8E1] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-serif font-bold text-[#1A1A1A] group-hover:text-[#C4A678] transition-colors">
                      {subject.name}
                    </span>
                    <span className="text-[11px] font-mono text-[#71717A]">
                      Syllabus [{subject.syllabusCode}] • {subject.documentCount} Records cataloged
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#1A1A1A] group-hover:translate-x-1 transition-all" />
              </button>
            ))}

            {/* Documents Results */}
            {matchedDocuments.map((doc) => (
              <button
                key={doc.id}
                id={`search-result-doc-${doc.id}`}
                onClick={() => {
                  onSelectDocument(doc);
                  onClose();
                }}
                className="w-full text-left flex items-center justify-between p-4 sm:p-5 bg-white rounded-xl border border-[#EBE8E1] hover:border-[#1A1A1A] hover:shadow-xs transition-all group active:scale-[0.99]"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#EBE8E1] flex items-center justify-center text-[#71717A] group-hover:text-[#1A1A1A] group-hover:border-[#1A1A1A] transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-serif font-bold text-[#1A1A1A] group-hover:text-[#C4A678] transition-colors">
                      {doc.title}
                    </span>
                    <span className="text-[11px] font-mono text-[#71717A]">
                      Code [{doc.syllabusCode}] • {doc.directory} • {doc.size}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#1A1A1A] group-hover:translate-x-1 transition-all" />
              </button>
            ))}

            {matchedSubjects.length === 0 && matchedDocuments.length === 0 && (
              <div className="p-12 text-center bg-white border border-[#EBE8E1] rounded-2xl">
                <BookOpen className="w-8 h-8 text-[#A1A1AA] mx-auto mb-3" />
                <p className="text-base font-serif font-bold text-[#1A1A1A]">No archives matched "{query}"</p>
                <p className="text-xs text-[#71717A] mt-1 font-mono">
                  Try searching for syllabus codes 4024, 5054, 5070, or submit a petition to curate this resource.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick suggestions */}
        <div className="pt-4 border-t border-[#EBE8E1] flex flex-wrap items-center gap-2">
          <span className="sans-micro text-[#71717A] mr-2">Frequently Consulted:</span>
          {['Mathematics [4024]', 'Physics [5054]', 'Past Paper 2023', 'Trigonometry', 'Chemistry [5070]', 'Computer Science [2210]'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag.replace(/\[|\]/g, ''))}
              className="text-[11px] font-mono px-3 py-1 bg-white hover:bg-[#1A1A1A] hover:text-white border border-[#EBE8E1] rounded-full text-[#52525B] transition-colors shadow-2xs"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
