export const categories = [
  { name: '家电', depreciationRate: 0.15, color: '#2563eb' },
  { name: '数码', depreciationRate: 0.3, color: '#7c3aed' },
  { name: '家具', depreciationRate: 0.08, color: '#16a34a' },
  { name: '交通工具', depreciationRate: 0.18, color: '#ea580c' },
  { name: '服饰', depreciationRate: 0.35, color: '#db2777' },
  { name: '贵重物品', depreciationRate: 0.04, color: '#ca8a04' },
  { name: '其他', depreciationRate: 0.12, color: '#64748b' }
];

export const categoryNames = categories.map((category) => category.name);

export const categoryByName = new Map(
  categories.map((category) => [category.name, category])
);

export const itemStatuses = ['正常使用', '闲置', '已出售', '已报废'];

export const serviceTypes = ['维修', '保养', '更换配件'];

export const reminderStates = {
  ok: '保修中',
  expiring: '建议延保',
  expired: '已过保'
};
