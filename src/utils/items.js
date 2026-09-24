import { getWarrantyDaysLeft, getWarrantyEndDate } from './date';

export function createId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeItem(raw) {
  const item = {
    id: raw.id || createId('item'),
    name: raw.name?.trim() || '未命名物品',
    category: raw.category || '其他',
    brandModel: raw.brandModel?.trim() || '',
    channel: raw.channel?.trim() || '',
    purchaseDate: raw.purchaseDate || '',
    price: Number(raw.price || 0),
    warrantyMonths: Number(raw.warrantyMonths || 0),
    invoicePhoto: raw.invoicePhoto || '',
    itemPhoto: raw.itemPhoto || '',
    location: raw.location?.trim() || '',
    note: raw.note?.trim() || '',
    status: raw.status || '正常使用',
    serviceRecords: Array.isArray(raw.serviceRecords) ? raw.serviceRecords : [],
    reminderHandled: Boolean(raw.reminderHandled)
  };
  return {
    ...item,
    warrantyEndDate: getWarrantyEndDate(item.purchaseDate, item.warrantyMonths)
  };
}

export function hasWarrantyInfo(item) {
  return Boolean(item.purchaseDate && Number(item.warrantyMonths) > 0);
}

export function getWarrantyState(item, now = new Date()) {
  const daysLeft = getWarrantyDaysLeft(item, now);
  if (daysLeft === null) return 'none';
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 30) return 'expiring';
  return 'ok';
}

export function isArchived(item) {
  return item.status === '已出售' || item.status === '已报废';
}

export function getWarrantyDetail(item, now = new Date()) {
  const daysLeft = getWarrantyDaysLeft(item, now);
  if (daysLeft === null) return '保修信息待补全';
  return `${daysLeft >= 0 ? '保修剩余' : '已过保'} ${Math.abs(daysLeft)} 天`;
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
