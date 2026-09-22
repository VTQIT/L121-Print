/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  ActiveScreen, 
  PrintableItem, 
  PrintSettings, 
  PrintHistoryItem 
} from './types';
import { UsbPrinterService, EPSON_L120_DEFAULT } from './services/usbPrinterService';
import { INITIAL_HISTORY, SAMPLE_DOCUMENTS, SAMPLE_PHOTOS } from './data/sampleDocuments';
import { PhoneContainer } from './components/PhoneContainer';
import { HomeScreen } from './components/HomeScreen';
import { PrinterSetupWizard } from './components/PrinterSetupWizard';
import { PrintPhotoScreen } from './components/PrintPhotoScreen';
import { PrintDocumentScreen } from './components/PrintDocumentScreen';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { PrintingModal } from './components/PrintingModal';
import { ScanDocumentModal } from './components/ScanDocumentModal';
import { PrintHistoryModal } from './components/PrintHistoryModal';
import { PrinterSettingsModal } from './components/PrinterSettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AndroidCodeViewerModal } from './components/AndroidCodeViewerModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [printer, setPrinter] = useState<Printer>(() => UsbPrinterService.getSavedPrinter());
  const [history, setHistory] = useState<PrintHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('easyprint_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_HISTORY;
  });

  const [activePreviewItem, setActivePreviewItem] = useState<PrintableItem | null>(null);
  const [previewInitialSettings, setPreviewInitialSettings] = useState<Partial<PrintSettings> | undefined>(undefined);
  const [activePrintingData, setActivePrintingData] = useState<{ item: PrintableItem; settings: PrintSettings } | null>(null);

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('easyprint_onboarding_done');
  });
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [isFrameMode, setIsFrameMode] = useState(true);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('easyprint_history', JSON.stringify(history));
    } catch (e) {
      console.warn(e);
    }
  }, [history]);

  const handleFinishOnboarding = () => {
    localStorage.setItem('easyprint_onboarding_done', 'true');
    setShowOnboarding(false);
  };

  const handleOpenPreview = (item: PrintableItem, defaultSettings?: Partial<PrintSettings>) => {
    setActivePreviewItem(item);
    setPreviewInitialSettings(defaultSettings);
  };

  const handleClosePreview = () => {
    setActivePreviewItem(null);
  };

  const handleStartPrint = (item: PrintableItem, settings: PrintSettings) => {
    setActivePreviewItem(null);
    setActivePrintingData({ item, settings });
  };

  const handlePrintComplete = () => {
    if (!activePrintingData) return;

    const newHistoryItem: PrintHistoryItem = {
      id: `job-${Date.now()}`,
      title: activePrintingData.item.originalFileName || activePrintingData.item.title,
      printerName: printer.customName || printer.name,
      pagesCount: activePrintingData.item.pages.length * activePrintingData.settings.copies,
      copies: activePrintingData.settings.copies,
      colorMode: activePrintingData.settings.colorMode,
      paperSize: activePrintingData.settings.paperSize,
      timestamp: 'Just now',
      status: 'completed',
      thumbnailUrl: activePrintingData.item.thumbnailUrl
    };

    setHistory([newHistoryItem, ...history]);
  };

  const handlePrintAnother = () => {
    setActivePrintingData(null);
    setActiveScreen('home');
  };

  const handleCancelPrinting = () => {
    setActivePrintingData(null);
  };

  const handleReprint = (historyItem: PrintHistoryItem) => {
    // Find matching sample or create placeholder printable item
    const existingDoc = SAMPLE_DOCUMENTS.find((d) => d.originalFileName === historyItem.title) 
      || SAMPLE_PHOTOS.find((p) => p.originalFileName === historyItem.title);

    if (existingDoc) {
      handleOpenPreview(existingDoc, {
        paperSize: historyItem.paperSize,
        colorMode: historyItem.colorMode,
        copies: historyItem.copies
      });
    } else {
      const fallbackItem: PrintableItem = {
        id: `reprint-${Date.now()}`,
        title: historyItem.title,
        type: 'document',
        originalFileName: historyItem.title,
        fileSizeFormatted: '1.2 MB',
        createdAt: historyItem.timestamp,
        thumbnailUrl: historyItem.thumbnailUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
        pages: [
          {
            pageNumber: 1,
            previewUrl: historyItem.thumbnailUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
            textSnippet: `Document Reprint: ${historyItem.title}\nPrepared for ${printer.name} via USB OTG.`
          }
        ]
      };
      handleOpenPreview(fallbackItem, {
        paperSize: historyItem.paperSize,
        colorMode: historyItem.colorMode,
        copies: historyItem.copies
      });
    }
  };

  const handleSelectFileFromSystem = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const url = URL.createObjectURL(file);
    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const customItem: PrintableItem = {
      id: `file-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      type: isImage ? 'photo' : 'document',
      originalFileName: file.name,
      fileSizeFormatted: sizeFormatted,
      createdAt: 'Just now',
      thumbnailUrl: isImage ? url : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      pages: [
        {
          pageNumber: 1,
          previewUrl: url,
          textSnippet: isImage ? file.name : `Uploaded: ${file.name}\nSize: ${sizeFormatted}\nReady to print on ${printer.name}.`
        }
      ]
    };

    handleOpenPreview(customItem, {
      paperSize: isImage ? '4x6' : 'a4',
      scaling: isImage ? 'fill' : 'fit'
    });
  };

  return (
    <PhoneContainer isFrameMode={isFrameMode} onToggleFrame={() => setIsFrameMode(!isFrameMode)}>
      {/* Active Screen Router */}
      {activeScreen === 'home' && (
        <HomeScreen
          printer={printer}
          onNavigate={(screen) => setActiveScreen(screen)}
          onSelectFileFromSystem={handleSelectFileFromSystem}
          onOpenCodeViewer={() => setShowCodeViewer(true)}
          onToggleFrame={() => setIsFrameMode(!isFrameMode)}
          isFrameMode={isFrameMode}
        />
      )}

      {activeScreen === 'printer_setup' && (
        <PrinterSetupWizard
          currentPrinter={printer}
          onBack={() => setActiveScreen('home')}
          onPrinterSelected={(newPrinter) => {
            setPrinter(newPrinter);
            UsbPrinterService.savePrinter(newPrinter);
            setActiveScreen('home');
          }}
        />
      )}

      {activeScreen === 'print_photo' && (
        <PrintPhotoScreen
          connectedPrinter={printer}
          onBack={() => setActiveScreen('home')}
          onOpenPreview={(item, settings) => handleOpenPreview(item, settings)}
        />
      )}

      {activeScreen === 'print_document' && (
        <PrintDocumentScreen
          connectedPrinter={printer}
          onBack={() => setActiveScreen('home')}
          onOpenPreview={(item, settings) => handleOpenPreview(item, settings)}
        />
      )}

      {activeScreen === 'scan_print' && (
        <ScanDocumentModal
          onBack={() => setActiveScreen('home')}
          onScannedDocumentReady={(item) => {
            handleOpenPreview(item, {
              paperSize: 'a4',
              colorMode: 'monochrome'
            });
          }}
        />
      )}

      {activeScreen === 'history' && (
        <PrintHistoryModal
          history={history}
          onBack={() => setActiveScreen('home')}
          onReprint={handleReprint}
          onClearHistory={() => setHistory([])}
          onDeleteItem={(id) => setHistory(history.filter((h) => h.id !== id))}
        />
      )}

      {activeScreen === 'settings' && (
        <PrinterSettingsModal
          printer={printer}
          onBack={() => setActiveScreen('home')}
          onUpdatePrinter={(updated) => setPrinter(updated)}
          onSwitchPrinter={() => setActiveScreen('printer_setup')}
        />
      )}

      {/* Realistic Paper Print Preview Screen Modal */}
      {activePreviewItem && (
        <PrintPreviewModal
          item={activePreviewItem}
          printer={printer}
          onClose={handleClosePreview}
          onStartPrint={handleStartPrint}
          initialSettings={previewInitialSettings}
        />
      )}

      {/* Live Printing Modal */}
      {activePrintingData && (
        <PrintingModal
          item={activePrintingData.item}
          settings={activePrintingData.settings}
          printer={printer}
          onCancel={handleCancelPrinting}
          onComplete={handlePrintComplete}
          onPrintAnother={handlePrintAnother}
        />
      )}

      {/* Onboarding 3-Step Tutorial */}
      {showOnboarding && (
        <OnboardingModal onFinish={handleFinishOnboarding} />
      )}

      {/* Android Studio Code Deliverable Viewer Modal */}
      <AndroidCodeViewerModal
        isOpen={showCodeViewer}
        onClose={() => setShowCodeViewer(false)}
      />
    </PhoneContainer>
  );
}
