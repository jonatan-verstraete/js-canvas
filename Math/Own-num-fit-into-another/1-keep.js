function b(r = 10) {
    const res = []
    for(let i of range(r*10)) {
        let idx = 0
        for(let j of range(r)) {
            idx++
            if(i/j === j) res.push(idx+j)
        }
    }
    return res
}

log(b(1000))



function graphXYz(data = [[[0,0], [9,35], [60,50], [92,125], [100,65], [150,150]]], {guides = true, scale = 1, space = 1, margins = 100, color = "red", max = false} ={}) {
    if(!isArray(data[0])) {
        data  = [data]
    }

    function AZ123(d, c = color) {
        ctx.strokeStyle = c
        ctx.beginPath()
        ctx.moveTo(Xmin+margins+d[0][0], Ymax-margins-d[0][1])
        d.forEach(i=>{
            let ax = Xmin+margins+(i[0] * ys)
            let ay = Ymax-margins-(i[1] * xs) 

            ctx.lineTo( ax, ay)
            point(ax, ay, 3, "blue")
            ctx.fillText(`${i[0]};${i[1]}`,ax, ay)
        })
        ctx.stroke()
        ctx.closePath()
    }

    function getScale(num, limit = 50) {
        if(num < limit) {
            return 1
        }
        let r = round(num%(num /limit * 2))
        if(r === 0) {
            r = round(num/limit)
        }
        return r
    }

    const xArr = range( Math.max(data.map(i=>i.reduce((a, i) => a=a>i[0]?a:i[0], 0))))
    const yArr = range( Math.max(data.map(i=>i.reduce((a, i) => a=a>i[1]?a:i[1], 0))))

    const filter = {
        x: getScale(xArr.length),
        y: getScale(yArr.length)
    }
    const xs = (Ymax-margins*2) / (xArr.length+space)
    const ys = (Xmax-margins*2) / (yArr.length+space)


    if(guides){
        ctx.strokeStyle = "black"
    
        line(Xmin+margins, Ymin+margins,   Xmin+margins, Ymax-margins)
        line(Xmin+margins, Ymax-margins,   Xmax-margins, Ymax-margins)

        xArr.forEach((i, idx, arr)=>{ if(idx%filter.x===0 || idx===arr.length-1) ctx.fillText(i, Xmin+margins-15,  Ymax-margins - (i * xs)) })
        yArr.forEach((i, idx, arr)=>{ if(idx%filter.y===0 || idx===arr.length-1) ctx.fillText(i, Xmin+margins +(i * ys),  Ymax-margins+10) })
    }

    data.forEach((d, i, a)=>AZ123(d, hsl((360/a.length)*i))) 

}



// format is e.g. [ [[0,0], [9,35], [60,50], [92,125], [100,100], [150,150]], [[0,0], [19,25], ...], ...]
function graphXY(data = [[[0,0], [9,35], [60,50], [92,125], [100,100], [150,150]]], {guides = true, scale = 2, margins = 100, color = "red", lines = true} ={}) {
    if(!data || !data[0]) {
        return console.error('No data found to graph')
    }
    if(!isArray(data[0])) {
        data  = [data]
    }

    function AZ123(d, c = color) {
        ctx.strokeStyle = c
        ctx.beginPath()
        ctx.moveTo(Xmin+margins+d[0][0], Ymax-margins-d[0][1])
        d.forEach(i=>{
            let ax = Xmin+margins+(i[0] * scale)
            let ay = Ymax-margins-(i[1] * scale) 

            ctx.lineTo( ax, ay)
            // point(ax, ay, 3, "blue")
            // ctx.fillText(`${i[0]};${i[1]}`,ax, ay)
        })
        ctx.stroke()
        ctx.closePath()
    }

    function getScale(num, limit = 5 * scale) {
        let r = round(num%(num /limit * 2))
        if(r === 0) {
            r = round(num/limit)
        }
        return r
    }

    const xArr = range( Math.max(...data.map(i=>i.reduce((a, i) => a=a>i[0]?a:i[0], 0))))
    const yArr = range( Math.max(...data.map(i=>i.reduce((a, i) => a=a>i[1]?a:i[1], 0))))

    const filter = {
        x: getScale(xArr.length),
        y: getScale(yArr.length)
    }
    if(lines) {
        line(Xmin+margins, Ymin+margins,   Xmin+margins, Ymax-margins)
        line(Xmin+margins, Ymax-margins,   Xmax-margins, Ymax-margins)
    }

    if(guides){
        ctx.strokeStyle = "black"

        xArr.forEach((i, idx, arr)=>{ if(idx%filter.x===0 || idx===arr.length-1) ctx.fillText(i, Xmin+margins-15,  Ymax-margins - (i * scale)) })
        yArr.forEach((i, idx, arr)=>{ if(idx%filter.y===0 || idx===arr.length-1) ctx.fillText(i, Xmin+margins +(i * scale),  Ymax-margins+10) })
    }

    data.forEach((d, i, a)=>AZ123(d, hsl((360/a.length)*i, 50, (80/data.length)*i))) 
}