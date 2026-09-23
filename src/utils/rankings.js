import { getWarrantyState, isArchived } from './items';

const familyMembers = ['我', '伴侣', '父母', '孩子'];

export function getManagementRanking(items) {
  const mine = {
    name: '我',
    count: items.filter((item) => !isArchived(item)).length,
    handledRate: getHandledRate(items)
  };
  const generated = familyMembers
    .filter((name) => name !== '我')
    .map((name, index) => ({
      name,
      count: Math.max(1, mine.count - index - 1),
      handledRate: Math.max(58, mine.handledRate - 8 + index * 5)
    }));
  return [mine, ...generated]
    .map((person) => ({
      ...person,
      score: Math.round(person.count * 8 + person.handledRate * 0.6)
    }))
    .sort((a, b) => b.score - a.score);
}

export function getSavingRanking(items) {
  const records = items.flatMap((item) => item.serviceRecords || []);
  const cost = records.reduce((sum, record) => sum + Number(record.cost || 0), 0);
  const avgCost = records.length ? cost / records.length : 0;
  const myScore = Math.max(60, Math.round(100 - avgCost / 15 + records.length * 3));
  return [
    { name: '我', score: myScore, avgCost },
    { name: '伴侣', score: Math.max(58, myScore - 7), avgCost: avgCost + 80 },
    { name: '父母', score: Math.max(55, myScore - 13), avgCost: avgCost + 140 }
  ].sort((a, b) => b.score - a.score);
}

function getHandledRate(items) {
  const reminderItems = items.filter((item) => {
    const state = getWarrantyState(item);
    return state === 'expiring' || state === 'expired';
  });
  if (!reminderItems.length) return 100;
  const handled = reminderItems.filter((item) => item.reminderHandled).length;
  return Math.round((handled / reminderItems.length) * 100);
}
