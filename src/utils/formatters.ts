export const formatCurrency = (amount: number): string => {
  return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-PH');
};

export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export const WORKING_DAYS: Record<string, number> = {
  January: 23, February: 20, March: 21, April: 22, May: 22, June: 21,
  July: 23, August: 22, September: 21, October: 23, November: 20, December: 22
};
