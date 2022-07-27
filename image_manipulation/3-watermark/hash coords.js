function const_generator(num = 1, filterd = true) {
    let res = strChuck(String(Math.PI ** -(num/10)).split(".")[1]).filter(i=>i.length >= 2)
    if(filterd) {
        res = res.map((i)=> i.length && +i >= 2 ? +i : "").filter(i=>i)
    }
    return res
}

function const_generator2(num = 1) {
    return String(Math.PI ** -(num/10)).split(".")[1].split("").map(i=>+i)
}


async function strToCoords(str = "", W = 300, H = 400) {
    const hashLength = 32
    const _consts = [
        const_generator(1),
        const_generator(2),
        const_generator(3),
        const_generator(4),
    ].reduce((t, i)=>[...t,...i])

    while(str.length < hashLength) {
        str += _consts[hashLength - str.length]
    }

    let asciFormat = []
    str.split("").forEach((i, idx) => {
        let c = i.charCodeAt(0);
        if (!isNaN(c)) asciFormat.push(c)
    })


    function addAverange(...args) {
        return Math.round( args.reduce((t, i)=> t + i) / args.length)
    }
    

    function reducer(asci) {
        while (asci.length > hashLength) {
            const iN = []
            const arrN = asci.slice(0, hashLength)
            asci = asci.slice(hashLength)


            // get values out of arrN
            if (arrN.length > asci.length) {
                arrN.forEach((i, idx) => {
                    asci[idx] = asci[idx] ? addAverange(asci[idx], arrN[idx]) : arrN[idx]
                })
            } else {
                // values out of asci
                asci.forEach((i, idx) => {
                    asci[idx] = arrN[idx] ? addAverange(asci[idx], arrN[idx]) : asci[idx]
                })
            }
        }
        return asci
    }

    function scale(asci) {
        const res = arrayChuck(asci, 2)
        res.forEach((i, idx)=> {
            i[0] = Math.round( i[0] * W / 255 )
            i[1] = Math.round( i[1] * H / 255 )
        })

        return res
    }


    return scale(reducer(asciFormat))

}