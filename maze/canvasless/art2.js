const elms = []
const sings = [ String.fromCharCode("0x" + 2571), String.fromCharCode("0x" + (2571+1)) , String.fromCharCode("0x" + (2571+2)) ]

function createElm() {
    const elm = document.createElement('div')
    elm.id = 'maze_elm'
    const element  = {elm: elm, ct: ''}
    for (let n = 0; n < 805; n++) {
        element.ct += sings[ Math.floor(Math.random() * sings.length) ]
    }
    elms.push(element)
    elm.innerHTML = element.ct
    document.body.appendChild(elm)
}

async function animate() {
    log(1)
    for(let elm of elms) {
        const content = elm.ct.split('')
        for(let i = 0;i < content.length; i++) {
            content[i] = sings[overcount(sings.indexOf(content[i]) + 1, sings.length)]
        }
        elm.ct = content.join('')
        elm.elm.innerHTML = elm.ct
        await sleep(0.5/(elms.length*0.98))
        await pauseHalt()
    }
    requestAnimationFrame(animate)
}

createElm()
animate()