// equation: x_n+1 = r * x_n(1 -x_n)
const gSetup = {
    x: 260,
    y: 800,
    dot1: 0.1,
    coords: false
}
ctx.font = "9px arial"


async function main() {
    const equelibriums = []
    for (let r = 0; r < 10; r += 0.01) {
        const resPoints = []
        let amt2 = 2000
        let xn = 0.5
        r = +r.toFixed(3)

        for (let j = 0; j < amt2; j += 1) {
            if (!xn || xn < 0) amt2 = j
            if (j > amt2 / 3) resPoints.push(xn)
            xn = r * xn * (1 - xn)
        }
        if (r % 0.5 == 0) {
            ctx.fillText(r.toFixed(1) + "|", scaleX(r), 10);
        }
        if (r % 0.1 == 0) {
            ctx.fillText(xn.toFixed(2), 10, scaleY(xn));
        }



        equelibriums.push({
            eq: resPoints,
            idx: r
        })

        // await pauseHalt()
        //await sleep(0.1)

    }
    graphR()

    async function graphR() {
        for (let e of equelibriums) {
            const X = scaleX(e.idx)
            await sleep(0.02)
            await pauseHalt()
            e.eq.forEach(eql => {
                circle(X, scaleY(eql), gSetup.dot1, false, "blue")
            })
        }

    }
}

function scaleY(y, s = gSetup.y) {
    return (Ymid / 10) + (y * s)
}

function scaleX(x, s = gSetup.x) {
    return x * s
}


main()