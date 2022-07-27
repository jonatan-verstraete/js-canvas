
async function clock() {

    let i = x = y = angle = 0
    let clokcWise = true




    // while(cond2 && i <= fullDeg) {
    //     if(i > (360 / fullDeg)) {
    //        // i = 0
    //     }
    //     if(!pause) {
    //         clear()
    //         sec()
    //         i += 1
    //     }
    //     await sleep(0.01)

    // }

    sec()


    function sec() {
        angle = ((Math.PI * 2) * (i / fullDeg)) - ((Math.PI * 2) / 4);


        if (clokcWise) {
            x = oX + Math.cos(angle) * rMain
            y = oY + Math.sin(angle) * rMain
        } else {
            x = oX + Math.sin(angle) * rMain
            y = oY + Math.cos(angle) * rMain
        }

        lineoX, oY, x, y)
    }
}

/** !!!!!!
 * CHANGE ANGLE to: ri / 2
 */

async function rainbow() {
    let i  = 0
    while (true) { //i < fullDeg  * 2
        if (!pause) {
            clear(false)
            for(let n = 0; n < 360; n += 10) {
                BaseTriangleEffect(i + n, `hsla(${n}, 100%, 50%)`)
            }
            i += 1
        }
        await sleep(0.01)
    }

}

async function b() {
    let i  = 0
    while (true) { //i < fullDeg  * 2
        if (!pause) {
            clear(false)
            BaseTriangleEffect(i, "#000")
            BaseTriangleEffect(i + 90, "#000")
            BaseTriangleEffect(i + 180, "#000")
            BaseTriangleEffect(i + 270, "#000")
            i += 1
        }
        if (i >= fullDeg * angleDivision) {
           i = 0
        }
        await sleep(0.01)
    }
}
rainbow()