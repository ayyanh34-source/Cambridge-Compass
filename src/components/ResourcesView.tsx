import React, { useState, useEffect } from 'react';
import { Subject, ResourceDocument, CategorySlug, CATEGORY_LABELS } from '../types';
import { useSubjects } from '../hooks/useSubjects';
import { useSubjectResources } from '../hooks/useSubjectResources';
import { getResourceUrl } from '../lib/resources';
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
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResourcesViewProps {
  selectedSubject?: Subject | null;
  onSelectSubject?: (subject: Subject | null) => void;
  onPreviewDocument?: (doc: ResourceDocument) => void;
}

// Splits a doc's subfolder label ("History / Ch 3") into path segments ["History", "Ch 3"].
// Docs with no subfolder live at the root (empty array).
function getSegments(doc: ResourceDocument): string[] {
  return doc.subfolder ? doc.subfolder.split(' / ').map((s) => s.trim()) : [];
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  selectedSubject = null,
  onSelectSubject = (_s?: Subject | null) => { },
  onPreviewDocument = (_doc?: ResourceDocument) => { },
}) => {
  const { subjects, loading: subjectsLoading, error: subjectsError } = useSubjects();
  const { resources, loading: resourcesLoading } = useSubjectResources(selectedSubject?.id ?? null);

  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const [folderPath, setFolderPath] = useState<string[]>([]);
  const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list');
  const [docSearchFilter, setDocSearchFilter] = useState('');
  const [downloadedDocId, setDownloadedDocId] = useState<string | null>(null);
  const [subjectSearch, setSubjectSearch] = useState('');

  // Reset folder navigation whenever the category changes
  useEffect(() => {
    setFolderPath([]);
  }, [activeCategory, selectedSubject?.id]);

  const filteredSubjects = subjects.filter((sub) => {
    return (
      sub.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      (sub.syllabusCode ?? '').toLowerCase().includes(subjectSearch.toLowerCase())
    );
  });

  const categoryDocs = resources.filter((doc) =>
    activeCategory === 'all' ? true : doc.categorySlug === activeCategory
  );

  const isSearching = docSearchFilter.trim().length > 0;

  // When searching, ignore folder navigation and just flat-filter everything in the active category
  const searchResults = isSearching
    ? categoryDocs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(docSearchFilter.toLowerCase()) ||
        (doc.subfolder ?? '').toLowerCase().includes(docSearchFilter.toLowerCase())
    )
    : [];

  // Folder browsing: only docs whose subfolder path starts with the current folderPath are "in scope"
  const inScope = categoryDocs.filter((doc) => {
    const segs = getSegments(doc);
    return folderPath.every((p, i) => segs[i] === p);
  });

  // Files that live exactly at the current folder depth
  const filesHere = inScope.filter((doc) => getSegments(doc).length === folderPath.length);

  // Subfolders visible one level below the current depth
  const folderNames = Array.from(
    new Set(
      inScope
        .filter((doc) => getSegments(doc).length > folderPath.length)
        .map((doc) => getSegments(doc)[folderPath.length])
    )
  ).sort();

  const folderCounts = folderNames.map((name) => ({
    name,
    count: inScope.filter((doc) => getSegments(doc)[folderPath.length] === name).length,
  }));

  const handleDownload = async (e: React.MouseEvent, doc: ResourceDocument) => {
    e.stopPropagation();
    setDownloadedDocId(doc.id);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#1A1A1A', '#C4A678'],
    });

    try {
      const url = getResourceUrl(doc.filePath, doc.fileSizeBytes);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = blobUrl;
      a.download = doc.filePath.split('/').pop() ?? `${doc.title}.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }

    setTimeout(() => setDownloadedDocId(null), 2500);
  };

  const handleOpenSubject = (subject: Subject) => {
    onSelectSubject(subject);
    setActiveCategory('all');
    setFolderPath([]);
    setDocSearchFilter('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderDocRow = (doc: ResourceDocument) => (
    <div
      key={doc.id}
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
              {doc.categoryLabel}
            </span>
          </div>
          {isSearching && doc.subfolder && (
            <div className="mt-1 text-[11px] text-[#71717A] font-mono">{doc.subfolder}</div>
          )}
          {doc.year && (
            <div className="mt-1 text-[11px] text-[#71717A] font-mono">{doc.year}</div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreviewDocument(doc);
          }}
          className="p-2 text-[#71717A] hover:text-[#1A1A1A] hover:bg-white rounded-full border border-transparent hover:border-[#EBE8E1] transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => handleDownload(e, doc)}
          className={`p-2 rounded-full border transition-colors ${downloadedDocId === doc.id
              ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
              : 'border-[#EBE8E1] bg-white text-[#71717A] hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
            }`}
        >
          {downloadedDocId === doc.id ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  if (!selectedSubject) {
    return (
      <div
        id="resources-subjects-grid-page"
        className="flex-grow max-w-[1240px] w-full mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12 animate-fade-in"
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE8E1] pb-4">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#71717A]">
            <span>Archival Vault</span>
            <ChevronRight className="w-3 h-3 text-[#A1A1AA]" />
            <span className="text-[#1A1A1A] font-bold">Curriculum Index</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C4A678] bg-[#FAF7F0] border border-[#C4A678]/30 px-3 py-0.5 rounded-full self-start sm:self-auto font-semibold">
            {subjects.length} Syllabi Available
          </span>
        </div>

        <div className="mb-10 text-center sm:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div>
            <span className="sans-micro text-[#C4A678] block mb-1.5">
              Curriculum Directory // Select a Subject
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
              Subject Resource Archives
            </h1>
            <p className="text-xs sm:text-sm text-[#52525B] mt-2 max-w-2xl leading-relaxed">
              Explore syllabus-aligned notes, books, practice materials, and helpful resources.
              Choose any subject below to enter its dedicated resource repository.
            </p>
          </div>

          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              placeholder="Search subjects..."
              className="w-full h-11 pl-10 pr-4 text-xs font-mono bg-white border border-[#EBE8E1] rounded-full placeholder-[#A1A1AA] focus:border-[#1A1A1A] outline-none shadow-2xs transition-colors"
            />
          </div>
        </div>

        {subjectsLoading && (
          <div className="p-16 text-center text-[#71717A] text-sm font-mono">Loading subjects...</div>
        )}

        {subjectsError && (
          <div className="p-16 text-center text-red-600 text-sm font-mono">
            Failed to load subjects: {subjectsError}
          </div>
        )}

        {!subjectsLoading && !subjectsError && (
          <div
            id="subjects-overview-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSubjects.map((subject) => (
              <div
                key={subject.id}
                id={`subject-grid-card-${subject.id}`}
                onClick={() => handleOpenSubject(subject)}
                className="tactile-card group cursor-pointer rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between h-[260px] bg-white border border-[#EBE8E1] hover:border-[#1A1A1A] transition-all duration-200 shadow-xs hover:shadow-md"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    {subject.syllabusCode && (
                      <div className="flex items-center text-[10px] font-mono font-bold tracking-[0.2em] text-[#71717A] uppercase">
                        <span className="w-2 h-2 rounded-full bg-[#C4A678] mr-2"></span>
                        CODE [{subject.syllabusCode}]
                      </div>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] group-hover:text-[#C4A678] transition-colors mb-3">
                    {subject.name}
                  </h2>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {subject.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF7F0] border border-[#EBE8E1] text-[#71717A]"
                      >
                        <Folder className="w-2.5 h-2.5 text-[#C4A678]" />
                        {cat.name}
                      </span>
                    ))}
                    {subject.categories.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md text-[#A1A1AA]">
                        +{subject.categories.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#EBE8E1] mt-auto text-xs font-medium text-[#71717A]">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#71717A]">
                    {subject.documentCount} Documents
                  </span>
                  <div className="flex items-center gap-1.5 text-[#1A1A1A] text-[11px] font-mono uppercase tracking-wider font-bold group-hover:text-[#C4A678] group-hover:translate-x-1 transition-all">
                    <span>Open Directory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!subjectsLoading && filteredSubjects.length === 0 && (
          <div className="p-16 text-center bg-white rounded-2xl border border-[#EBE8E1] mt-6">
            <BookOpen className="w-10 h-10 text-[#A1A1AA] mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">
              No subjects matching "{subjectSearch}"
            </h3>
            <button
              onClick={() => setSubjectSearch('')}
              className="mt-4 px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-[#C4A678] transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id="resources-subject-directory-view"
      className="flex-grow max-w-[1240px] w-full mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12 animate-fade-in"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE8E1] pb-4">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#71717A]">
          <button
            onClick={() => onSelectSubject(null)}
            className="hover:text-[#1A1A1A] hover:underline flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>All Subjects</span>
          </button>
          <ChevronRight className="w-3 h-3 text-[#A1A1AA]" />
          <span className="text-[#1A1A1A] font-bold">
            {selectedSubject.name}
            {selectedSubject.syllabusCode ? ` [${selectedSubject.syllabusCode}]` : ''}
          </span>
        </div>

        <button
          onClick={() => onSelectSubject(null)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EBE8E1] bg-white text-[#1A1A1A] text-[11px] font-mono uppercase tracking-wider hover:border-[#1A1A1A] hover:bg-[#FAF7F0] transition-colors self-start sm:self-auto shadow-2xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Switch Subject</span>
        </button>
      </div>

      <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-[#FAF7F0] border border-[#EBE8E1] relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            {selectedSubject.syllabusCode && (
              <span className="text-[10px] font-mono text-[#71717A] tracking-widest uppercase block mb-2">
                CODE [{selectedSubject.syllabusCode}]
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">
              {selectedSubject.name} Directory
            </h1>
          </div>

          <div className="px-4 py-2 bg-white rounded-xl border border-[#EBE8E1] text-center shadow-2xs self-start md:self-center">
            <span className="block text-lg font-serif font-bold text-[#1A1A1A]">
              {selectedSubject.documentCount}
            </span>
            <span className="text-[10px] font-mono uppercase text-[#71717A]">Curated Docs</span>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${activeCategory === 'all'
                ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                : 'bg-white border border-[#EBE8E1] text-[#52525B] hover:text-[#1A1A1A] hover:bg-[#FAF7F0]'
              }`}
          >
            All Categories ({resources.length})
          </button>

          {selectedSubject.categories.map((cat) => {
            const count = resources.filter((d) => d.categorySlug === cat.slug).length;
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 ${isActive
                    ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                    : 'bg-white border border-[#EBE8E1] text-[#52525B] hover:text-[#1A1A1A] hover:bg-[#FAF7F0]'
                  }`}
              >
                <Folder className={`w-3 h-3 ${isActive ? 'text-[#C4A678] fill-[#C4A678]' : 'text-[#71717A]'}`} />
                <span>{cat.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#262626] text-[#C4A678]' : 'text-[#A1A1AA]'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 justify-end">
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
              className={`p-1.5 rounded-full transition-colors ${viewLayout === 'list' ? 'bg-[#1A1A1A] text-white' : 'text-[#71717A] hover:text-[#1A1A1A]'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-full transition-colors ${viewLayout === 'grid' ? 'bg-[#1A1A1A] text-white' : 'text-[#71717A] hover:text-[#1A1A1A]'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBE8E1] shadow-xs overflow-hidden">
        {/* Breadcrumb / folder path bar — hidden while searching */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#EBE8E1] bg-[#FAF7F0] text-xs font-mono text-[#71717A]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Folder className="w-3.5 h-3.5 text-[#C4A678] flex-shrink-0" />
            {isSearching ? (
              <span className="font-semibold text-[#1A1A1A]">
                Search results in {activeCategory === 'all' ? 'All Categories' : CATEGORY_LABELS[activeCategory]}
              </span>
            ) : (
              <>
                <button
                  onClick={() => setFolderPath([])}
                  className={`font-semibold hover:underline ${folderPath.length === 0 ? 'text-[#1A1A1A]' : 'text-[#71717A]'}`}
                >
                  {activeCategory === 'all' ? 'All Categories' : CATEGORY_LABELS[activeCategory]}
                </button>
                {folderPath.map((segment, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3 h-3 text-[#A1A1AA] flex-shrink-0" />
                    <button
                      onClick={() => setFolderPath(folderPath.slice(0, idx + 1))}
                      className={`hover:underline ${idx === folderPath.length - 1 ? 'text-[#1A1A1A] font-semibold' : 'text-[#71717A]'}`}
                    >
                      {segment}
                    </button>
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
          <span>
            [{isSearching ? searchResults.length : folderCounts.reduce((a, f) => a + f.count, 0) + filesHere.length} items]
          </span>
        </div>

        {resourcesLoading ? (
          <div className="p-16 text-center text-[#71717A] text-sm font-mono">Loading documents...</div>
        ) : isSearching ? (
          searchResults.length > 0 ? (
            <div className="divide-y divide-[#EBE8E1]">{searchResults.map(renderDocRow)}</div>
          ) : (
            <div className="p-16 text-center">
              <BookOpen className="w-10 h-10 text-[#A1A1AA] mx-auto mb-3" />
              <h3 className="text-base font-serif font-bold text-[#1A1A1A]">No documents found</h3>
            </div>
          )
        ) : (
          <>
            {/* Folder cards for the current depth */}
            {folderCounts.length > 0 && (
              <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 border-b border-[#EBE8E1]">
                {folderCounts.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setFolderPath([...folderPath, f.name])}
                    className="flex items-center gap-2.5 p-3.5 rounded-xl border border-[#EBE8E1] bg-[#FAF7F0] hover:bg-white hover:border-[#1A1A1A] transition-all text-left group"
                  >
                    <Folder className="w-5 h-5 text-[#C4A678] flex-shrink-0 fill-[#C4A678]/20" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#1A1A1A] truncate group-hover:text-[#C4A678]">
                        {f.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#71717A]">{f.count} items</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Files at the current depth */}
            {filesHere.length > 0 ? (
              <div className="divide-y divide-[#EBE8E1]">{filesHere.map(renderDocRow)}</div>
            ) : folderCounts.length === 0 ? (
              <div className="p-16 text-center">
                <BookOpen className="w-10 h-10 text-[#A1A1AA] mx-auto mb-3" />
                <h3 className="text-base font-serif font-bold text-[#1A1A1A]">This folder is empty</h3>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default ResourcesView;

