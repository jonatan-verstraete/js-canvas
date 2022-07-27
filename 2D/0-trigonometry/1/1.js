async function triangels2() {
    let i = 0,
        cSize = rMain
        nested = 1



    while (i < 1) {
        if (!pause) {
            clear()
            trianglesArr.push({
                x1: 0,
                y1: 0,
                size: cSize
            })

            Triangle({
                x1: 0,
                y1: 0,
                size: cSize
            })
            cSize /= 2

            ctx.strokeStyle = '#f0f';

            trianglesArr.push({
                x1: 0,
                y1: 0,
                size: cSize
            })

            Triangle({
                x1: 0,
                y1: 0,
                size: cSize,
                flip: 1
            })
            cSize /= 2
            
            ctx.strokeStyle = '#00f';
            log(cSize)


            Triangle({
                x1: cSize,
                y1: cSize,
                size: rMain  - cSize,
                flip: 0
            })
            /*
            cSize /= 2

            ctx.strokeStyle = '#0f0';

            Triangle({
                x1: cSize /2,
                y1: cSize / 2,
                size: 0,
                flip: 1
            })
            */

            i += 1

        } else {
            log(i)
            i += 200
        }
        await sleep(0.1)
    }

}

async function triangels() {
    let i = 0;

    const defaultPos = {
        x1: 0,
        y1: 0,
        size: 0
    }



    while (i < 4) {
        if (!pause) {
            //clear()
            const trL = trianglesArr.length
            const { x1:LastX, y1:LastY } = trianglesArr[trL - 1] ||  defaultPos

            const flip = (-1) ** trL
            const sizeN = +( rMain / (2 ** trL ) ).toFixed(3)


            const xn = LastX + (sizeN * flip)
            const yn = LastY + (sizeN * flip)


            const objN = {
                x1: xn,
                y1: yn,
                size: sizeN
            }

            log('objN:', objN, "\n\n")
            log("sizeN", sizeN)
            log(`__ ${i}`)
            log("LastX:", LastX, 'flip:', flip)
            log("LastY:", LastY)


            Triangle(objN)
            trianglesArr.push(objN)

           // log("b: ",xn, yn, sizeN, trianglesArr,   "\n\n")


            i += 1
        }
        await sleep(0.5)
    }
}



triangels()