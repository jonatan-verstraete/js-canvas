// equation: x_n+1 = r * x_n(1 -x_n)


const gSetup = {
    x: 40,
    y: 700,
    dot1: 1,
    coords: false
}


async function main() {
    const equelibriums = []
    for (let i = 1; i < 11; i += 0.1) {
        i = +i.toFixed(3)
        const eq = await findEquelibrium({r: i, showGraph: true})
        // log(i)
        // log("")
        if(eq) {
            equelibriums.push({eq:eq, idx:i})
        } else {
            console.log('q', eq)
        }

        await pauseHalt()
        await sleep(0.5)

        clear()
    }
    graphR()

    function graphR() {
        equelibriums.forEach((e, idx, arr)=> {

            const prev = arr[idx - 1] // .eq[0]
            const X = scaleX(e.idx)
            const Y = scaleY(e.eq)
            e.eq.forEach(eql=> {
                circle(X,  scaleY(eql), gSetup.dot1, false,"blue")
            })
            console.log(prev)


            // if(prev) {
            //     let lx = prev.idx, ly = prev.eq;
            //     linescaleX(lx), scaleY(ly), X, Y)
            // }

            // if(gSetup.coords) ctx.fillText(e.eq.toFixed(3), X - 5, Y - 5);
            // if(gSetup.dot1) circle(X, Y, gSetup.dot1, false,"blue")
        })

    }
}



async function findEquelibrium({interAmt = 361, r = 2.6, xn = 0.5, showGraph = false} = {}) {
    let lx = ly = 0;
    //let s = new secure()
    const resPoints = []
    
    for (let i = 0; i < interAmt; i += 1) {
        if(!xn) return false
        // s.i += 1
        // s.check(()=> console.log(xn))
        if(i > interAmt/ 2) resPoints.push(xn)

        if(showGraph) {
            graph(i, xn)
        }

        lx = i, ly = xn;
        xn =  r * xn * (1 - xn) 
        //if(xn < 0) xn *= -1


        // if(+ly.toFixed(4) == +xn.toFixed(4) || xn <= 0 || xn === -Infinity) {    
        //     return xn === -Infinity ? false : resPoints
        // }
    }
    return xn === -Infinity ? false : resPoints

    
    function graph(x, y) {
        const X = scaleX(x)
        const Y = scaleY(y)

        line(scaleX(lx), scaleY(ly), X, Y)
        if(gSetup.dot1) circle(X, Y, gSetup.dot1, false,"blue")
        if(gSetup.coords) ctx.fillText(y.toFixed(3), X - 5, Y - 5);
    }
} 

function scaleY(y, s = gSetup.y) {
    return (Ymid / 1.5) +  (y * s)
}

function scaleX(x, s = gSetup.x) {
    return x * s
}


main()