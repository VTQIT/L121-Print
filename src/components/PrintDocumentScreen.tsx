import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  FileSpreadsheet, 
  File, 
  Upload, 
  Eye, 
  Printer as PrinterIcon, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PrintableItem, PrintSettings, Printer } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

interface PrintDocumentScreenProps {
  onBack: () => void;
  onOpenPreview: (item: PrintableItem, defaultSettings?: Partial<PrintSettings>) => void;
  connectedPrinter: Printer;
}

export const PrintDocumentScreen: React.FC<PrintDocumentScreenProps> = ({
  onBack,
  onOpenPreview,
  connectedPrinter
}) => {
  const [documents, setDocuments] = useState<PrintableItem[]>(SAMPLE_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState<string>(SAMPLE_DOCUMENTS[0].id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    let docType: PrintableItem['type'] = 'document';
    if (extension === 'pdf') docType = 'pdf';
    else if (extension === 'xls' || extension === 'xlsx' || extension === 'csv') docType = 'spreadsheet';
    else if (extension === 'txt') docType = 'text';

    const reader = new FileReader();
    reader.onload = (event) => {
      const textContent = typeof event.target?.result === 'string' ? event.target.result : 'Imported Document Content';
      
      const newDoc: PrintableItem = {
        id: `custom-doc-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: docType,
        originalFileName: file.name,
        fileSizeFormatted: sizeFormatted,
        createdAt: 'Just now',
        thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
        pages: [
          {
            pageNumber: 1,
            previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
            textSnippet: textContent.slice(0, 500) || `Uploaded Document: ${file.name}\nReady for printing on ${connectedPrinter.name}.`
          }
        ]
      };

      setDocuments([newDoc, ...documents]);
      setSelectedDocId(newDoc.id);
    };

    if (extension === 'txt' || extension === 'csv') {
      reader.readAsText(file);
    } else {
      // Create preview object url
      const objectUrl = URL.createObjectURL(file);
      const newDoc: PrintableItem = {
        id: `custom-doc-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: docType,
        originalFileName: file.name,
        fileSizeFormatted: sizeFormatted,
        createdAt: 'Just now',
        thumbnailUrl: objectUrl,
        pages: [
          {
            pageNumber: 1,
            previewUrl: objectUrl,
            textSnippet: `Document: ${file.name}\nFile Size: ${sizeFormatted}\nReady for Epson L120 printing.`
          }
        ]
      };
      setDocuments([newDoc, ...documents]);
      setSelectedDocId(newDoc.id);
    }
  };

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const getDocIcon = (type: PrintableItem['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-400" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-400" />;
      case 'text':
        return <File className="w-6 h-6 text-amber-400" />;
      default:
        return <FileText className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Print Document</h1>
            <p className="text-xs text-slate-400">PDF, Word, Excel, and Text files</p>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-md shadow-indigo-600/30"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" 
          onChange={handleFileUpload}
          className="hidden" 
        />
      </div>

      <div className="p-4 sm:p-6 max-w-lg mx-auto w-full space-y-6 pb-24">
        {/* Active Document Details Card */}
        {selectedDoc && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                {getDocIcon(selectedDoc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  {selectedDoc.type} Document
                </span>
                <h2 className="text-base font-bold text-white truncate mt-1">{selectedDoc.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{selectedDoc.originalFileName}</span>
                  <span>•</span>
                  <span>{selectedDoc.fileSizeFormatted}</span>
                </div>
              </div>
            </div>

            {/* Quick Document Summary Stats */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div className="text-xs text-slate-400">Total Pages</div>
                <div className="text-base font-bold text-white">{selectedDoc.pages.length} Pages</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div className="text-xs text-slate-400">Target Printer</div>
                <div className="text-base font-bold text-emerald-400 truncate">{connectedPrinter.name}</div>
              </div>
            </div>

            {/* Document Content Preview Snippet */}
            {selectedDoc.pages[0]?.textSnippet && (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Page 1 Content Preview
                </div>
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap line-clamp-4 leading-relaxed">
                  {selectedDoc.pages[0].textSnippet}
                </pre>
              </div>
            )}

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => onOpenPreview(selectedDoc, { paperSize: 'a4', colorMode: 'monochrome' })}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => onOpenPreview(selectedDoc, { paperSize: 'a4', colorMode: 'color' })}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-colors flex items-center justify-center gap-2"
              >
                <PrinterIcon className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        )}

        {/* Document List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent & Ready Documents</span>
            <span className="text-xs text-slate-400">{documents.length} files</span>
          </div>

          <div className="space-y-2.5">
            {documents.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    {getDocIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{doc.title}</h4>
                    <p className="text-xs text-slate-400 truncate">
                      {doc.pages.length} {doc.pages.length === 1 ? 'page' : 'pages'} • {doc.fileSizeFormatted} • {doc.createdAt}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
