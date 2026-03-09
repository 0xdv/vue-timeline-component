<template>
  <div ref="timelineRef" class="vue-timeline"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, type PropType } from 'vue'
import * as d3 from 'd3'
import timeline from '../graph/timeline'
import type { TimelineEvent, TimelineConfig } from '../graph/types'

const props = defineProps({
  data: {
    type: Array as PropType<TimelineEvent[]>,
    required: true,
  },
  config: {
    type: Object as PropType<TimelineConfig>,
    default: () => ({}),
  },
})

const timelineRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!timelineRef.value) return

  d3.select(timelineRef.value)
    .datum(props.data)
    .call(
      timeline({
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
    )
})
</script>
