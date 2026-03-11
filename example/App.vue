<template>
  <div>
    <h2>vue-timeline-component</h2>
    <VueTimeline :data="data" :config="config" />
    <p v-if="clicked" style="text-align:center; margin-top:12px">
      Clicked: <strong>{{ clickedLabel }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VueTimeline, TimelineSpan, TimelinePoint, isTimelineSpan } from '../src/index'
import type { TimelineConfig, TimelineItem } from '../src/index'

const clicked = ref<TimelineItem | null>(null)
const clickedLabel = computed(() => {
  if (!clicked.value) return ''
  return isTimelineSpan(clicked.value) ? clicked.value.name : clicked.value.description
})

const data: TimelineItem[] = [
  new TimelineSpan('Research', new Date(2025, 0, 1), new Date(2025, 1, 15)),
  new TimelineSpan('Design', new Date(2025, 1, 1), new Date(2025, 2, 10)),
  new TimelineSpan('Development', new Date(2025, 2, 1), new Date(2025, 5, 30)),
  new TimelineSpan('Testing', new Date(2025, 5, 1), new Date(2025, 7, 15)),
  new TimelineSpan('Launch', new Date(2025, 7, 15), new Date(2025, 8, 1)),
  new TimelinePoint(new Date(2025, 1, 15), 'Milestone: Research Complete'),
  new TimelinePoint(new Date(2025, 5, 30), 'Milestone: Dev Complete'),
]

const config: TimelineConfig = {
  viewHeight: 350,
  onClick(item) {
    clicked.value = item
  },
}
</script>
