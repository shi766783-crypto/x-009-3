<script setup>
import { computed, reactive, watch } from 'vue';
import { categories, itemStatuses } from '../constants/categories';
import { fileToBase64, normalizeItem } from '../utils/items';

const props = defineProps({
  draft: { type: Object, default: null }
});

const emit = defineEmits(['save', 'cancel']);

const emptyDraft = () =>
  normalizeItem({
    name: '',
    category: '家电',
    brandModel: '',
    channel: '',
    purchaseDate: new Date().toISOString().slice(0, 10),
    price: 0,
    warrantyMonths: 12,
    location: '',
    note: '',
    status: '正常使用',
    serviceRecords: []
  });

const form = reactive(emptyDraft());

watch(
  () => props.draft,
  (draft) => {
    Object.assign(form, draft ? normalizeItem(draft) : emptyDraft());
  },
  { immediate: true }
);

const warrantyEndDate = computed(() => normalizeItem(form).warrantyEndDate);

async function setPhoto(event, field) {
  form[field] = await fileToBase64(event.target.files?.[0]);
}

function submit() {
  emit('save', normalizeItem(form));
}
</script>

<template>
  <section class="panel">
    <div class="section-title">
      <h2>{{ draft ? '编辑物品档案' : '新增物品档案' }}</h2>
      <button type="button" class="ghost-button" @click="$emit('cancel')">清空</button>
    </div>

    <form class="form-grid" @submit.prevent="submit">
      <label>
        <span>物品名称</span>
        <input v-model="form.name" required placeholder="如：客厅电视" />
      </label>
      <label>
        <span>类别</span>
        <select v-model="form.category">
          <option v-for="category in categories" :key="category.name" :value="category.name">
            {{ category.name }}
          </option>
        </select>
      </label>
      <label>
        <span>品牌型号</span>
        <input v-model="form.brandModel" placeholder="品牌 / 型号" />
      </label>
      <label>
        <span>购买渠道</span>
        <input v-model="form.channel" placeholder="京东、门店、官网等" />
      </label>
      <label>
        <span>购买日期</span>
        <input v-model="form.purchaseDate" type="date" required />
      </label>
      <label>
        <span>购买价格</span>
        <input v-model.number="form.price" type="number" min="0" step="0.01" />
      </label>
      <label>
        <span>保修期（月）</span>
        <input v-model.number="form.warrantyMonths" type="number" min="0" />
      </label>
      <label>
        <span>保修截止日期</span>
        <input :value="warrantyEndDate" readonly />
      </label>
      <label>
        <span>存放位置</span>
        <input v-model="form.location" placeholder="厨房、书房、储物间" />
      </label>
      <label>
        <span>物品状态</span>
        <select v-model="form.status">
          <option v-for="status in itemStatuses" :key="status" :value="status">{{ status }}</option>
        </select>
      </label>
      <label>
        <span>发票照片</span>
        <input type="file" accept="image/*" @change="setPhoto($event, 'invoicePhoto')" />
      </label>
      <label>
        <span>物品照片</span>
        <input type="file" accept="image/*" @change="setPhoto($event, 'itemPhoto')" />
      </label>
      <label class="wide">
        <span>备注</span>
        <textarea v-model="form.note" rows="3" placeholder="保养注意事项、配件编号、发票说明等" />
      </label>

      <div class="preview-strip wide">
        <img v-if="form.invoicePhoto" :src="form.invoicePhoto" alt="发票照片预览" />
        <img v-if="form.itemPhoto" :src="form.itemPhoto" alt="物品照片预览" />
      </div>

      <button class="primary-action wide" type="submit">保存档案</button>
    </form>
  </section>
</template>
