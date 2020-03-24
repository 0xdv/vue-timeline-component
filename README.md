# vue-timeline-component

[![npm package](https://img.shields.io/npm/v/vue-timeline-component.svg)](https://www.npmjs.org/package/vue-timeline-component)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/0xdv/vue-timeline-component/blob/master/LICENSE)

## Install

```js
npm install vue-timeline-component
```
or
```html
<script src="https://unpkg.com/vue-timeline-component"></script>
```

## Usage

```html
<template>
  <div id="app">
    <vue-timeline :data="events"></vue-timeline>
  </div>
</template>
```

```js
<script>
import VueTimeline from "vue-timeline-component"

export default {
  name: 'App',
  components: {
    VueTimeline
  },
  data() {
    return {
      events: [{
          name: "event 1",
          start: new Date(2020, 1,1),
          end: new Date(2020, 1,4),
      },{
          name: "event 2",
          start: new Date(2020, 1,2),
          end: new Date(2020, 1,5),
      },{
          name: "event 3",
          start: new Date(2020, 1,3),
          end: new Date(2020, 1,10),
      }]
    }
  },
}
</script>
```
