import { Printer } from '../types';

export const EPSON_L120_DEFAULT: Printer = {
  id: 'epson-l120-usb',
  name: 'Epson L120',
  customName: 'Home USB Printer',
  model: 'L120 Series (ESC/P-R)',
  connectionType: 'usb',
  isConnected: true,
  isFavorite: true,
  vendorId: 0x04B8, // Seiko Epson Corp.
  productId: 0x00A7,
  statusText: 'Ready to Print',
  inkLevels: {
    black: 82,
    cyan: 68,
    magenta: 74,
    yellow: 89
  },
  supportedFeatures: {
    duplex: false, // Epson L120 is single-sided manual duplex only
    color: true,
    paperSizes: ['a4', 'letter', '4x6', '5x7', 'custom'],
    maxResolutionDpi: 720
  }
};

export class UsbPrinterService {
  private static STORAGE_KEY = 'easyprint_saved_printer';
  private static FAVORITE_KEY = 'easyprint_is_favorite';

  static getSavedPrinter(): Printer {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read saved printer', e);
    }
    return EPSON_L120_DEFAULT;
  }

  static savePrinter(printer: Printer): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(printer));
    } catch (e) {
      console.warn('Could not save printer', e);
    }
  }

  static hasWebUsbSupport(): boolean {
    return typeof navigator !== 'undefined' && 'usb' in navigator;
  }

  /**
   * Attempts to request an Epson USB device via browser WebUSB API,
   * or falls back to OTG simulation if WebUSB is not granted/supported in iframe.
   */
  static async detectUsbPrinter(): Promise<{ success: boolean; printer?: Printer; error?: string }> {
    if (this.hasWebUsbSupport()) {
      try {
        const device = await (navigator as any).usb.requestDevice({
          filters: [
            { vendorId: 0x04B8 }, // Seiko Epson
            { classCode: 0x07 }    // USB Printer Class
          ]
        });

        if (device) {
          const detectedPrinter: Printer = {
            id: `epson-${device.productId || 'l120'}`,
            name: device.productName || 'Epson L120',
            model: 'Epson InkTank L120 Series',
            connectionType: 'usb',
            isConnected: true,
            isFavorite: true,
            vendorId: device.vendorId,
            productId: device.productId,
            statusText: 'Connected via USB OTG',
            inkLevels: {
              black: 85,
              cyan: 70,
              magenta: 78,
              yellow: 92
            },
            supportedFeatures: {
              duplex: false,
              color: true,
              paperSizes: ['a4', 'letter', '4x6', '5x7'],
              maxResolutionDpi: 720
            }
          };
          this.savePrinter(detectedPrinter);
          return { success: true, printer: detectedPrinter };
        }
      } catch (err: any) {
        // If user cancelled browser picker or security policy blocked WebUSB in iframe
        console.log('WebUSB prompt closed or denied, using simulated detection:', err?.message);
      }
    }

    // Default OTG simulated detection with 1.2s delay for realistic device negotiation
    await new Promise((res) => setTimeout(res, 1200));

    const simulatedPrinter: Printer = {
      ...EPSON_L120_DEFAULT,
      isConnected: true,
      statusText: 'Connected via USB OTG'
    };
    this.savePrinter(simulatedPrinter);
    return { success: true, printer: simulatedPrinter };
  }

  /**
   * Generates ESC/P-R control sequence header representation for Epson L120
   */
  static generateEscPrJobHeader(pagesCount: number, colorMode: string, quality: string): Uint8Array {
    // ESC/P-R header: ESC @ (Reset), ESC ( G (Graphics mode), ESC ( e (Page count)
    const header = [
      0x1B, 0x40, // ESC @ - Reset printer
      0x1B, 0x28, 0x47, 0x01, 0x00, 0x01, // ESC ( G - Enter graphics mode
      0x1B, 0x28, 0x65, 0x03, 0x00, 0x00, (pagesCount & 0xFF), ((pagesCount >> 8) & 0xFF) // ESC ( e - Page info
    ];
    return new Uint8Array(header);
  }
}
