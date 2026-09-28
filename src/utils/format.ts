// Currency and formatting utility adhering to DINEFLOW financial precision rules

export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }
  // Safe 2-decimal rounding to prevent IEEE 754 float glitches
  const safeRounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeRounded);
};

export const formatCurrencyShort = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const safeRounded = Math.round(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safeRounded);
};

export const formatTime = (isoString?: string): string => {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '--:--';
  }
};

export const formatDate = (isoString?: string): string => {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '--';
  }
};

export const formatDateTime = (isoString?: string): string => {
  if (!isoString) return '--';
  return `${formatDate(isoString)} at ${formatTime(isoString)}`;
};

export const getElapsedMinutes = (isoString: string): number => {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  } catch {
    return 0;
  }
};
