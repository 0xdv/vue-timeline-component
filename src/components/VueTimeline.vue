<template>
    <div id='timeline'></div>
</template>

<script>
import * as d3 from 'd3'

import timeline from '../graph/timeline'

export default {
    props: {
        data: {
            type: Array
        },
        config: {
            type: Object,
            default(){
                return {
                    widthResizable: true,
                    viewHeight: 300,
                    margin: {
                        top: 0,
                        bottom: 30,
                        left: 15,
                        right: 15
                    },
                    onEventClick: this.config?.onEventClick
                }
            }
        }
    },
    mounted() {
        d3.select('#timeline')
            .datum(this.data)
            .call(timeline(this.config))
    }
}
</script>
