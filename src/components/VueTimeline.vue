<template>
    <div><div id='timeline'></div></div>
</template>

<script>
import * as d3 from 'd3'

import timeline from '../graph/timeline'

let eventData = [{
    id: 1,
    name: "ddd",
    start: new Date(2001, 1,1),
    end: new Date(2020, 1,1),
    position: 5
}]

export default {
    data() {
        return {

        }
    },
    mounted() {
        d3.select('#timeline')
            .datum(eventData)
            .call(timeline({
                    widthResizable: true,
                    viewHeight: 300,
                    margin: {
                        top: 0,
                        bottom: 30,
                        left: 15,
                        right: 15
                    },
                    //onEventClick: click
                }))
    }
}
</script>