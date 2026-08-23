import React, { useState } from 'react';
import { RESOURCE_DOCUMENTS } from '../data/mockData';
import { ResourceDocument } from '../types';
import { FileText, ChevronDown, Download, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WhatsNewViewProps {
  onPreviewDocument: (doc: ResourceDocument) => void;
}

export const WhatsNewView: React.FC<WhatsNewViewProps> = ({ onPreviewDocument }) => {
  const [showOlder, setShowOlder] = useState(false);

  const recentlyAdded = RESOURCE_DOCUMENTS.filter((d) => d.uploadGroup === 'recently_added');
  const lastWeek = RESOURCE_DOCUMENTS.filter((d) => d.uploadGroup === 'last_week');
  const earlier = RESOURCE_DOCUMENTS.filter((d) => d.uploadGroup === 'earlier');

  const handleDownload = (e: React.MouseEvent, doc: ResourceDocument) => {
    e.stopPropagation();
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#1A1A1A', '#C4A678'],
    });

    const blob = new Blob([`%PDF-1.4\nCambridge Compass: ${doc.title}`], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = doc.filename;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="whats-new-view" className="flex-grow max-w-[1200px] w-full mx-auto px-4 sm:px-8 md:px-16 py-12 md:py-20">
      {/* Header */}
      <div className="mb-12 md:mb-16 pb-8 border-b border-[#EBE8E1]">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#C4A678] animate-pulse"></span>
          <span className="sans-micro text-[#C4A678]">
            Live Archival Changelog // Vol 01
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A1A] tracking-tight mb-4">
          What's New
        </h1>
        <p className="text-sm sm:text-base text-[#52525B] max-w-2xl leading-relaxed">
          A chronological accession register of recent additions, revised mark schemes, and verified specimen papers.
        </p>
      </div>

      {/* Changelog Sections */}
      <div className="space-y-12 max-w-4xl">
        {/* RECENTLY ADDED */}
        <div>
          <span className="sans-micro text-[#71717A] block mb-3">
            Accessions // Recently Added
          </span>
          <div className="bg-white rounded-xl border border-[#EBE8E1] shadow-xs divide-y divide-[#EBE8E1] overflow-hidden">
            {recentlyAdded.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onPreviewDocument(doc)}
                className="group p-5 sm:px-6 hover:bg-[#FAF7F0] transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-4 min-w-0 pr-4">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF7F0] border border-[#EBE8E1] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#1A1A1A] font-serif group-hover:text-[#C4A678] transition-colors truncate">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-[#71717A] mt-0.5 font-mono">
                      {doc.updatedAt} • Code [{doc.syllabusCode}] • {doc.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewDocument(doc);
                    }}
                    className="p-2 text-[#71717A] hover:text-[#1A1A1A] rounded-full hover:bg-white transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDownload(e, doc)}
                    className="p-2 text-[#71717A] hover:text-[#1A1A1A] rounded-full hover:bg-white transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LAST WEEK */}
        <div>
          <span className="sans-micro text-[#71717A] block mb-3">
            Accessions // Last Week
          </span>
          <div className="bg-white rounded-xl border border-[#EBE8E1] shadow-xs divide-y divide-[#EBE8E1] overflow-hidden">
            {lastWeek.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onPreviewDocument(doc)}
                className="group p-5 sm:px-6 hover:bg-[#FAF7F0] transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-4 min-w-0 pr-4">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF7F0] border border-[#EBE8E1] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#1A1A1A] font-serif group-hover:text-[#C4A678] transition-colors truncate">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-[#71717A] mt-0.5 font-mono">
                      {doc.updatedAt} • Code [{doc.syllabusCode}] • {doc.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewDocument(doc);
                    }}
                    className="p-2 text-[#71717A] hover:text-[#1A1A1A] rounded-full hover:bg-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDownload(e, doc)}
                    className="p-2 text-[#71717A] hover:text-[#1A1A1A] rounded-full hover:bg-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EARLIER THIS MONTH (Collapsible) */}
        {showOlder && (
          <div className="animate-fade-in">
            <span className="sans-micro text-[#71717A] block mb-3">
              Accessions // Earlier Records
            </span>
            <div className="bg-white rounded-xl border border-[#EBE8E1] shadow-xs divide-y divide-[#EBE8E1] overflow-hidden">
              {earlier.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onPreviewDocument(doc)}
                  className="group p-5 sm:px-6 hover:bg-[#FAF7F0] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-4 min-w-0 pr-4">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF7F0] border border-[#EBE8E1] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#1A1A1A] font-serif group-hover:text-[#C4A678] transition-colors truncate">
                        {doc.title}
                      </h3>
                      <p className="text-[11px] text-[#71717A] mt-0.5 font-mono">
                        {doc.updatedAt} • Code [{doc.syllabusCode}] • {doc.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewDocument(doc);
                      }}
                      className="p-2 text-[#71717A] hover:text-[#1A1A1A] rounded-full hover:bg-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDownload(e, doc)}
                      className="p-2 text-[#71717A] hover:text-[#1A1A1A] rounded-full hover:bg-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load Older Updates Button */}
        <div className="pt-4 text-center">
          <button
            id="load-older-updates-btn"
            onClick={() => setShowOlder(!showOlder)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-[#EBE8E1] hover:border-[#1A1A1A] text-[#1A1A1A] rounded-full text-xs font-mono uppercase tracking-[0.18em] hover:bg-[#FAF7F0] transition-all shadow-xs active:scale-95"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showOlder ? 'rotate-180' : ''}`} />
            <span>{showOlder ? 'Hide Historical Records' : 'Load Historical Records'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
