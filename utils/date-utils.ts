export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStartOfDay = (date: Date = new Date()): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getEndOfDay = (date: Date = new Date()): Date => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getStartOfWeek = (date: Date = new Date()): Date => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Russian week (Monday-Sunday)
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getEndOfWeek = (date: Date = new Date()): Date => {
  const end = new Date(date);
  const day = end.getDay();
  const diff = end.getDate() + (day === 0 ? 0 : 7 - day); // Adjust for Russian week (Monday-Sunday)
  end.setDate(diff);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getStartOfMonth = (date: Date = new Date()): Date => {
  const start = new Date(date);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getEndOfMonth = (date: Date = new Date()): Date => {
  const end = new Date(date);
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getStartOfYear = (date: Date = new Date()): Date => {
  const start = new Date(date);
  start.setMonth(0, 1);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getEndOfYear = (date: Date = new Date()): Date => {
  const end = new Date(date);
  end.setMonth(11, 31);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getPeriodDates = (
  period: 'day' | 'week' | 'month' | 'year',
  date: Date = new Date()
): { start: Date; end: Date } => {
  switch (period) {
    case 'day':
      return {
        start: getStartOfDay(date),
        end: getEndOfDay(date),
      };
    case 'week':
      return {
        start: getStartOfWeek(date),
        end: getEndOfWeek(date),
      };
    case 'month':
      return {
        start: getStartOfMonth(date),
        end: getEndOfMonth(date),
      };
    case 'year':
      return {
        start: getStartOfYear(date),
        end: getEndOfYear(date),
      };
    default:
      return {
        start: getStartOfDay(date),
        end: getEndOfDay(date),
      };
  }
};

export const formatPeriodLabel = (
  period: 'day' | 'week' | 'month' | 'year',
  date: Date = new Date()
): string => {
  switch (period) {
    case 'day':
      return formatDate(date);
    case 'week': {
      const start = getStartOfWeek(date);
      const end = getEndOfWeek(date);
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    case 'month':
      return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    case 'year':
      return date.getFullYear().toString();
    default:
      return formatDate(date);
  }
};