import { categoryByName } from '../constants/categories';
import { getYearsSince } from './date';

export function getDepreciationRate(category) {
  return categoryByName.get(category)?.depreciationRate ?? 0.12;
}

export function getResidualValue(item, now = new Date()) {
  const price = Number(item.price || 0);
  const rate = getDepreciationRate(item.category);
  const years = getYearsSince(item.purchaseDate, now);
  const residual = price * Math.pow(1 - rate, years);
  return Math.max(0, Math.round(residual));
}

export function getDepreciationText(item) {
  const rate = getDepreciationRate(item.category);
  return `${Math.round(rate * 100)}%/年`;
}
