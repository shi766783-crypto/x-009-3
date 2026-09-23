import { getWarrantyState, isArchived } from './items';

export const achievementCatalog = [
  { id: 'first-item', name: '首次建档', description: '创建第一个物品档案' },
  { id: 'warranty-pro', name: '保修达人', description: '记录 5 件仍在保修的物品' },
  { id: 'service-complete', name: '维修记录完整', description: '累计 5 条维修保养记录' },
  { id: 'inventory-master', name: '物品管理大师', description: '累计建档 20 件物品' },
  { id: 'zero-forgotten', name: '零过保遗忘', description: '没有未处理的过保提醒' },
  { id: 'category-collector', name: '全屋覆盖', description: '覆盖 5 个以上物品类别' },
  { id: 'value-guardian', name: '价值守护者', description: '档案总价值超过 50000 元' },
  { id: 'photo-keeper', name: '影像归档员', description: '5 件物品上传照片或发票' },
  { id: 'maintenance-planner', name: '保养计划师', description: '记录 3 条保养记录' },
  { id: 'archive-cleaner', name: '历史归档员', description: '归档出售或报废物品' },
  { id: 'frugal-repair', name: '精明维修家', description: '平均单次维修花费低于 300 元' },
  { id: 'location-mapper', name: '空间定位师', description: '为 10 件物品填写存放位置' }
];

export function getUnlockedAchievements(items) {
  const activeItems = items.filter((item) => !isArchived(item));
  const records = items.flatMap((item) => item.serviceRecords || []);
  const categories = new Set(items.map((item) => item.category));
  const totalValue = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const warrantyCount = activeItems.filter((item) => getWarrantyState(item) !== 'expired').length;
  const unhandledExpired = activeItems.some(
    (item) => getWarrantyState(item) === 'expired' && !item.reminderHandled
  );
  const photoCount = items.filter((item) => item.itemPhoto || item.invoicePhoto).length;
  const maintenanceCount = records.filter((record) => record.type === '保养').length;
  const archiveCount = items.filter(isArchived).length;
  const avgRepairCost =
    records.length > 0
      ? records.reduce((sum, record) => sum + Number(record.cost || 0), 0) / records.length
      : Infinity;
  const locatedCount = activeItems.filter((item) => item.location).length;

  const unlocked = new Set();
  if (items.length >= 1) unlocked.add('first-item');
  if (warrantyCount >= 5) unlocked.add('warranty-pro');
  if (records.length >= 5) unlocked.add('service-complete');
  if (items.length >= 20) unlocked.add('inventory-master');
  if (items.length > 0 && !unhandledExpired) unlocked.add('zero-forgotten');
  if (categories.size >= 5) unlocked.add('category-collector');
  if (totalValue >= 50000) unlocked.add('value-guardian');
  if (photoCount >= 5) unlocked.add('photo-keeper');
  if (maintenanceCount >= 3) unlocked.add('maintenance-planner');
  if (archiveCount >= 1) unlocked.add('archive-cleaner');
  if (records.length >= 3 && avgRepairCost < 300) unlocked.add('frugal-repair');
  if (locatedCount >= 10) unlocked.add('location-mapper');

  return achievementCatalog.map((achievement) => ({
    ...achievement,
    unlocked: unlocked.has(achievement.id)
  }));
}
