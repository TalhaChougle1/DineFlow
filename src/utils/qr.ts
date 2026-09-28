import QRCode from 'qrcode';

export const getBaseOrigin = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:5173';
};

export const getMenuUrl = (restaurantSlug: string, tableNumber?: string): string => {
  const origin = getBaseOrigin();
  const base = `${origin}/menu/${restaurantSlug}`;
  if (tableNumber) {
    return `${base}?table=${tableNumber}`;
  }
  return base;
};

export const generateQRCodeDataURL = async (text: string, width = 300): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      width,
      margin: 2,
      color: {
        dark: '#2C3129', // DINEFLOW deep charcoal
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Failed to generate QR Code Data URL', err);
    return '';
  }
};

export const generateQRCodeSVG = async (text: string): Promise<string> => {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#2C3129',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Failed to generate QR Code SVG', err);
    return '';
  }
};

export const downloadQRCodePNG = async (url: string, fileName: string): Promise<void> => {
  const dataUrl = await generateQRCodeDataURL(url, 600);
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadQRCodeSVG = async (url: string, fileName: string): Promise<void> => {
  const svgString = await generateQRCodeSVG(url);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.svg`;
  link.href = blobUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};
