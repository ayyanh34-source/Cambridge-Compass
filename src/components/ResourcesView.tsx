import React, { useState } from 'react';
import { Subject, DirectoryType, ResourceDocument } from '../types';
import { SUBJECTS_DATA, RESOURCE_DOCUMENTS } from '../data/mockData';
import {
  Folder,
  FileText,
  LayoutGrid,
  List,
  ChevronRight,
  Download,
  Eye,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Layers,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResourcesViewProps {
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject | null) => void;
  onPreviewDocument: (doc: ResourceDocument) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  selectedSubject,
  onSelectSubject,
  onPreviewDocument,
}) => {
  // Directory & filter states for single-subject view
  const [activeDirectory, setActiveDirectory] = useState<DirectoryType | 'all'>('all');
  const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list');
  const [docSearchFilter, setDocSearchFilter] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [downloadedDocId, setDownloadedDocId] = useState<string | null>(null);

  // Filter states for subject grid overview
  const [subjectSearch, setSubjectSearch] = useState('');

  // Filtered subjects for the overview grid
  const filteredSubjects = SUBJECTS_DATA.filter((sub) => {
    return (
      sub.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      sub.syllabusCode.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      (sub.tagline && sub.tagline.toLowerCase().includes(subjectSearch.toLowerCase())) ||
      sub.topics.some((t) => t.toLowerCase().includes(subjectSearch.toLowerCase()))
    );
  });

  // All documents for the currently selected subject
  const subjectDocs = selectedSubject
    ? RESOURCE_DOCUMENTS.filter(
        (doc) =>
          doc.subjectId === selectedSubject.id ||
          doc.syllabusCode === selectedSubject.syllabusCode
      )
    : [];

  // Filtered documents based on directory, topic, and search
  const filteredDocs = subjectDocs.filter((doc) => {
    const matchesDir = activeDirectory === 'all' ? true : doc.directory === activeDirectory;
    const matchesTopic = selectedTopic === 'all' ? true : doc.topic === selectedTopic;
    const matchesSearch =
      doc.title.toLowerCase().includes(docSearchFilter.toLowerCase()) ||
      doc.description.toLowerCase().includes(docSearchFilter.toLowerCase()) ||
      (doc.topic && doc.topic.toLowerCase().includes(docSearchFilter.toLowerCase())) ||
      doc.directory.toLowerCase().includes(docSearchFilter.toLowerCase());
    return matchesDir && matchesTopic && matchesSearch;
  });

  const handleDownload = (e: React.MouseEvent, doc: ResourceDocument) => {
    e.stopPropagation();
    setDownloadedDocId(doc.id);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#1A1A1A', '#C4A678'],
    });

    const blob = new Blob([`%PDF-1.4\nCambridge Compass: ${doc.title}`], {
      type: 'application/pdf',
    });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = doc.filename;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadedDocId(null), 2500);
  };

  const handleOpenSubject = (subject: Subject) => {
    onSelectSubject(subject);
    setActiveDirectory('all');
    setSelectedTopic('all');
    setDocSearchFilter('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* =======================================================================
     VIEW A: SUBJECTS GRID (When no specific subject is selected)
     ======================================================================= */
  if (!selectedSubject) {
    return (
      <div
        id="resources-subjects-grid-page"
        className="flex-grow max-w-[1240px] w-full mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12 animate-fade-in"
      >
        {/* Breadcrumb Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE8E1] pb-4">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#71717A]">
            <span>Archival Vault</span>
            <ChevronRight className="w-3 h-3 text-[#A1A1AA]" />
            <span className="text-[#1A1A1A] font-bold">Curriculum Index</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C4A678] bg-[#FAF7F0] border border-[#C4A678]/30 px-3 py-0.5 rounded-full self-start sm:self-auto font-semibold">
            {SUBJECTS_DATA.length} Syllabi Available
          </span>
        </div>

        {/* Hero Banner for Resources Overview */}
        <div className="mb-10 text-center sm:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div>
            <span className="sans-micro text-[#C4A678] block mb-1.5">
              Curriculum Directory // Select a Subject
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
              Subject Resource Archives
            </h1>
            <p className="text-xs sm:text-sm text-[#52525B] mt-2 max-w-2xl leading-relaxed">
              Explore syllabus-aligned notes, topical questions, past paper series, and marking
              schemes. Choose any subject below to enter its dedicated resource repository.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              placeholder="Search subjects or codes (e.g. 4024)..."
              className="w-full h-11 pl-10 pr-4 text-xs font-mono bg-white border border-[#EBE8E1] rounded-full placeholder-[#A1A1AA] focus:border-[#1A1A1A] outline-none shadow-2xs transition-colors"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div
          id="subjects-overview-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSubjects.map((subject) => {
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

            const docsCount = RESOURCE_DOCUMENTS.filter(
              (d) => d.subjectId === subject.id || d.syllabusCode === subject.syllabusCode
            ).length;

            return (
              <div
                key={subject.id}
                id={`subject-grid-card-${subject.id}`}
                onClick={() => handleOpenSubject(subject)}
                className="tactile-card group cursor-pointer rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between h-[280px] bg-white border border-[#EBE8E1] hover:border-[#1A1A1A] transition-all duration-200 shadow-xs hover:shadow-md"
              >
                {/* Subtle Geometric Academic Watermark Pattern */}
                <div
                  className={`absolute inset-0 ${patternClass} opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none`}
                />

                {/* Top card metadata */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-[10px] font-mono font-bold tracking-[0.2em] text-[#71717A] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#C4A678] mr-2"></span>
                      CODE [{subject.syllabusCode}]
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#EBE8E1] text-[#1A1A1A] font-semibold">
                      {subject.level}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] group-hover:text-[#C4A678] transition-colors mb-2">
                    {subject.name}
                  </h2>
                  <p className="text-xs text-[#52525B] line-clamp-2 leading-relaxed mb-3">
                    {subject.tagline || subject.description}
                  </p>

                  {/* Directory Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
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

                {/* Bottom card footer */}
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#EBE8E1] mt-auto text-xs font-medium text-[#71717A]">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#71717A]">
                    {docsCount > 0 ? `${docsCount} Documents` : `${subject.documentCount} Items`}
                  </span>
                  <div className="flex items-center gap-1.5 text-[#1A1A1A] text-[11px] font-mono uppercase tracking-wider font-bold group-hover:text-[#C4A678] group-hover:translate-x-1 transition-all">
                    <span>Open Directory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="p-16 text-center bg-white rounded-2xl border border-[#EBE8E1] mt-6">
            <BookOpen className="w-10 h-10 text-[#A1A1AA] mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">
              No subjects matching "{subjectSearch}"
            </h3>
            <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
              Please check your spelling or clear search filters to view all available Cambridge syllabi.
            </p>
            <button
              onClick={() => {
                setSubjectSearch('');
              }}
              className="mt-4 px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-[#C4A678] transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>
    );
  }

  /* =======================================================================
     VIEW B: SUBJECT DIRECTORY (When user clicked into a specific subject)
     ======================================================================= */
  return (
    <div
      id="resources-subject-directory-view"
      className="flex-grow max-w-[1240px] w-full mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12 animate-fade-in"
    >
      {/* Breadcrumbs with Return to All Subjects Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE8E1] pb-4">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#71717A]">
          <button
            id="back-to-all-subjects-breadcrumb"
            onClick={() => onSelectSubject(null)}
            className="hover:text-[#1A1A1A] hover:underline flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>All Subjects</span>
          </button>
          <ChevronRight className="w-3 h-3 text-[#A1A1AA]" />
          <span className="text-[#1A1A1A] font-bold">
            {selectedSubject.name} [{selectedSubject.syllabusCode}]
          </span>
        </div>

        <button
          id="back-to-all-subjects-btn"
          onClick={() => onSelectSubject(null)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EBE8E1] bg-white text-[#1A1A1A] text-[11px] font-mono uppercase tracking-wider hover:border-[#1A1A1A] hover:bg-[#FAF7F0] transition-colors self-start sm:self-auto shadow-2xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Switch Subject</span>
        </button>
      </div>

      {/* ACTIVE SUBJECT DOSSIER HERO BANNER */}
      <div
        id="active-subject-dossier"
        className="mb-8 p-6 sm:p-8 rounded-2xl bg-[#FAF7F0] border border-[#EBE8E1] relative overflow-hidden shadow-xs"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full bg-white border border-[#EBE8E1] text-[#1A1A1A]">
                {selectedSubject.level}
              </span>
              <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase">
                CODE [{selectedSubject.syllabusCode}]
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">
              {selectedSubject.name} Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#52525B] max-w-2xl leading-relaxed">
              {selectedSubject.tagline || selectedSubject.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            <div className="px-4 py-2 bg-white rounded-xl border border-[#EBE8E1] text-center shadow-2xs">
              <span className="block text-lg font-serif font-bold text-[#1A1A1A]">
                {subjectDocs.length}
              </span>
              <span className="text-[10px] font-mono uppercase text-[#71717A]">
                Curated Docs
              </span>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-[#EBE8E1] text-center shadow-2xs">
              <span className="block text-lg font-serif font-bold text-[#1A1A1A]">
                {selectedSubject.topics.length}
              </span>
              <span className="text-[10px] font-mono uppercase text-[#71717A]">
                Core Topics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DIRECTORY & FILTER TOOLBAR */}
      <div className="mb-6 space-y-4">
        {/* Category / Directory Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveDirectory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${
              activeDirectory === 'all'
                ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                : 'bg-white border border-[#EBE8E1] text-[#52525B] hover:text-[#1A1A1A] hover:bg-[#FAF7F0]'
            }`}
          >
            All Categories ({subjectDocs.length})
          </button>

          {selectedSubject.directories.map((dir) => {
            const count = subjectDocs.filter((d) => d.directory === dir).length;
            const isActive = activeDirectory === dir;
            return (
              <button
                key={dir}
                onClick={() => setActiveDirectory(dir)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                    : 'bg-white border border-[#EBE8E1] text-[#52525B] hover:text-[#1A1A1A] hover:bg-[#FAF7F0]'
                }`}
              >
                <Folder
                  className={`w-3 h-3 ${
                    isActive ? 'text-[#C4A678] fill-[#C4A678]' : 'text-[#71717A]'
                  }`}
                />
                <span>{dir}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#262626] text-[#C4A678]' : 'text-[#A1A1AA]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search, Topic Filters & View Mode Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Topic filter dropdown/pills if topics exist */}
          {selectedSubject.topics.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] flex-shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#C4A678]" /> Topic:
              </span>
              <button
                onClick={() => setSelectedTopic('all')}
                className={`flex-shrink-0 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                  selectedTopic === 'all'
                    ? 'bg-[#1A1A1A] text-white font-bold'
                    : 'bg-white border border-[#EBE8E1] text-[#52525B] hover:bg-[#FAF7F0]'
                }`}
              >
                All Topics
              </button>
              {selectedSubject.topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors truncate max-w-[180px] ${
                    selectedTopic === t
                      ? 'bg-[#1A1A1A] text-white font-bold'
                      : 'bg-white border border-[#EBE8E1] text-[#52525B] hover:bg-[#FAF7F0]'
                  }`}
                  title={t}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Search Input & List/Grid Layout Toggle */}
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="text"
                value={docSearchFilter}
                onChange={(e) => setDocSearchFilter(e.target.value)}
                placeholder={`Search in ${selectedSubject.name}...`}
                className="h-8.5 pl-8 pr-3 text-xs font-mono bg-white border border-[#EBE8E1] rounded-full placeholder-[#A1A1AA] focus:border-[#1A1A1A] outline-none w-48 sm:w-60 shadow-2xs"
              />
            </div>

            <div className="flex items-center bg-white border border-[#EBE8E1] rounded-full p-0.5 shadow-2xs">
              <button
                onClick={() => setViewLayout('list')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewLayout === 'list'
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#71717A] hover:text-[#1A1A1A]'
                }`}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewLayout === 'grid'
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#71717A] hover:text-[#1A1A1A]'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DOCUMENTS AREA */}
      <div className="bg-white rounded-2xl border border-[#EBE8E1] shadow-xs overflow-hidden">
        {/* Sub-header status bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#EBE8E1] bg-[#FAF7F0] text-xs font-mono text-[#71717A]">
          <div className="flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 text-[#C4A678]" />
            <span className="font-semibold text-[#1A1A1A]">
              {activeDirectory === 'all' ? 'All Document Categories' : activeDirectory}
            </span>
            <span>[{filteredDocs.length} items available]</span>
          </div>
          {(selectedTopic !== 'all' || docSearchFilter || activeDirectory !== 'all') && (
            <button
              onClick={() => {
                setActiveDirectory('all');
                setSelectedTopic('all');
                setDocSearchFilter('');
              }}
              className="text-[10px] text-[#1A1A1A] underline uppercase tracking-wider hover:text-[#C4A678]"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Documents Render */}
        {filteredDocs.length > 0 ? (
          viewLayout === 'list' ? (
            /* LIST VIEW */
            <div className="divide-y divide-[#EBE8E1]">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  id={`resource-item-${doc.id}`}
                  onClick={() => onPreviewDocument(doc)}
                  className="group p-4 sm:px-6 hover:bg-[#FAF7F0] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-4 min-w-0 pr-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#EBE8E1] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#C4A678] font-serif transition-colors truncate">
                          {doc.title}
                        </h3>
                        <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-[#FAF7F0] border border-[#EBE8E1] text-[#71717A]">
                          {doc.directory}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#71717A] font-mono">
                        <span className="text-[#C4A678] font-bold">{doc.fileType}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.updatedAt}</span>
                        {doc.topic && (
                          <>
                            <span>•</span>
                            <span className="text-[#1A1A1A] font-medium">{doc.topic}</span>
                          </>
                        )}
                        {doc.solvedStatus && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[10px]">
                              {doc.solvedStatus}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewDocument(doc);
                      }}
                      className="p-2 text-[#71717A] hover:text-[#1A1A1A] hover:bg-white rounded-full border border-transparent hover:border-[#EBE8E1] transition-colors"
                      title="Preview document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDownload(e, doc)}
                      className={`p-2 rounded-full border transition-colors ${
                        downloadedDocId === doc.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'border-[#EBE8E1] bg-white text-[#71717A] hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
                      }`}
                      title="Download PDF"
                    >
                      {downloadedDocId === doc.id ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* GRID VIEW */
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onPreviewDocument(doc)}
                  className="tactile-card p-5 rounded-xl border border-[#EBE8E1] hover:border-[#1A1A1A] transition-all cursor-pointer flex flex-col justify-between h-52 group bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF7F0] border border-[#EBE8E1] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-[#FAF7F0] px-2.5 py-0.5 rounded-full border border-[#EBE8E1] text-[#71717A]">
                        {doc.directory}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A] font-serif group-hover:text-[#C4A678] line-clamp-2 transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-[#52525B] line-clamp-2 mt-1">
                      {doc.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#EBE8E1] text-[11px] font-mono text-[#71717A]">
                    <span className="text-[#C4A678] font-bold">
                      {doc.fileType} · {doc.size}
                    </span>
                    <div className="flex items-center gap-1 text-[#1A1A1A] font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="p-16 text-center">
            <BookOpen className="w-10 h-10 text-[#A1A1AA] mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">
              No documents found for this selection
            </h3>
            <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
              Try choosing a different topic or resetting filters to see all available syllabus
              archives.
            </p>
            <button
              onClick={() => {
                setActiveDirectory('all');
                setSelectedTopic('all');
                setDocSearchFilter('');
              }}
              className="mt-4 px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-[#C4A678] transition-colors"
            >
              Show All {selectedSubject.name} Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
