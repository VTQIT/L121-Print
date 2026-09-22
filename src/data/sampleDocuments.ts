import { PrintableItem } from '../types';

export const SAMPLE_PHOTOS: PrintableItem[] = [
  {
    id: 'photo-1',
    title: 'Sunset Beach Vacation',
    type: 'photo',
    originalFileName: 'IMG_20260714_184201.jpg',
    fileSizeFormatted: '3.4 MB',
    createdAt: 'Today, 2:15 PM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    pages: [
      {
        pageNumber: 1,
        previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        textSnippet: 'High-resolution ocean sunset landscape'
      }
    ]
  },
  {
    id: 'photo-2',
    title: 'Family Portrait Photo',
    type: 'photo',
    originalFileName: 'Family_Gathering_2026.jpg',
    fileSizeFormatted: '4.8 MB',
    createdAt: 'Yesterday, 6:30 PM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
    pages: [
      {
        pageNumber: 1,
        previewUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
        textSnippet: '4x6 Portrait format photo'
      }
    ]
  },
  {
    id: 'photo-3',
    title: 'Architectural Project',
    type: 'photo',
    originalFileName: 'Design_Render_Final.png',
    fileSizeFormatted: '2.9 MB',
    createdAt: 'Sep 18, 11:20 AM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    pages: [
      {
        pageNumber: 1,
        previewUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        textSnippet: 'Modern building exterior structure'
      }
    ]
  }
];

export const SAMPLE_DOCUMENTS: PrintableItem[] = [
  {
    id: 'doc-1',
    title: 'Official Invoice INV-2026-089',
    type: 'pdf',
    originalFileName: 'Invoice_EpsonServices_089.pdf',
    fileSizeFormatted: '420 KB',
    createdAt: 'Today, 9:14 AM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    pages: [
      {
        pageNumber: 1,
        previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        textSnippet: 'INVOICE #INV-2026-089\nBilled to: Acme Industrial Supplies Ltd.\nDate: Sept 22, 2026\nDue Date: Oct 15, 2026\n\n1. Epson L120 Maintenance Kit - $45.00\n2. T664 Premium Refill Inks (BK, C, M, Y) - $38.50\n3. High Quality A4 80gsm Paper (500 sheets) - $12.00\nSubtotal: $95.50\nTax (8%): $7.64\nTotal Due: $103.14'
      },
      {
        pageNumber: 2,
        previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        textSnippet: 'PAYMENT TERMS & WARRANTY DETAILS\nPayment can be remitted via Direct Wire or Bank Transfer.\nAll supplied ink units carry manufacturer warranty.\nPlease retain this sheet for customer service claims.\nAuthorized Signature: J. Sterling'
      }
    ]
  },
  {
    id: 'doc-2',
    title: 'Consulting Agreement 2026',
    type: 'document',
    originalFileName: 'Service_Agreement_Draft.docx',
    fileSizeFormatted: '1.2 MB',
    createdAt: 'Yesterday, 4:05 PM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    pages: [
      {
        pageNumber: 1,
        previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        textSnippet: 'STANDARD SERVICE AGREEMENT\nBetween EasyPrint Solutions and Client Partner.\nSection 1: Scope of Hardware Support\n1.1 Direct USB On-The-Go (OTG) peripheral communication.'
      },
      {
        pageNumber: 2,
        previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        textSnippet: 'Section 2: Maintenance and Consumables\n2.1 Epson L120 genuine ink cartridge refill guidelines.\n2.2 Printhead nozzle check and purge cycles.'
      },
      {
        pageNumber: 3,
        previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        textSnippet: 'Section 3: Signatures and Approvals\nParty A: _________________________\nParty B: _________________________\nDate: September 22, 2026'
      }
    ]
  },
  {
    id: 'doc-3',
    title: 'Quarterly Inventory & Ink Usage',
    type: 'spreadsheet',
    originalFileName: 'Q3_Ink_Supplies_Audit.xlsx',
    fileSizeFormatted: '680 KB',
    createdAt: 'Sep 20, 10:15 AM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    pages: [
      {
        pageNumber: 1,
        previewUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        textSnippet: 'PRINTER CONSUMABLE AUDIT - Q3\nItem Code | Description | In Stock | Reorder Level | Status\nT6641 | Black 70ml Ink | 14 bottles | 5 | OK\nT6642 | Cyan 70ml Ink | 9 bottles | 5 | OK\nT6643 | Magenta 70ml | 8 bottles | 5 | OK\nT6644 | Yellow 70ml | 11 bottles | 5 | OK'
      }
    ]
  }
];

export const INITIAL_HISTORY = [
  {
    id: 'hist-1',
    title: 'Family_Gathering_2026.jpg',
    printerName: 'Epson L120',
    pagesCount: 1,
    copies: 2,
    colorMode: 'color' as const,
    paperSize: '4x6' as const,
    timestamp: 'Today, 11:32 AM',
    status: 'completed' as const,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'hist-2',
    title: 'Invoice_EpsonServices_089.pdf',
    printerName: 'Epson L120',
    pagesCount: 2,
    copies: 1,
    colorMode: 'monochrome' as const,
    paperSize: 'a4' as const,
    timestamp: 'Yesterday, 8:15 PM',
    status: 'completed' as const,
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'hist-3',
    title: 'Shipping_Label_L120.pdf',
    printerName: 'Epson L120',
    pagesCount: 1,
    copies: 1,
    colorMode: 'monochrome' as const,
    paperSize: 'letter' as const,
    timestamp: 'Sep 19, 3:45 PM',
    status: 'completed' as const
  }
];
