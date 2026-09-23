<script setup>
import { computed } from 'vue';
import { reminderStates } from '../constants/categories';
import { getDepreciationText, getResidualValue } from '../utils/depreciation';
import { formatCurrency, getWarrantyDaysLeft } from '../utils/date';
import { getWarrantyState } from '../utils/items';
import { getPieGradient } from '../utils/stats';

const props = defineProps({
  items: { type: Array, required: true },
  stats: { type: Object, required: true },
  shares: { type: Array, required: true },
  statsOnly: { type: Boolean, default: false }
});

defineEmits(['edit', 'handled']);

const reminders = computed(() =>
  props.items
    .map((item) => ({
      ...item,
      daysLeft: getWarrantyDaysLeft(item),
      warrantyState: getWarrantyState(item)
    }))
    .filter((item) => item.warrantyState !== 'ok')
    .sort((a, b) => a.daysLeft - b.daysLeft)
);
</script>

<template>
  <section class="stack">
    <div class="toolbar-line">
      <div>
        <p class="eyebrow">Overview</p>
        <h2>家庭资产工作台</h2>
      </div>
      <span class="soft-pill">localStorage 自动保存</span>
    </div>

    <div class="metric-grid">
      <article class="metric-card">
        <span>物品总数</span>
        <strong>{{ stats.totalCount }}</strong>
      </article>
      <article class="metric-card">
        <span>总价值</span>
        <strong>{{ formatCurrency(stats.totalValue) }}</strong>
      </article>
      <article class="metric-card">
        <span>保修中</span>
        <strong>{{ stats.warrantyCount }}</strong>
      </article>
      <article class="metric-card warning">
        <span>已过保</span>
        <strong>{{ stats.expiredCount }}</strong>
      </article>
      <article class="metric-card">
        <span>本年维修花费</span>
        <strong>{{ formatCurrency(stats.yearlyServiceCost) }}</strong>
      </article>
      <article class="metric-card">
        <span>估算残值</span>
        <strong>{{ formatCurrency(stats.residualValue) }}</strong>
      </article>
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="section-title">
          <h3>类别价值占比</h3>
          <span>{{ shares.length }} 类</span>
        </div>
        <div class="chart-row">
          <div class="pie-chart" :style="{ background: getPieGradient(shares) }" />
          <ul class="legend-list">
            <li v-for="share in shares" :key="share.name">
              <span class="legend-dot" :style="{ background: share.color }" />
              <span>{{ share.name }}</span>
              <strong>{{ share.percent }}%</strong>
            </li>
          </ul>
        </div>
      </section>

      <section class="panel">
        <div class="section-title">
          <h3>保修提醒</h3>
          <span>{{ reminders.length }} 条</span>
        </div>
        <div v-if="!reminders.length" class="empty-state">暂无即将到期或已过保物品。</div>
        <article v-for="item in reminders" :key="item.id" class="reminder-row">
          <div>
            <strong>{{ item.name }}</strong>
            <p>
              {{ item.brandModel || '未填写型号' }} · {{ item.daysLeft < 0 ? '过保' : '剩余' }}
              {{ Math.abs(item.daysLeft) }} 天
            </p>
          </div>
          <span class="status-chip" :class="item.warrantyState">
            {{ reminderStates[item.warrantyState] }}
          </span>
          <button type="button" class="ghost-button" @click="$emit('handled', item.id)">
            已处理
          </button>
        </article>
      </section>
    </div>

    <section v-if="!statsOnly" class="panel">
      <div class="section-title">
        <h3>折旧与保修速览</h3>
        <span>{{ items.length }} 件在管</span>
      </div>
      <div class="asset-table">
        <div class="table-head">
          <span>物品</span>
          <span>类别</span>
          <span>折旧率</span>
          <span>当前残值</span>
          <span>状态</span>
        </div>
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="table-row"
          @click="$emit('edit', item)"
        >
          <span>{{ item.name }}</span>
          <span>{{ item.category }}</span>
          <span>{{ getDepreciationText(item) }}</span>
          <span>{{ formatCurrency(getResidualValue(item)) }}</span>
          <span>{{ item.status }}</span>
        </button>
      </div>
    </section>
  </section>
</template>
