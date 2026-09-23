import { addMonths, toInputDate } from '../utils/date';

const today = new Date();
const monthsAgo = (months) => toInputDate(addMonths(today, -months));

export const technicianLibrary = ['李师傅', '王师傅', '官方售后', '社区维修站'];

export const seedItems = [
  {
    id: 'item-fridge',
    name: '双开门冰箱',
    category: '家电',
    brandModel: 'Haier BCD-520',
    channel: '京东',
    purchaseDate: monthsAgo(28),
    price: 5899,
    warrantyMonths: 36,
    invoicePhoto: '',
    itemPhoto: '',
    location: '厨房',
    note: '每季度清理冷凝器，保留电子发票。',
    status: '正常使用',
    serviceRecords: [
      {
        id: 'svc-fridge-1',
        date: monthsAgo(5),
        type: '保养',
        issue: '冷藏室排水孔清理',
        resolution: '官方售后上门保养',
        cost: 120,
        technician: '官方售后',
        beforePhoto: '',
        afterPhoto: ''
      }
    ],
    reminderHandled: true
  },
  {
    id: 'item-laptop',
    name: '家庭办公笔记本',
    category: '数码',
    brandModel: 'ThinkBook 14+',
    channel: '品牌官网',
    purchaseDate: monthsAgo(22),
    price: 6999,
    warrantyMonths: 24,
    invoicePhoto: '',
    itemPhoto: '',
    location: '书房',
    note: '电池健康度需要持续关注。',
    status: '正常使用',
    serviceRecords: [
      {
        id: 'svc-laptop-1',
        date: monthsAgo(2),
        type: '更换配件',
        issue: '适配器接触不良',
        resolution: '更换原装适配器',
        cost: 269,
        technician: '王师傅',
        beforePhoto: '',
        afterPhoto: ''
      }
    ],
    reminderHandled: false
  },
  {
    id: 'item-chair',
    name: '人体工学椅',
    category: '家具',
    brandModel: 'Ergo X3',
    channel: '线下门店',
    purchaseDate: monthsAgo(42),
    price: 2499,
    warrantyMonths: 24,
    invoicePhoto: '',
    itemPhoto: '',
    location: '书房',
    note: '气压杆已过保，后续维修先估价。',
    status: '闲置',
    serviceRecords: [],
    reminderHandled: false
  }
];
