const theme1 = {
    0: {h: 224, s: 70, l: 10},
    1: {h: 244, s: 50, l: 50},
    2: {h: 215, s: 50, l: 50},
    3: {h: 0, s: 0, l: 27},
    4: {h: 25, s: 25, l: 25},
    5: {h: 100, s: 20, l: 40},
    6: {h: 120, s: 50, l: 50},
    7: {h: 120, s: 40, l: 80},
    8: {h: 120, s: 60, l: 90},
}
const theme2 = {}
for(let i = 0; i < 360;i += 3) {
    theme2[i] = {h:360-i, s: 50, l: 50}
}

function colorManager(color, theme = theme1, exitLoop = false){
    if(color === false) {
        return `hsl(${color}, ${50}%, ${50}%)`
    }
    if(!color) color = 1
    if(color < 0) color = 360 + color

    const cl = theme[Math.floor(Object.size(theme) * ( color) / 360)]
    if(!cl) {
        // log(cl)
        return theme[0] //`hsl(${color}, ${50}%, ${50}%)`
    } 
    return `hsl(${cl.h}, ${cl.s}%, ${cl.l}%)`;
}