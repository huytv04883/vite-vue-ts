import { format } from 'date-fns';

export const formatDate = (date: string | Date, pattern = 'dd/MM/yyyy'): string => {
  if (!date) return '';
  return format(new Date(date), pattern);
};

export const formatFirestoreDate = (
  timestamp: { seconds: number; nanoseconds: number },
  pattern = 'dd/MM/yyyy HH:mm',
) => {
  if (!timestamp?.seconds) return '';
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000);
  return format(date, pattern);
};
