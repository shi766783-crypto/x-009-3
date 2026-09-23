import { categories } from '../constants/categories';
import { getResidualValue } from './depreciation';
import { isSameYear } from './date';
import { getWarrantyState, isArchived } from './items';

export function getDashboardStats(items) {
  const activeItems = items.filter((item) => !isArchived(item));
  const totalValue = activeItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const residualValue = activeItems.reduce((sum, item) => sum + getResidualValue(item), 0);
  const warrantyCount = activeItems.filter((item) => getWarrantyState(item) !== 'expired').length;
  const expiredCount = activeItems.filter((item) => getWarrantyState(item) === 'expired').length;
  const currentYear = new Date().getFullYear();
  const yearlyServiceCost = items
    .flatMap((item) => item.serviceRecords || [])
    .filter((record) => isSameYear(record.date, currentYear))
    .reduce((sum, record) => sum + Number(record.cost || 0), 0);

  return {
    totalCount: activeItems.length,
    archivedCount: items.length - activeItems.length,
    totalValue,
    residualValue,
    warrantyCount,
    expiredCount,
    yearlyServiceCost
  };
}

export function getCategoryValueShares(items) {
  const activeItems = items.filter((item) => !isArchived(item));
  const totals = categories.map((category) => {
    const value = activeItems
      .filter((item) => item.category === category.name)
      .reduce((sum, item) => sum + Number(item.price || 0), 0);
    return { ...category, value };
  });
  const grandTotal = totals.reduce((sum, category) => sum + category.value, 0);
  return totals
    .filter((category) => category.value > 0)
    .map((category) => ({
      ...category,
      percent: grandTotal ? Math.round((category.value / grandTotal) * 100) : 0
    }));
}

export function getPieGradient(shares) {
  let cursor = 0;
  const stops = shares.map((share) => {
    const start = cursor;
    cursor += share.percent;
    return `${share.color} ${start}% ${cursor}%`;
  });
  return `conic-gradient(${stops.join(', ') || '#e2e8f0 0% 100%'})`;
}
