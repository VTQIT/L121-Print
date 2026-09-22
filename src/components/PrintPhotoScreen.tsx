import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Plus, 
  Trash2, 
  Eye, 
  SlidersHorizontal,
  Sparkles,
  Layers
} from 'lucide-react';
import { PrintableItem, PrintSettings, Printer } from '../types';
import { SAMPLE_PHOTOS } from '../data/sampleDocuments';

interface PrintPhotoScreenProps {
  onBack: () => void;
  onOpenPreview: (item: PrintableItem, defaultSettings?: Partial<PrintSettings>) => void;
  connectedPrinter: Printer;
}

export const PrintPhotoScreen: React.FC<PrintPhotoScreenProps> = ({
  onBack,
  onOpenPreview,
  connectedPrinter
}) => {
  const [photoList, setPhotoList] = useState<PrintableItem[]>(SAMPLE_PHOTOS);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([SAMPLE_PHOTOS[0].id]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleSelect = (id: string) => {
    if (selectedPhotoIds.includes(id)) {
      if (selectedPhotoIds.length > 1) {
        setSelectedPhotoIds(selectedPhotoIds.filter((p) => p !== id));
      }
    } else {
      setSelectedPhotoIds([...selectedPhotoIds, id]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: PrintableItem[] = [];
    Array.from(files).forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const item: PrintableItem = {
        id: `user-photo-${Date.now()}-${index}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: 'photo',
        originalFileName: file.name,
        fileSizeFormatted: `${sizeMb} MB`,
        createdAt: 'Just now',
        thumbnailUrl: url,
        pages: [
          {
            pageNumber: 1,
            previewUrl: url,
            textSnippet: file.name
          }
        ]
      };
      newItems.push(item);
    });

    setPhotoList([...newItems, ...photoList]);
    setSelectedPhotoIds([newItems[0].id]);
  };

  const activePhoto = photoList.find((p) => p.id === selectedPhotoIds[0]) || photoList[0];

  const handleProceedToPreview = () => {
    if (selectedPhotoIds.length === 1) {
      onOpenPreview(activePhoto, {
        paperSize: '4x6', // Default for photos
        scaling: 'fill'
      });
    } else {
      // Create multi-page photo album from selected photos
      const selectedPhotos = photoList.filter((p) => selectedPhotoIds.includes(p.id));
      const compositeItem: PrintableItem = {
        id: `album-${Date.now()}`,
        title: `Photo Batch (${selectedPhotos.length} photos)`,
        type: 'photo',
        originalFileName: `Photo_Batch_${selectedPhotos.length}.jpg`,
        fileSizeFormatted: `${selectedPhotos.length * 3.2} MB`,
        createdAt: 'Just now',
        thumbnailUrl: selectedPhotos[0].thumbnailUrl,
        pages: selectedPhotos.map((photo, i) => ({
          pageNumber: i + 1,
          previewUrl: photo.thumbnailUrl,
          textSnippet: photo.title
        }))
      };
      onOpenPreview(compositeItem, {
        paperSize: '4x6',
        scaling: 'fill'
      });
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
            <h1 className="text-lg font-bold text-white">Print Photo</h1>
            <p className="text-xs text-slate-400">Select photos from Gallery or upload</p>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-md shadow-indigo-600/30"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileUpload}
          className="hidden" 
        />
      </div>

      <div className="p-4 sm:p-6 max-w-lg mx-auto w-full space-y-6 pb-24">
        {/* Selected Photo Big Preview Card */}
        {activePhoto && (
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl group">
            <div className="aspect-[4/3] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <img 
                src={activePhoto.thumbnailUrl} 
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="p-4 bg-slate-900 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white truncate max-w-[220px]">{activePhoto.title}</h3>
                <p className="text-xs text-slate-400">{activePhoto.fileSizeFormatted} • {activePhoto.originalFileName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-indigo-500/10 text-indigo-300 font-semibold px-2.5 py-1 rounded-full">
                  4×6 Photo Ready
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Selection Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Photo Gallery</span>
            </div>
            <span className="text-xs text-slate-400">
              {selectedPhotoIds.length} selected
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {photoList.map((photo) => {
              const isSelected = selectedPhotoIds.includes(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => handleToggleSelect(photo.id)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg' 
                      : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={photo.thumbnailUrl} 
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Photo Button Tile */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/50 hover:bg-slate-900 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-indigo-300 transition-all"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-semibold">Add Photo</span>
            </button>
          </div>
        </div>

        {/* Quick Tips for Epson L120 */}
        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-1.5">
          <div className="font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Epson L120 Photo Printing Tip</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            The Epson L120 Micro Piezo printhead prints vibrant photos using 4-color genuine inks. For best gloss results, select <strong>4×6 in</strong> or <strong>A4 Glossy Photo Paper</strong> in preview.
          </p>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-30 max-w-lg mx-auto">
        <button
          onClick={handleProceedToPreview}
          disabled={selectedPhotoIds.length === 0}
          className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          <Eye className="w-5 h-5" />
          <span>Preview & Print ({selectedPhotoIds.length})</span>
        </button>
      </div>
    </div>
  );
};
