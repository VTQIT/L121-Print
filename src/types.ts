export type ConnectionType = 'usb' | 'wifi' | 'network';

export type PaperSize = 'a4' | 'letter' | '4x6' | '5x7' | 'custom';

export type Orientation = 'portrait' | 'landscape';

export type ColorMode = 'color' | 'monochrome';

export type PrintQuality = 'draft' | 'normal' | 'high';

export type ScalingMode = 'fit' | 'fill' | 'original';

export type MarginMode = 'normal' | 'narrow' | 'none';

export interface Printer {
  id: string;
  name: string;
  model: string;
  connectionType: ConnectionType;
  isConnected: boolean;
  isFavorite: boolean;
  customName?: string;
  vendorId?: number; // 0x04b8 for Epson
  productId?: number;
  ipAddress?: string;
  statusText: string;
  inkLevels?: {
    black: number;
    cyan: number;
    magenta: number;
    yellow: number;
  };
  supportedFeatures: {
    duplex: boolean; // false for Epson L120
    color: boolean;
    paperSizes: PaperSize[];
    maxResolutionDpi: number;
  };
}

export interface PrintSettings {
  paperSize: PaperSize;
  orientation: Orientation;
  copies: number;
  colorMode: ColorMode;
  quality: PrintQuality;
  scaling: ScalingMode;
  margins: MarginMode;
  pageRange: 'all' | 'custom';
  customPages?: string; // e.g. "1-3, 5"
  duplex: boolean; // Epson L120 is single-sided
  blackEnhance?: boolean;
}

export interface DocumentPage {
  pageNumber: number;
  previewUrl: string;
  textSnippet?: string;
}

export interface PrintableItem {
  id: string;
  title: string;
  type: 'photo' | 'pdf' | 'document' | 'spreadsheet' | 'text' | 'scan';
  originalFileName: string;
  fileSizeFormatted: string;
  createdAt: string;
  pages: DocumentPage[];
  thumbnailUrl: string;
}

export interface PrintHistoryItem {
  id: string;
  title: string;
  printerName: string;
  pagesCount: number;
  copies: number;
  colorMode: ColorMode;
  paperSize: PaperSize;
  timestamp: string;
  status: 'completed' | 'cancelled' | 'failed';
  thumbnailUrl?: string;
}

export type ActiveScreen = 
  | 'home'
  | 'printer_setup'
  | 'print_photo'
  | 'print_document'
  | 'scan_print'
  | 'history'
  | 'settings'
  | 'troubleshoot'
  | 'code_viewer';
