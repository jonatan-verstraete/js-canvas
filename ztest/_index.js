const old = () => {
    let cy = Ymax
    const divFreq = 50
    let i = 0

    async function animate() {
        if (cy < 2) return log('y is too small')
        i += 1
        const lastPts = range(i)
        const lpts = [...lastPts, ...lastPts].sortAc()
        cy -= divFreq
        const pts = range(i + 1)

        for (let n = 0; n < pts.length; n++) {
            await sleep()
            line(Xmid + lpts[n] * divFreq, cy + divFreq, Xmid + pts[n] * divFreq, cy)
            point(Xmid + lpts[n] * divFreq, cy + divFreq, 10, "blue")
            point(Xmid + pts[n] * divFreq, cy, 10, "red")

        }

        await sleep()
        await pauseHalt()
        requestAnimationFrame(animate)
    }
    animate()
}

const old2 = () => {
    let cy = Ymax
    const divFreq = 50
    let i = 0

    async function animate() {
        if (cy < 2) return log('y is too small')
        i += 1
        cy -= divFreq
        const pts = i ** 2
        const d = divFreq / 2

        for (let n of range(i)) {
            await sleep()
            const ya = cy + divFreq
            line(Xmid + n * d, ya, Xmid + n * d + d, cy)
            line(Xmid - n * d, ya, Xmid - n * d - d, cy)
            line(0, ya - divFreq, Xmax, ya - divFreq, "red")
            line(0, ya, Xmax, ya, "blue")


            // line(Xmid+lpts[n]*divFreq,   cy+divFreq,     Xmid+pts[n]*divFreq,    cy)
            // point(Xmid+lpts[n]*divFreq,   cy+divFreq, 10, "blue")
            // point(Xmid+pts[n]*divFreq,    cy, 10, "red")

        }

        await sleep()
        await pauseHalt()
        requestAnimationFrame(animate)
    }


    animate()
}


let cy = Ymax
const divFreq = 50
let i = 0

async function animate() {
    if (cy < 2) return log('y is too small')
    i += 1
    cy -= divFreq
    const pts = i ** 2
    const d = divFreq /2

    for (let n of range(i)) {
        await sleep()
        const ya = cy + divFreq
        const xa = i%2==0? d/2 : 0
        line(Xmid + n * d+xa, ya, Xmid + n * d - d/2 + xa, cy)
        line(Xmid + n * d+xa, ya, Xmid + n * d + d/2 + xa, cy)

        line(Xmid - n * d+xa, ya, Xmid - n * d - d/2 + xa, cy)
        line(Xmid - n * d+xa, ya, Xmid - n * d + d/2 + xa, cy)

    }

    await sleep()
    await pauseHalt()
    requestAnimationFrame(animate)
}


animate()