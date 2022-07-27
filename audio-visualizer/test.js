//const effect = new Effects();

let rad = 100
const signal = {
    x: Xmid,
    y: Ymid
}
let velocity = 5
let accelerationDevide = 50


function getImpact(x, y) {
    const s = pow((x - signal.x), 2) + pow((y - signal.y), 2)
    if (s <= pow(rad, 2)) {
        return {
            x: x,
            y: y,
            s: round(sqrt(pow(rad, 2) - s))
        }
    }
    return null
}



const zohan2 = async () => {
    const m = new Map()
    for (let i of range(2000)) {
        let a = Xmid - 300 + randint(600)
        let b = Ymid - 300 + randint(600)

        m.set(i, {
            x: a,
            y: b
        })
        point(a, b)
    }

    await sleep(0.5)
    clear()
    velocity *= 0.5

    for (let t of range(200)) {
        clear()
        for (const [key, i] of m) {
            const impact = getImpact(i.x, i.y)


            if (!impact || (inRange(i.x, signal.x, 1) && inRange(i.y, signal.y, 1))) {
                point(i.x, i.y)
            } else {
                const speed = (rad-impact.s*0.9)/accelerationDevide
                const im = posTowards(i, signal, speed)
                m.set(key, {
                    x: i.x + im.x,
                    y: i.y + im.y,
                })
                point(i.x + im.x, i.y + im.y)
            }
        }
        await sleep(0.1)
        await pauseHalt()
        rad += 1
    }
}
GatherAudio((data)=>zohan2(data))

