<script setup>
import { computed } from 'vue';
import { formatCurrency } from '../utils/date';
import { getManagementRanking, getSavingRanking } from '../utils/rankings';

const props = defineProps({
  items: { type: Array, required: true }
});

const managementRanking = computed(() => getManagementRanking(props.items));
const savingRanking = computed(() => getSavingRanking(props.items));
</script>

<template>
  <section class="stack">
    <div class="toolbar-line">
      <div>
        <p class="eyebrow">Ranking</p>
        <h2>家庭排行榜</h2>
      </div>
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="section-title">
          <h3>物品管理达人榜</h3>
          <span>建档与提醒处理</span>
        </div>
        <article v-for="(person, index) in managementRanking" :key="person.name" class="ranking-row">
          <strong>{{ index + 1 }}</strong>
          <span>{{ person.name }}</span>
          <p>{{ person.count }} 件 · 处理率 {{ person.handledRate }}%</p>
          <b>{{ person.score }}</b>
        </article>
      </section>

      <section class="panel">
        <div class="section-title">
          <h3>维修节约榜</h3>
          <span>花费合理性评分</span>
        </div>
        <article v-for="(person, index) in savingRanking" :key="person.name" class="ranking-row">
          <strong>{{ index + 1 }}</strong>
          <span>{{ person.name }}</span>
          <p>均次 {{ formatCurrency(person.avgCost) }}</p>
          <b>{{ person.score }}</b>
        </article>
      </section>
    </div>
  </section>
</template>
