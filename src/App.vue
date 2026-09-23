<script setup>
import { computed, ref } from 'vue';
import AchievementGrid from './components/AchievementGrid.vue';
import DashboardPanel from './components/DashboardPanel.vue';
import ItemEditor from './components/ItemEditor.vue';
import ItemList from './components/ItemList.vue';
import ProfilePanel from './components/ProfilePanel.vue';
import RankingPanel from './components/RankingPanel.vue';
import ServiceLogForm from './components/ServiceLogForm.vue';
import { useInventoryStore } from './stores/useInventoryStore';
import { normalizeItem } from './utils/items';

const store = useInventoryStore();
const tabs = ['工作台', '物品档案', '维修保养', '统计看板', '排行榜', '个人中心'];
const activeTab = ref('工作台');
const selectedItemId = ref(store.activeItems.value[0]?.id || store.state.items[0]?.id || '');
const editingItem = ref(null);

const selectedItem = computed(() =>
  store.state.items.find((item) => item.id === selectedItemId.value) || store.state.items[0]
);

function editItem(item) {
  editingItem.value = { ...item, serviceRecords: [...(item.serviceRecords || [])] };
  activeTab.value = '物品档案';
}

function createItem() {
  editingItem.value = normalizeItem({
    name: '',
    category: '家电',
    purchaseDate: new Date().toISOString().slice(0, 10),
    warrantyMonths: 12,
    status: '正常使用',
    serviceRecords: []
  });
  activeTab.value = '物品档案';
}

function saveItem(item) {
  store.upsertItem(item);
  selectedItemId.value = item.id;
  editingItem.value = null;
}
</script>

<template>
  <main class="app-shell">
    <aside class="sidebar">
      <div class="brand-block">
        <p class="eyebrow">Home Warranty</p>
        <h1>家庭物品档案与保修管家</h1>
      </div>
      <nav class="nav-list" aria-label="主导航">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="nav-button"
          :class="{ active: activeTab === tab }"
          type="button"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </nav>
      <button class="primary-action" type="button" @click="createItem">新增物品</button>
    </aside>

    <section class="workspace">
      <DashboardPanel
        v-if="activeTab === '工作台'"
        :items="store.activeItems.value"
        :stats="store.stats.value"
        :shares="store.categoryShares.value"
        @edit="editItem"
        @handled="store.markReminderHandled"
      />

      <section v-else-if="activeTab === '物品档案'" class="two-column">
        <ItemEditor :draft="editingItem" @save="saveItem" @cancel="editingItem = null" />
        <ItemList
          :active-items="store.activeItems.value"
          :archived-items="store.archivedItems.value"
          :selected-id="selectedItemId"
          @select="selectedItemId = $event"
          @edit="editItem"
          @status="store.setItemStatus"
        />
      </section>

      <section v-else-if="activeTab === '维修保养'" class="two-column">
        <ServiceLogForm
          :items="store.activeItems.value"
          :selected-id="selectedItemId"
          :technicians="store.state.technicians"
          @select="selectedItemId = $event"
          @save="store.addServiceRecord"
        />
        <ItemList
          :active-items="selectedItem ? [selectedItem] : []"
          :archived-items="[]"
          :selected-id="selectedItemId"
          compact
          @select="selectedItemId = $event"
          @edit="editItem"
          @status="store.setItemStatus"
        />
      </section>

      <section v-else-if="activeTab === '统计看板'" class="stack">
        <DashboardPanel
          :items="store.activeItems.value"
          :stats="store.stats.value"
          :shares="store.categoryShares.value"
          stats-only
          @edit="editItem"
          @handled="store.markReminderHandled"
        />
        <AchievementGrid :achievements="store.achievements.value" />
      </section>

      <RankingPanel
        v-else-if="activeTab === '排行榜'"
        :items="store.state.items"
      />

      <ProfilePanel
        v-else
        :items="store.state.items"
        :stats="store.stats.value"
        :achievements="store.achievements.value"
      />
    </section>
  </main>
</template>
