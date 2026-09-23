<script setup>
import { computed } from 'vue';
import { formatCurrency } from '../utils/date';
import { getResidualValue } from '../utils/depreciation';
import { getWarrantyState } from '../utils/items';

const props = defineProps({
  items: { type: Array, required: true },
  stats: { type: Object, required: true },
  achievements: { type: Array, required: true }
});

const serviceRecords = computed(() =>
  props.items
    .flatMap((item) =>
      (item.serviceRecords || []).map((record) => ({
        ...record,
        itemName: item.name
      }))
    )
    .sort((a, b) => b.date.localeCompare(a.date))
);

const reminders = computed(() =>
  props.items.filter((item) => ['expiring', 'expired'].includes(getWarrantyState(item)))
);
</script>

<template>
  <section class="stack">
    <div class="toolbar-line">
      <div>
        <p class="eyebrow">Profile</p>
        <h2>个人中心</h2>
      </div>
      <span class="soft-pill">已解锁 {{ achievements.filter((item) => item.unlocked).length }} 枚徽章</span>
    </div>

    <div class="metric-grid">
      <article class="metric-card">
        <span>我的档案</span>
        <strong>{{ items.length }}</strong>
      </article>
      <article class="metric-card">
        <span>维修历史</span>
        <strong>{{ serviceRecords.length }}</strong>
      </article>
      <article class="metric-card warning">
        <span>保修提醒</span>
        <strong>{{ reminders.length }}</strong>
      </article>
      <article class="metric-card">
        <span>折旧后资产</span>
        <strong>{{ formatCurrency(stats.residualValue) }}</strong>
      </article>
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="section-title">
          <h3>我的物品档案</h3>
          <span>{{ formatCurrency(stats.totalValue) }}</span>
        </div>
        <article v-for="item in items" :key="item.id" class="profile-row">
          <span>{{ item.name }}</span>
          <p>{{ item.category }} · {{ item.status }}</p>
          <strong>{{ formatCurrency(getResidualValue(item)) }}</strong>
        </article>
      </section>

      <section class="panel">
        <div class="section-title">
          <h3>维修历史</h3>
          <span>{{ serviceRecords.length }} 条</span>
        </div>
        <div v-if="!serviceRecords.length" class="empty-state">暂无维修保养记录。</div>
        <article v-for="record in serviceRecords" :key="record.id" class="profile-row">
          <span>{{ record.itemName }}</span>
          <p>{{ record.date }} · {{ record.type }} · {{ record.technician || '未填写师傅' }}</p>
          <strong>{{ formatCurrency(record.cost) }}</strong>
        </article>
      </section>
    </div>
  </section>
</template>
