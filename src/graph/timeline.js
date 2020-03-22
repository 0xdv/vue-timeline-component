import * as d3 from 'd3'

import events from './events'
import axis from './axis'
import zoom from './zoom'
import cursor from './cursor'
import layout from './layout'

//import { toRoman } from 'roman-numerals'

export default (config) => {
    function init(selection) {
        console.log('timeline init')
        selection.selectAll('svg').remove()

        let data = selection.data()

        let events = data[0]
        layout.generate(events)
        console.table(events)

        let {
            viewWidth = 800,
            viewHeight = 200,
            widthResizable = true,
            margin,
            onEventClick,
            showCursor = true,
        } = config

        if (widthResizable) {
            viewWidth = selection.node().clientWidth
        }

        let width = viewWidth - margin.right - margin.left
        let height = viewHeight - margin.top - margin.bottom

        let svg = selection
                    .append('svg')
                    .datum(data)
                    .attr('width', width + margin.right + margin.left)
                    .attr('height', height + margin.top + margin.bottom)

        let timeScale = d3.scaleTime()
            .domain([
                d3.min(events.map(e => e.start)),
                d3.max(events.map(e => e.end))
            ])
            .range([0, width])

        let graph = svg
                    .append('g')
                    .classed('graph', true)
                    .attr('transform', `translate(${margin.left},${margin.top})`)
        
        let view = graph.append('g')
            .classed('view', true)

        svg.call(zoom({
            timeScale,
            view,
            draw,
        }))
        
        view.call(draw(timeScale, onEventClick, height, showCursor))
    }

    function chart(selection) {
        console.log('timeline constructor')
        chart._init = () => init(selection)
        chart._init()

        if (config.widthResizable) {
            global.addEventListener('resize', chart._init, true)
        }
    }

    function draw(timeScale, onEventClick, height, showCursor) {
        return selection => {
            selection
                .data(selection.data())
                .call(events({
                    timeScale,
                    onEventClick,
                }))
                .call(axis({
                    timeScale,
                    height
                }))
                .call(cursor({
                    showCursor,
                    timeScale,
                    height,
                }))
        }
    }

    return chart

}