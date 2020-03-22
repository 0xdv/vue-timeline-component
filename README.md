# vue-timeline-component

[![npm package](https://img.shields.io/npm/v/vue-timeline-component.svg)](https://www.npmjs.org/package/vue-timeline-component)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/0xdv/vue-timeline-component/blob/master/LICENSE)

## Install

```js
npm install vue-timeline-component
```

## Usage

```html
<template>
  <div id="app">
    <vue-timeline :data="data"></vue-timeline>
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
      data: [{
          id: 1,
          name: "example",
          start: new Date(2001, 1,1),
          end: new Date(2020, 1,1),
          position: 5
      }]
    }
  },
}
</script>
```
