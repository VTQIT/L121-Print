import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sliders, 
  Printer as PrinterIcon, 
  Copy, 
  Check, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Settings,
  Info
} from 'lucide-react';
import { 
  PrintableItem, 
  PrintSettings, 
  Printer, 
  PaperSize, 
  Orientation, 
  ColorMode, 
  PrintQuality, 
  ScalingMode, 
  MarginMode 
} from '../types';

interface PrintPreviewModalProps {
  item: PrintableItem;
  printer: Printer;
  onClose: () => void;
  onStartPrint: (item: PrintableItem, settings: PrintSettings) => void;
  initialSettings?: Partial<PrintSettings>;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  item,
  printer,
  onClose,
  onStartPrint,
  initialSettings
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100); // 50% to 150%
  const [showMoreSettings, setShowMoreSettings] = useState(false);

  const [settings, setSettings] = useState<PrintSettings>({
    paperSize: initialSettings?.paperSize || (item.type === 'photo' ? '4x6' : 'a4'),
    orientation: initialSettings?.orientation || 'portrait',
    copies: initialSettings?.copies || 1,
    colorMode: initialSettings?.colorMode || (item.type === 'photo' ? 'color' : 'monochrome'),
    quality: initialSettings?.quality || 'normal',
    scaling: initialSettings?.scaling || (item.type === 'photo' ? 'fill' : 'fit'),
    margins: initialSettings?.margins || 'normal',
    pageRange: initialSettings?.pageRange || 'all',
    duplex: false, // Epson L120 does not have auto duplex
    blackEnhance: true
  });

  const totalPages = item.pages.length;
  const activePage = item.pages[currentPageIndex] || item.pages[0];

  // Paper Aspect Ratios
  const getPaperAspectRatio = () => {
    if (settings.orientation === 'landscape') {
      switch (settings.paperSize) {
        case 'a4': return 'aspect-[297/210]';
        case 'letter': return 'aspect-[11/8.5]';
        case '4x6': return 'aspect-[6/4]';
        case '5x7': return 'aspect-[7/5]';
        default: return 'aspect-[297/210]';
      }
    } else {
      switch (settings.paperSize) {
        case 'a4': return 'aspect-[210/297]';
        case 'letter': return 'aspect-[8.5/11]';
        case '4x6': return 'aspect-[4/6]';
        case '5x7': return 'aspect-[5/7]';
        default: return 'aspect-[210/297]';
      }
    }
  };

  const getMarginClass = () => {
    switch (settings.margins) {
      case 'none': return 'p-0';
      case 'narrow': return 'p-3';
      case 'normal':
      default: return 'p-6';
    }
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(160, Math.max(60, prev + delta)));
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-slate-100 flex flex-col overflow-hidden animate-in fade-in">
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white truncate max-w-[200px] sm:max-w-xs">{item.title}</h1>
            <p className="text-xs text-slate-400">
              {totalPages} {totalPages === 1 ? 'page' : 'pages'} • {printer.name}
            </p>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-xs">
          <button 
            onClick={() => handleZoom(-15)}
            className="p-1 hover:text-indigo-400 text-slate-400 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="w-9 text-center font-mono text-slate-300">{zoomLevel}%</span>
          <button 
            onClick={() => handleZoom(15)}
            className="p-1 hover:text-indigo-400 text-slate-400 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Preview Work Area & Settings Panel */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Paper Canvas Stage */}
        <div className="flex-1 bg-slate-950/90 flex flex-col items-center justify-center p-4 overflow-auto relative select-none">
          {/* Paper Container with Realistic Sheet Shadow and Margin Border */}
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
            className="transition-transform duration-200 ease-out"
          >
            <div 
              id="printable-area"
              className={`relative bg-white text-slate-900 shadow-2xl rounded-sm ${getPaperAspectRatio()} max-h-[62vh] sm:max-h-[68vh] w-auto overflow-hidden flex flex-col ${getMarginClass()} transition-all`}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.1)'
              }}
            >
              {/* Paper Content Rendering */}
              {item.type === 'photo' ? (
                <div className={`w-full h-full overflow-hidden flex items-center justify-center ${settings.colorMode === 'monochrome' ? 'grayscale contrast-125' : ''}`}>
                  <img
                    src={activePage.previewUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full ${
                      settings.scaling === 'fill' ? 'object-cover' : settings.scaling === 'fit' ? 'object-contain' : 'object-none'
                    }`}
                  />
                </div>
              ) : (
                <div className={`w-full h-full flex flex-col justify-between text-left ${settings.colorMode === 'monochrome' ? 'grayscale' : ''}`}>
                  <div>
                    <div className="border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
                      <div className="font-bold text-xs uppercase tracking-wider text-slate-700">{item.title}</div>
                      <div className="text-[10px] text-slate-400">Page {currentPageIndex + 1} of {totalPages}</div>
                    </div>
                    {activePage.textSnippet ? (
                      <pre className="text-[11px] font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {activePage.textSnippet}
                      </pre>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <img 
                          src={activePage.previewUrl} 
                          alt="Document Preview"
                          referrerPolicy="no-referrer" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-200 pt-2 text-[9px] text-slate-400 flex justify-between">
                    <span>Epson L120 Quality Output</span>
                    <span>Printed via EasyPrint Mobile</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page Switcher Navigation (if multiple pages) */}
          {totalPages > 1 && (
            <div className="absolute bottom-4 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800 shadow-lg">
              <button
                onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentPageIndex === 0}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-semibold text-white">
                Page {currentPageIndex + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPageIndex === totalPages - 1}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Settings Sidebar / Bottom Drawer */}
        <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-4 sm:p-5 overflow-y-auto space-y-4 shrink-0 max-h-[45vh] md:max-h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Print Settings</span>
            </span>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {printer.name}
            </span>
          </div>

          {/* Paper Size & Orientation */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Paper Size</label>
              <select
                value={settings.paperSize}
                onChange={(e) => setSettings({ ...settings, paperSize: e.target.value as PaperSize })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-semibold text-white focus:ring-1 focus:ring-indigo-500"
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">US Letter (8.5 × 11 in)</option>
                <option value="4x6">4 × 6 in (Photo)</option>
                <option value="5x7">5 × 7 in</option>
                <option value="custom">Custom Size</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Orientation</label>
              <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, orientation: 'portrait' })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    settings.orientation === 'portrait' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, orientation: 'landscape' })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    settings.orientation === 'landscape' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>
          </div>

          {/* Color Mode & Copies */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Color Mode</label>
              <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, colorMode: 'color' })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    settings.colorMode === 'color' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Color
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, colorMode: 'monochrome' })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    settings.colorMode === 'monochrome' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  B & W
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Copies</label>
              <div className="flex items-center justify-between bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, copies: Math.max(1, settings.copies - 1) })}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                >
                  -
                </button>
                <span className="font-bold text-sm text-white">{settings.copies}</span>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, copies: settings.copies + 1 })}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Scaling & Margins */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Scaling</label>
              <select
                value={settings.scaling}
                onChange={(e) => setSettings({ ...settings, scaling: e.target.value as ScalingMode })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-semibold text-white"
              >
                <option value="fit">Fit to Page</option>
                <option value="fill">Fill Page</option>
                <option value="original">Original Size</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Margins</label>
              <select
                value={settings.margins}
                onChange={(e) => setSettings({ ...settings, margins: e.target.value as MarginMode })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-semibold text-white"
              >
                <option value="normal">Normal</option>
                <option value="narrow">Narrow</option>
                <option value="none">None (Borderless)</option>
              </select>
            </div>
          </div>

          {/* Advanced / More Settings Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowMoreSettings(!showMoreSettings)}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between hover:bg-slate-850"
            >
              <span>More Settings</span>
              {showMoreSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showMoreSettings && (
              <div className="mt-2.5 p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Print Quality</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['draft', 'normal', 'high'] as PrintQuality[]).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setSettings({ ...settings, quality: q })}
                        className={`py-1.5 text-[11px] font-medium rounded-lg capitalize transition-colors ${
                          settings.quality === q ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Page Range</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, pageRange: 'all' })}
                      className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg ${
                        settings.pageRange === 'all' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      All Pages
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, pageRange: 'custom' })}
                      className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg ${
                        settings.pageRange === 'custom' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Current Page
                    </button>
                  </div>
                </div>

                {/* Duplex Notice for Epson L120 */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    <span>2-Sided / Duplex Printing</span>
                  </div>
                  <p>
                    The Epson L120 is a single-sided printer. For double-sided prints, print odd pages first, flip paper stack, and print even pages.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Big Print Button */}
          <button
            onClick={() => onStartPrint(item, settings)}
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
          >
            <PrinterIcon className="w-5 h-5" />
            <span>Print ({settings.copies} {settings.copies === 1 ? 'copy' : 'copies'})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
