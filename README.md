# vue-timeline-component

[![npm package](https://img.shields.io/npm/v/vue-timeline-component.svg)](https://www.npmjs.org/package/vue-timeline-component)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/0xdv/vue-timeline-component/blob/master/LICENSE)

A Vue 3 timeline component powered by D3.js.

## [Live Demo](https://0xdv.github.io/vue-timeline-component/index.html)

## Install

### npm

```bash
npm install vue-timeline-component
```

### CDN

```html
<script src="https://unpkg.com/vue-timeline-component"></script>
```

## Usage

### As a component (recommended)

```vue
<template>
  <VueTimeline :data="events" :config="config" />
</template>

<script setup lang="ts">
import { VueTimeline, TimelineSpan, TimelinePoint } from 'vue-timeline-component'
import type { TimelineConfig } from 'vue-timeline-component'

const events = [
  new TimelineSpan('event 1', new Date(2024, 0, 1), new Date(2024, 0, 4)),
  new TimelineSpan('event 2', new Date(2024, 0, 2), new Date(2024, 0, 5)),
  new TimelinePoint(new Date(2024, 0, 3), 'milestone'),
]

const config: TimelineConfig = {
  onClick(item) {
    console.log('Clicked:', item)
  },
}
</script>
```

### As a plugin (global registration)

```ts
import { createApp } from 'vue'
import VueTimelinePlugin from 'vue-timeline-component'

const app = createApp(App)
app.use(VueTimelinePlugin)
app.mount('#app')
```

Then use `<VueTimeline>` anywhere in your templates.

## Props

| Prop     | Type               | Required | Description                              |
| -------- | ------------------ | -------- | ---------------------------------------- |
| `data`   | `TimelineItem[]`   | Yes      | Array of spans and/or points             |
| `config` | `TimelineConfig`   | No       | Configuration options                    |

### `TimelineItem`

A `TimelineItem` is either a `TimelineSpan` or a `TimelinePoint`. The component automatically distinguishes between them.

### `TimelineSpan`

```ts
class TimelineSpan {
  constructor(name: string, start: Date, end?: Date)
}
```

### `TimelinePoint`

```ts
class TimelinePoint {
  constructor(date: Date, description: string)
}
```

### `TimelineConfig`

```ts
interface TimelineConfig {
  viewWidth?: number       // Default: 800
  viewHeight?: number      // Default: 300
  widthResizable?: boolean  // Default: true
  margin?: { top: number; bottom: number; left: number; right: number }
  onClick?: (item: TimelineSpan | TimelinePoint) => void
  showCursor?: boolean      // Default: true
  romanCenturies?: boolean  // Default: false — show Roman numeral century labels (e.g. XIX, XX, XXI) for century-boundary years
}
```

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Build library
npm run typecheck # Type check
```

## Publishing

```bash
npm login
npm publish
```

## License

[MIT](LICENSE)
