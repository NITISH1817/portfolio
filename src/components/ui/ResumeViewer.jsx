import React from 'react';

export default function ResumeViewer({ isOpen, onClose }) {
  if (!isOpen) return null;
  const resumeUrl = '/resume/Nitish_Priyan_RS_Resume.pdf';

  return (
    <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#111318] border-b border-white/10 shrink-0">
        <span className="text-sm font-mono text-gray-400">Nitish_Priyan_RS_Resume.pdf</span>
        <div className="flex items-center gap-3">
          <a href={resumeUrl} download="Nitish_Priyan_RS_Resume.pdf"
            className="px-4 py-1.5 text-xs font-mono tracking-widest uppercase border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all">
            Download
          </a>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-lg">
            ✕
          </button>
        </div>
      </div>
      {/* PDF viewer */}
      <iframe src={`${resumeUrl}#toolbar=0`} title="Resume" className="flex-1 w-full border-0" />
    </div>
  );
}
