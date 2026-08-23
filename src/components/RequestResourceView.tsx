import React, { useState } from 'react';
import { ResourceRequest } from '../types';
import { BookOpen, Library, Send, History, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequestResourceViewProps {
  requests: ResourceRequest[];
  onSubmitRequest: (newReq: ResourceRequest) => void;
  userEmail: string;
}

export const RequestResourceView: React.FC<RequestResourceViewProps> = ({
  requests,
  onSubmitRequest,
  userEmail,
}) => {
  const [subjectType, setSubjectType] = useState<'existing' | 'new'>('existing');
  const [subjectName, setSubjectName] = useState('');
  const [requestDetails, setRequestDetails] = useState('');
  const [categoryTag, setCategoryTag] = useState('Topical Past Papers');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const dateStr = `Logged ${now.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })}`;

      const newRequest: ResourceRequest = {
        id: `req-${Date.now()}`,
        subjectType,
        subjectName: subjectName.trim(),
        details:
          requestDetails.trim() ||
          (subjectType === 'new'
            ? 'New subject syllabus addition request.'
            : `${categoryTag} curated materials request.`),
        categoryTag,
        requestedAt: dateStr,
        status: 'In Progress',
        requesterEmail: userEmail || 'student@cambridgecompass.org',
      };

      onSubmitRequest(newRequest);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#1A1A1A', '#C4A678', '#10B981'],
      });

      setTimeout(() => {
        setSubmitSuccess(false);
        setSubjectName('');
        setRequestDetails('');
      }, 3500);
    }, 1000);
  };

  return (
    <div id="request-resource-view" className="flex-grow max-w-[1200px] w-full mx-auto px-4 sm:px-8 md:px-16 py-12 md:py-20">
      {/* Header */}
      <div className="mb-10 md:mb-16 pb-8 border-b border-[#EBE8E1]">
        <span className="sans-micro text-[#C4A678] block mb-2">Petitions & Accession Requests</span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A1A] tracking-tight mb-4">
          Request Resource
        </h1>
        <p className="text-sm sm:text-base text-[#52525B] max-w-2xl leading-relaxed">
          Can't find what you're looking for? Lodge a formal request with our academic curatorial team to source verified syllabus materials.
        </p>
      </div>

      {/* Grid Layout: Form on Left, History Sidebar on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Request Form */}
        <div className="col-span-1 lg:col-span-8">
          <div className="bg-white border border-[#EBE8E1] rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Resource Category Toggle Radio Cards */}
              <fieldset className="space-y-3">
                <legend className="sans-micro text-[#1A1A1A] mb-2 block">
                  Category Type
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Existing Subject */}
                  <label
                    id="radio-existing-subject"
                    onClick={() => setSubjectType('existing')}
                    className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
                      subjectType === 'existing'
                        ? 'border-[#1A1A1A] bg-[#FAF7F0] shadow-xs'
                        : 'border-[#EBE8E1] bg-white hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="subjectType"
                      value="existing"
                      checked={subjectType === 'existing'}
                      onChange={() => setSubjectType('existing')}
                      className="sr-only"
                    />
                    <div className="flex flex-col gap-1 pr-6">
                      <span className="text-sm font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#C4A678]" />
                        Existing Coordinate
                      </span>
                      <span className="text-xs text-[#71717A]">
                        Materials for a subject already present in our archive.
                      </span>
                    </div>
                    {subjectType === 'existing' && (
                      <div className="absolute top-4 right-4 text-[#1A1A1A]">
                        <CheckCircle2 className="w-5 h-5 fill-[#1A1A1A] text-white" />
                      </div>
                    )}
                  </label>

                  {/* Card 2: New Subject */}
                  <label
                    id="radio-new-subject"
                    onClick={() => setSubjectType('new')}
                    className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
                      subjectType === 'new'
                        ? 'border-[#1A1A1A] bg-[#FAF7F0] shadow-xs'
                        : 'border-[#EBE8E1] bg-white hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="subjectType"
                      value="new"
                      checked={subjectType === 'new'}
                      onChange={() => setSubjectType('new')}
                      className="sr-only"
                    />
                    <div className="flex flex-col gap-1 pr-6">
                      <span className="text-sm font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                        <Library className="w-4 h-4 text-[#C4A678]" />
                        New Syllabus
                      </span>
                      <span className="text-xs text-[#71717A]">
                        Request an entirely new syllabus not yet cataloged.
                      </span>
                    </div>
                    {subjectType === 'new' && (
                      <div className="absolute top-4 right-4 text-[#1A1A1A]">
                        <CheckCircle2 className="w-5 h-5 fill-[#1A1A1A] text-white" />
                      </div>
                    )}
                  </label>
                </div>
              </fieldset>

              {/* Subject Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="subjectName"
                  className="sans-micro text-[#1A1A1A] block"
                >
                  {subjectType === 'existing' ? 'Subject Name & Code' : 'Full Subject & Syllabus Code'}
                </label>
                <input
                  id="subjectName"
                  type="text"
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder={
                    subjectType === 'existing'
                      ? 'e.g. Physics [5054] or Mathematics [4024]'
                      : 'e.g. Environmental Management [5014]'
                  }
                  className="w-full h-12 bg-[#FAF7F0] border border-[#EBE8E1] rounded-xl px-4 text-sm font-mono text-[#1A1A1A] placeholder-[#A1A1AA] input-focus-ring transition-shadow"
                />
              </div>

              {/* Resource Type Category Pills */}
              <div className="space-y-2">
                <label className="sans-micro text-[#1A1A1A] block">
                  Material Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Topical Past Papers',
                    'Revision Notes',
                    'Marking Schemes',
                    'Yearly Papers',
                    'Worksheets & Solved Examples',
                    'Syllabus & Guide',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCategoryTag(tag)}
                      className={`text-[11px] font-mono uppercase tracking-wider px-3.5 py-2 rounded-full border transition-all ${
                        categoryTag === tag
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold'
                          : 'bg-[#FAF7F0] text-[#71717A] border-[#EBE8E1] hover:bg-white hover:text-[#1A1A1A]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Request Details Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="requestDetails"
                    className="sans-micro text-[#1A1A1A]"
                  >
                    Request Details
                  </label>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA]">Optional</span>
                </div>
                <textarea
                  id="requestDetails"
                  rows={4}
                  value={requestDetails}
                  onChange={(e) => setRequestDetails(e.target.value)}
                  placeholder="Specify topic numbers, exam years, or specific chapters needed. Precision aids swift curation."
                  className="w-full bg-[#FAF7F0] border border-[#EBE8E1] rounded-xl p-4 text-sm text-[#1A1A1A] placeholder-[#A1A1AA] input-focus-ring transition-shadow resize-y"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-[#EBE8E1] gap-4">
                <p className="text-xs text-[#71717A]">
                  Archival curation reviews are conducted on a 48-hour cycle.
                </p>

                <button
                  type="submit"
                  id="submit-request-btn"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 text-xs font-mono uppercase tracking-[0.18em] rounded-full transition-all duration-200 shadow-sm active:scale-[0.98] ${
                    submitSuccess
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-[#1A1A1A] hover:bg-[#C4A678] hover:text-[#1A1A1A] text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Logging Request...</span>
                    </>
                  ) : submitSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Petition Logged!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Lodge Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Request History Sidebar */}
        <aside className="col-span-1 lg:col-span-4">
          <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#EBE8E1] flex flex-col h-full shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBE8E1]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#C4A678]" />
                <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Request History
                </h2>
              </div>
              <span className="bg-white text-[#71717A] font-mono text-[11px] px-2.5 py-1 rounded-full border border-[#EBE8E1]">
                [{requests.length} Items]
              </span>
            </div>

            <div className="space-y-3.5 flex-grow overflow-y-auto max-h-[600px] pr-1">
              {requests.map((item) => {
                const statusColor =
                  item.status === 'Fulfilled'
                    ? 'bg-emerald-500'
                    : item.status === 'In Progress'
                    ? 'bg-[#C4A678]'
                    : item.status === 'Under Review'
                    ? 'bg-blue-500'
                    : 'bg-[#71717A]';

                const isClosed = item.status === 'Closed';

                return (
                  <div
                    key={item.id}
                    className={`p-4 bg-white rounded-xl border border-[#EBE8E1] hover:border-[#1A1A1A] transition-colors flex flex-col gap-1.5 relative shadow-xs ${
                      isClosed ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-serif font-bold text-[#1A1A1A] truncate">
                        {item.subjectName}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`w-2 h-2 rounded-full ${statusColor}`} />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#52525B] line-clamp-2 leading-relaxed">
                      {item.details}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EBE8E1] mt-1">
                      <span className="text-[10px] font-mono text-[#A1A1AA]">
                        {item.requestedAt}
                      </span>
                      {item.categoryTag && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#FAF7F0] rounded-full text-[#71717A] border border-[#EBE8E1]">
                          {item.categoryTag}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
