import { computed, reactive, watch } from 'vue';
import { seedItems, technicianLibrary } from '../data/seed';
import { getUnlockedAchievements } from '../utils/achievements';
import { createId, normalizeItem } from '../utils/items';
import { getDashboardStats, getCategoryValueShares } from '../utils/stats';

const storageKey = 'home-warranty-manager:v1';

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved?.items) {
      return {
        items: saved.items.map(normalizeItem),
        technicians: saved.technicians?.length ? saved.technicians : technicianLibrary
      };
    }
  } catch {
    localStorage.removeItem(storageKey);
  }
  return {
    items: seedItems.map(normalizeItem),
    technicians: technicianLibrary
  };
}

const state = reactive(loadState());

watch(
  state,
  () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        items: state.items,
        technicians: state.technicians
      })
    );
  },
  { deep: true }
);

export function useInventoryStore() {
  const stats = computed(() => getDashboardStats(state.items));
  const categoryShares = computed(() => getCategoryValueShares(state.items));
  const achievements = computed(() => getUnlockedAchievements(state.items));
  const activeItems = computed(() =>
    state.items.filter((item) => item.status !== '已出售' && item.status !== '已报废')
  );
  const archivedItems = computed(() =>
    state.items.filter((item) => item.status === '已出售' || item.status === '已报废')
  );

  function upsertItem(payload) {
    const item = normalizeItem(payload);
    const index = state.items.findIndex((current) => current.id === item.id);
    if (index >= 0) {
      state.items[index] = item;
    } else {
      state.items.unshift(item);
    }
  }

  function addServiceRecord(itemId, payload) {
    const item = state.items.find((current) => current.id === itemId);
    if (!item) return;
    item.serviceRecords.unshift({
      id: createId('svc'),
      date: payload.date,
      type: payload.type,
      issue: payload.issue?.trim() || '',
      resolution: payload.resolution?.trim() || '',
      cost: Number(payload.cost || 0),
      technician: payload.technician?.trim() || '',
      beforePhoto: payload.beforePhoto || '',
      afterPhoto: payload.afterPhoto || ''
    });
    addTechnician(payload.technician);
  }

  function addTechnician(name) {
    const normalized = name?.trim();
    if (normalized && !state.technicians.includes(normalized)) {
      state.technicians.push(normalized);
    }
  }

  function setItemStatus(itemId, status) {
    const item = state.items.find((current) => current.id === itemId);
    if (item) item.status = status;
  }

  function markReminderHandled(itemId) {
    const item = state.items.find((current) => current.id === itemId);
    if (item) item.reminderHandled = true;
  }

  return {
    state,
    stats,
    categoryShares,
    achievements,
    activeItems,
    archivedItems,
    upsertItem,
    addServiceRecord,
    setItemStatus,
    markReminderHandled
  };
}
