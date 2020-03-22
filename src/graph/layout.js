function intersects(event1, event2) {
    let s1 = event1.start, 
        e1 = event1.end,
        s2 = event2.start, 
        e2 = event2.end
    if(!e2 || !e1) { // it's not span
        return false
    } else {
        if ((s2 < s1 && s1 < e2) || (s1 < s2 && s2 < e1)) {
            return true
        } else {
            return false
        }
    }
}

export default {
    generate(data) {
        data.forEach(e => {
            e.duration = e.end ? e.end - e.start : 0
        })
        data.sort((a,b) => b.duration - a.duration)

        let placed = []
        data.forEach(e => {
            e.level = 0
            placed.forEach(p => {
                if(intersects(e, p)) {
                    e.level++
                }
            })
            placed.push(e)
        })
        let maxLevel = 11
        data.forEach(e => e.position = maxLevel - e.level)
    }
}