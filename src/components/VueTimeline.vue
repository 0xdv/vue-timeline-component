<template>
  <div ref="timelineRef" class="vue-timeline"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type PropType } from 'vue'
import * as d3 from 'd3'
import timelineFactory from '../graph/timeline'
import type { TimelineSpan, TimelinePoint, TimelineConfig, TimelineItem } from '../types'
import { isTimelinePoint, isTimelineSpan } from '../types'

const props = defineProps({
  data: {
    type: Array as PropType<TimelineItem[]>,
    required: true,
  },
  config: {
    type: Object as PropType<TimelineConfig>,
    default: () => ({}),
  },
})

const timelineRef = ref<HTMLDivElement | null>(null)
let chart: ReturnType<typeof timelineFactory> | null = null

function render() {
  if (!timelineRef.value) return

  const spans = props.data.filter(isTimelineSpan) as TimelineSpan[]
  const points = props.data.filter(isTimelinePoint) as TimelinePoint[]

  const sel = d3.select(timelineRef.value)
  sel.selectAll('*').remove()

  chart = timelineFactory({
    widthResizable: true,
    viewHeight: 300,
    margin: {
      top: 0,
      bottom: 30,
      left: 15,
      right: 15,
    },
    ...props.config,
  })

  sel
    .datum([spans, points] as [TimelineSpan[], TimelinePoint[]])
    .call(chart)
}

function updateData() {
  if (!chart?.update || !timelineRef.value) {
    render()
    return
  }

  const spans = props.data.filter(isTimelineSpan) as TimelineSpan[]
  const points = props.data.filter(isTimelinePoint) as TimelinePoint[]
  chart.update(spans, points)
}

onMounted(render)
watch(() => props.data, updateData)
</script>
