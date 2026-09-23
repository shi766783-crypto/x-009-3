<script setup>
import { reminderStates } from '../constants/categories';
import { getResidualValue } from '../utils/depreciation';
import { formatCurrency, getWarrantyDaysLeft } from '../utils/date';
import { getWarrantyState } from '../utils/items';

defineProps({
  activeItems: { type: Array, required: true },
  archivedItems: { type: Array, required: true },
  selectedId: { type: String, default: '' },
  compact: { type: Boolean, default: false }
});

defineEmits(['select', 'edit', 'status']);
</script>

<template>
  <section class="panel">
    <div class="section-title">
      <h2>物品档案</h2>
      <span>{{ activeItems.length }} 件在管</span>
    </div>

    <div class="item-card-list" :class="{ compact }">
      <article
        v-for="item in activeItems"
        :key="item.id"
        class="item-card"
        :class="{ selected: selectedId === item.id }"
      >
        <button type="button" class="item-main" @click="$emit('select', item.id)">
          <img v-if="item.itemPhoto" :src="item.itemPhoto" alt="" />
          <div v-else class="image-placeholder">{{ item.category.slice(0, 2) }}</div>
          <div>
            <div class="item-heading">
              <strong>{{ item.name }}</strong>
              <span class="status-chip" :class="getWarrantyState(item)">
                {{ reminderStates[getWarrantyState(item)] }}
              </span>
            </div>
            <p>{{ item.brandModel || '未填写型号' }} · {{ item.location || '未定位' }}</p>
            <p>
              保修 {{ getWarrantyDaysLeft(item) >= 0 ? '剩余' : '过期' }}
              {{ Math.abs(getWarrantyDaysLeft(item)) }} 天 · 残值
              {{ formatCurrency(getResidualValue(item)) }}
            </p>
          </div>
        </button>
        <div class="card-actions">
          <button type="button" class="ghost-button" @click="$emit('edit', item)">编辑</button>
          <select :value="item.status" @change="$emit('status', item.id, $event.target.value)">
            <option>正常使用</option>
            <option>闲置</option>
            <option>已出售</option>
            <option>已报废</option>
          </select>
        </div>
        <div v-if="item.serviceRecords?.length" class="service-preview">
          <strong>最近记录</strong>
          <p>
            {{ item.serviceRecords[0].date }} · {{ item.serviceRecords[0].type }} ·
            {{ item.serviceRecords[0].issue || '未填写问题' }}
          </p>
        </div>
      </article>
    </div>

    <details v-if="archivedItems.length" class="archive-block">
      <summary>历史归档 {{ archivedItems.length }} 件</summary>
      <article v-for="item in archivedItems" :key="item.id" class="archive-row">
        <span>{{ item.name }}</span>
        <strong>{{ item.status }}</strong>
      </article>
    </details>
  </section>
</template>
