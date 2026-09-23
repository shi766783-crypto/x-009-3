<script setup>
import { reactive, watch } from 'vue';
import { serviceTypes } from '../constants/categories';
import { fileToBase64 } from '../utils/items';

const props = defineProps({
  items: { type: Array, required: true },
  selectedId: { type: String, default: '' },
  technicians: { type: Array, required: true }
});

const emit = defineEmits(['save', 'select']);

const form = reactive({
  date: new Date().toISOString().slice(0, 10),
  type: '维修',
  issue: '',
  resolution: '',
  cost: 0,
  technician: '',
  beforePhoto: '',
  afterPhoto: ''
});

watch(
  () => props.technicians,
  (technicians) => {
    if (!form.technician && technicians.length) {
      form.technician = technicians[0];
    }
  },
  { immediate: true }
);

async function setPhoto(event, field) {
  form[field] = await fileToBase64(event.target.files?.[0]);
}

function submit() {
  if (!props.selectedId) return;
  emit('save', props.selectedId, { ...form });
  Object.assign(form, {
    date: new Date().toISOString().slice(0, 10),
    type: '维修',
    issue: '',
    resolution: '',
    cost: 0,
    technician: form.technician,
    beforePhoto: '',
    afterPhoto: ''
  });
}
</script>

<template>
  <section class="panel">
    <div class="section-title">
      <h2>维修保养记录</h2>
      <span>{{ items.length }} 件可选</span>
    </div>
    <form class="form-grid" @submit.prevent="submit">
      <label class="wide">
        <span>选择物品</span>
        <select :value="selectedId" required @change="$emit('select', $event.target.value)">
          <option v-for="item in items" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </label>
      <label>
        <span>日期</span>
        <input v-model="form.date" type="date" required />
      </label>
      <label>
        <span>类型</span>
        <select v-model="form.type">
          <option v-for="type in serviceTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>
      <label>
        <span>花费金额</span>
        <input v-model.number="form.cost" type="number" min="0" step="0.01" />
      </label>
      <label>
        <span>维修师傅</span>
        <input v-model="form.technician" list="technician-list" />
        <datalist id="technician-list">
          <option v-for="technician in technicians" :key="technician" :value="technician" />
        </datalist>
      </label>
      <label class="wide">
        <span>问题描述</span>
        <textarea v-model="form.issue" rows="3" required />
      </label>
      <label class="wide">
        <span>处理方式</span>
        <textarea v-model="form.resolution" rows="3" />
      </label>
      <label>
        <span>维修前照片</span>
        <input type="file" accept="image/*" @change="setPhoto($event, 'beforePhoto')" />
      </label>
      <label>
        <span>维修后照片</span>
        <input type="file" accept="image/*" @change="setPhoto($event, 'afterPhoto')" />
      </label>
      <button class="primary-action wide" type="submit">添加记录</button>
    </form>
  </section>
</template>
