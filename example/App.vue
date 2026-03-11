<template>
  <div>
    <h2>vue-timeline-component</h2>
    <VueTimeline :data="events" :points="points" :config="config" />
    <p v-if="clicked" style="text-align:center; margin-top:12px">
      Clicked: <strong>{{ clickedLabel }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VueTimeline } from '../src/index'
import type { TimelineSpan, TimelinePoint, TimelineConfig } from '../src/index'

const clicked = ref<TimelineSpan | TimelinePoint | null>(null)
const clickedLabel = computed(() => {
  if (!clicked.value) return ''
  return 'name' in clicked.value ? clicked.value.name : clicked.value.description
})

const events: TimelineSpan[] = [
  { name: 'Research', start: new Date(2025, 0, 1), end: new Date(2025, 1, 15) },
  { name: 'Design', start: new Date(2025, 1, 1), end: new Date(2025, 2, 10) },
  { name: 'Development', start: new Date(2025, 2, 1), end: new Date(2025, 5, 30) },
  { name: 'Testing', start: new Date(2025, 5, 1), end: new Date(2025, 7, 15) },
  { name: 'Launch', start: new Date(2025, 7, 15), end: new Date(2025, 8, 1) },
]

const points: TimelinePoint[] = [
  { date: new Date(2025, 1, 15), description: 'Milestone: Research Complete' },
  { date: new Date(2025, 5, 30), description: 'Milestone: Dev Complete' },
]

const config: TimelineConfig = {
  viewHeight: 350,
  onClick(item) {
    clicked.value = item
  },
}
</script>
