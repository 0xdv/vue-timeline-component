<template>
  <div>
    <h2>vue-timeline-component</h2>
    <VueTimeline :data="events" :config="config" />
    <p v-if="clicked" style="text-align:center; margin-top:12px">
      Clicked: <strong>{{ clicked.name }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueTimeline } from '../src/index'
import type { TimelineEvent, TimelineConfig } from '../src/index'

const clicked = ref<TimelineEvent | null>(null)

const events: TimelineEvent[] = [
  { name: 'Research', start: new Date(2025, 0, 1), end: new Date(2025, 1, 15) },
  { name: 'Design', start: new Date(2025, 1, 1), end: new Date(2025, 2, 10) },
  { name: 'Development', start: new Date(2025, 2, 1), end: new Date(2025, 5, 30) },
  { name: 'Testing', start: new Date(2025, 5, 1), end: new Date(2025, 7, 15) },
  { name: 'Launch', start: new Date(2025, 7, 15), end: new Date(2025, 8, 1) },
]

const config: TimelineConfig = {
  viewHeight: 350,
  onEventClick(event) {
    clicked.value = event
  },
}
</script>
