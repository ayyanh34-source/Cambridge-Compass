import React, { useState } from 'react';
import { X, Download, Bookmark, ZoomIn, ZoomOut, FileText, CheckCircle2, BookOpen, Clock, FileCheck } from 'lucide-react';
import { ResourceDocument } from '../types';
import confetti from 'canvas-confetti';

interface ResourcePreviewModalProps {
  document: ResourceDocument | null;
  onClose: () => void;
  onBookmarkToggle?: (docId: string) => void;
  isBookmarked?: boolean;
}

export const ResourcePreviewModal: React.FC<ResourcePreviewModalProps> = ({
  document: doc,
  onClose,
  onBookmarkToggle,
  isBookmarked = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activePage, setActivePage] = useState(1);

  if (!doc) return null;

  const handleDownload = () => {
    setDownloadSuccess(true);
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.85 },
      colors: ['#1A1A1A', '#C4A678', '#FAF7F0'],
    });

    // Create a mock download blob trigger
    const blob = new Blob([
      `%PDF-1.4\n% Cambridge Compass Scholarly Archive: ${doc.title}\n% Syllabus: ${doc.syllabusCode} (${doc.subjectName})\n% Category: ${doc.directory}\n% Description: ${doc.description}\n\n[Verified CAIE Preparation Manuscript]`
    ], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = doc.filename;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const totalPages = doc.pageCount || 12;

  return (
    <div
      id="resource-preview-modal"
      className="fixed inset-0 z-[90] bg-[#1A1A1A]/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFCF9] rounded-2xl border border-[#EBE8E1] shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE8E1] bg-white">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#EBE8E1] text-[#1A1A1A] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#C4A678]" />
            </div>
            <div className="truncate">
              <h2 className="text-base font-serif font-bold text-[#1A1A1A] truncate">{doc.title}</h2>
              <p className="text-[11px] font-mono text-[#71717A]">
                {doc.subjectName} • Syllabus [{doc.syllabusCode}] • {doc.directory} • {doc.size}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Zoom controls */}
            <div className="hidden sm:flex items-center space-x-1 bg-[#FAF7F0] border border-[#EBE8E1] rounded-full px-2.5 py-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                className="p-1 hover:text-[#1A1A1A] text-[#71717A] rounded-full"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono px-1 min-w-[36px] text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1 hover:text-[#1A1A1A] text-[#71717A] rounded-full"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(doc.id)}
                className={`p-2 rounded-full border border-[#EBE8E1] transition-colors ${
                  isBookmarked
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#71717A] hover:text-[#1A1A1A] hover:bg-[#FAF7F0]'
                }`}
                title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark resource'}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}

            <button
              id="download-doc-modal-btn"
              onClick={handleDownload}
              className={`flex items-center space-x-1.5 px-5 py-2 text-xs font-mono uppercase tracking-wider rounded-full transition-all ${
                downloadSuccess
                  ? 'bg-emerald-800 text-white'
                  : 'bg-[#1A1A1A] hover:bg-[#C4A678] hover:text-[#1A1A1A] text-white shadow-xs'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Archived</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#71717A] hover:text-[#1A1A1A] hover:bg-[#FAF7F0] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Document Reader Simulation */}
        <div className="flex-grow flex overflow-hidden bg-[#FAF7F0]">
          {/* Document Content Sheet */}
          <div className="flex-grow overflow-y-auto p-4 md:p-8 flex justify-center items-start">
            <div
              className="bg-white rounded-xl border border-[#EBE8E1] shadow-md p-8 md:p-12 w-full max-w-3xl min-h-[750px] transition-transform duration-200 origin-top flex flex-col justify-between"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* PDF Header Stamp */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#EBE8E1]">
                  <div>
                    <span className="sans-micro text-[#C4A678] block">
                      CAMBRIDGE INTERNATIONAL EXAMINATIONS • O LEVEL
                    </span>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1A1A1A] mt-1">
                      {doc.subjectName} [{doc.syllabusCode}]
                    </h1>
                    <p className="text-xs text-[#71717A] font-mono mt-0.5">
                      Archival Reference: {doc.filename} • {doc.directory}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-semibold rounded-full bg-[#FAF7F0] border border-[#EBE8E1] text-[#1A1A1A]">
                      {doc.solvedStatus || 'Official Specimen'}
                    </span>
                    <span className="block text-[10px] font-mono text-[#71717A] mt-1">
                      Folio {activePage} of {totalPages}
                    </span>
                  </div>
                </div>

                {/* Document Overview */}
                <div className="my-6 p-4 rounded-xl bg-[#FAF7F0] border border-[#EBE8E1] text-xs text-[#52525B] leading-relaxed">
                  <span className="font-serif font-bold text-[#1A1A1A] block mb-1">Archival Abstract:</span>
                  {doc.description}
                </div>

                {/* Structured Mock Academic Content */}
                <div className="space-y-6 text-sm text-[#1A1A1A] leading-relaxed">
                  <div className="border-l-2 border-[#1A1A1A] pl-4 py-1">
                    <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                      Core Syllabus Objectives & Examination Scope
                    </h3>
                    <p className="text-xs text-[#71717A] mt-1 font-mono">
                      Targeted for candidates aiming for distinction marks in Cambridge examinations.
                    </p>
                  </div>

                  {doc.previewSnippet ? (
                    <div className="space-y-3 bg-[#FAF7F0] p-5 rounded-xl border border-[#EBE8E1]">
                      <h4 className="sans-micro text-[#1A1A1A] flex items-center gap-1.5 font-bold">
                        <BookOpen className="w-3.5 h-3.5 text-[#C4A678]" /> Essential Equations & Working Steps:
                      </h4>
                      {doc.previewSnippet.map((line, idx) => (
                        <div key={idx} className="p-3 bg-white border border-[#EBE8E1] rounded-lg font-mono text-xs text-[#1A1A1A] shadow-xs">
                          {line}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-[#FAF7F0] border border-[#EBE8E1] rounded-xl">
                        <h4 className="font-serif font-bold text-[#1A1A1A] text-xs mb-1">Section I: Rigorous Definitions & Theoretical Constructs</h4>
                        <p className="text-xs text-[#71717A] leading-relaxed">
                          Comprehensive step-by-step mathematical proofs, qualitative observation tables, experimental setups, and examiner guidance.
                        </p>
                      </div>
                      <div className="p-4 bg-[#FAF7F0] border border-[#EBE8E1] rounded-xl">
                        <h4 className="font-serif font-bold text-[#1A1A1A] text-xs mb-1">Section II: Topical Examination Drill Problems</h4>
                        <p className="text-xs text-[#71717A] leading-relaxed">
                          Includes mark breakdown (1m, 2m, 4m questions), common misconceptions flagged by examiners, and fully worked marking keys.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-xl border border-dashed border-[#C4A678] bg-white flex items-start gap-3 shadow-2xs">
                    <FileCheck className="w-5 h-5 text-[#C4A678] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#52525B]">
                      <span className="font-serif font-bold text-[#1A1A1A]">Chief Examiner Note:</span> Full marks require explicit stepwise working and correct standard SI units. Download the full manuscript for high-resolution printable worksheets and full mark schemes.
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Footer Stamp */}
              <div className="pt-6 border-t border-[#EBE8E1] mt-8 flex items-center justify-between text-[10px] text-[#71717A] font-mono uppercase tracking-wider">
                <span>© Cambridge Compass Scholarly Archive</span>
                <span>Folio {activePage} / {totalPages}</span>
                <span>{doc.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 border-t border-[#EBE8E1] bg-white flex items-center justify-between text-xs text-[#71717A]">
          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#C4A678]" />
            <span>Updated {doc.updatedAt}</span>
            <span>•</span>
            <span>{doc.downloadCount.toLocaleString()} accessions</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="sans-micro text-[#71717A]">Folio:</span>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setActivePage(pg)}
                  className={`w-6 h-6 rounded-full text-xs font-mono transition-colors ${
                    activePage === pg
                      ? 'bg-[#1A1A1A] text-white font-bold'
                      : 'bg-[#FAF7F0] hover:bg-[#EBE8E1] text-[#71717A]'
                  }`}
                >
                  {pg}
                </button>
              ))}
              {totalPages > 5 && <span className="px-1 text-[#71717A] font-mono">...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
