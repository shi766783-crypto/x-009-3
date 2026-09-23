const dayMs = 24 * 60 * 60 * 1000;

export function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toInputDate(value) {
  const date = toDate(value);
  if (!date) return '';
  return date.toISOString().slice(0, 10);
}

export function addMonths(value, months) {
  const date = toDate(value) || new Date();
  const next = new Date(date);
  const expectedDay = next.getDate();
  next.setMonth(next.getMonth() + Number(months || 0));
  if (next.getDate() !== expectedDay) {
    next.setDate(0);
  }
  return next;
}

export function diffInDays(fromValue, toValue) {
  const from = toDate(fromValue);
  const to = toDate(toValue);
  if (!from || !to) return 0;
  return Math.ceil((to.getTime() - from.getTime()) / dayMs);
}

export function getWarrantyEndDate(purchaseDate, warrantyMonths) {
  if (!purchaseDate || !warrantyMonths) return '';
  return toInputDate(addMonths(purchaseDate, Number(warrantyMonths)));
}

export function getWarrantyDaysLeft(item, now = new Date()) {
  const endDate = item.warrantyEndDate || getWarrantyEndDate(item.purchaseDate, item.warrantyMonths);
  return diffInDays(now, endDate);
}

export function getYearsSince(value, now = new Date()) {
  const date = toDate(value);
  if (!date) return 0;
  const years = (now.getTime() - date.getTime()) / (365.25 * dayMs);
  return Math.max(0, years);
}

export function isSameYear(value, year = new Date().getFullYear()) {
  const date = toDate(value);
  return Boolean(date && date.getFullYear() === year);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}
