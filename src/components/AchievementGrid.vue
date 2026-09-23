<script setup>
defineProps({
  achievements: { type: Array, required: true }
});
</script>

<template>
  <section class="panel">
    <div class="section-title">
      <h2>成就徽章</h2>
      <span>{{ achievements.filter((achievement) => achievement.unlocked).length }}/{{ achievements.length }}</span>
    </div>
    <div class="badge-grid">
      <article
        v-for="achievement in achievements"
        :key="achievement.id"
        class="badge-card"
        :class="{ unlocked: achievement.unlocked }"
      >
        <span class="badge-mark">{{ achievement.unlocked ? '✓' : '·' }}</span>
        <strong>{{ achievement.name }}</strong>
        <p>{{ achievement.description }}</p>
      </article>
    </div>
  </section>
</template>
