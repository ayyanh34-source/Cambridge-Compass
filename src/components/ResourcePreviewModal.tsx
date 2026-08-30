import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Clock } from 'lucide-react';
import { ResourceDocument } from '../types';
import { getResourceUrl } from '../lib/resources';
import confetti from 'canvas-confetti';

interface ResourcePreviewModalProps {
  document: ResourceDocument | null;
  onClose: () => void;
}

export const ResourcePreviewModal: React.FC<ResourcePreviewModalProps> = ({
  document: doc,
  onClose,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!doc) return null;

  const handleDownload = async () => {
    setDownloadSuccess(true);
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.85 },
      colors: ['#1A1A1A', '#C4A678', '#FAF7F0'],
    });

    try {
      const url = getResourceUrl(doc.filePath);
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

    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-[90] bg-[#1A1A1A]/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFCF9] rounded-2xl border border-[#EBE8E1] shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE8E1] bg-white">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#EBE8E1] text-[#1A1A1A] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#C4A678]" />
            </div>
            <div className="truncate">
              <h2 className="text-base font-serif font-bold text-[#1A1A1A] truncate">{doc.title}</h2>
              <p className="text-[11px] font-mono text-[#71717A]">
                {doc.subjectName} • {doc.categoryLabel}
                {doc.subfolder ? ` • ${doc.subfolder}` : ''}
                {doc.year ? ` • ${doc.year}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#71717A] hover:text-[#1A1A1A] hover:bg-[#FAF7F0] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center gap-4 bg-[#FAF7F0]">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#EBE8E1] flex items-center justify-center shadow-xs">
            <FileText className="w-8 h-8 text-[#C4A678]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">{doc.title}</h3>
            <p className="text-xs text-[#71717A] font-mono mt-1">
              {doc.categoryLabel}
              {doc.subfolder ? ` — ${doc.subfolder}` : ''}
            </p>
          </div>

          <button
            onClick={handleDownload}
            className={`flex items-center space-x-1.5 px-6 py-2.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all ${downloadSuccess
                ? 'bg-emerald-800 text-white'
                : 'bg-[#1A1A1A] hover:bg-[#C4A678] hover:text-[#1A1A1A] text-white shadow-xs'
              }`}
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <a
            href={getResourceUrl(doc.filePath)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-[#71717A] hover:text-[#1A1A1A] underline flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            Open in new tab instead
          </a>
        </div>
      </div>
    </div>
  );
};
