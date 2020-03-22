export default (config) => selection => {
    let {
        //showCursor,
        timeScale,
        height,
    } = config

   // if (!showCursor) return //issue with zoom

    let now = timeScale(Date.now())

    let cursor = selection.selectAll('.cursor').data(d => d)

    let g = cursor.enter()
            .append('g')
            .classed('cursor', true)
            .attr('transform', `translate(${now})`)

    g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', height)
        .attr('stroke', 'red')
    
    cursor.attr('transform', `translate(${now})`)
}