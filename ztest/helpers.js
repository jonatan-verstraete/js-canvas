function gt() {return new Date().getTime()}
let uidCounter = 0
let lt  = gt()
const fill = []

function unique(padding=20) {
    let t = gt()
    try {
        let r = range0(padding)
        if(lt !== t) {
            uidCounter = 0
            return r.join('')+t
        } else {
            uidCounter += 1
            let c = str(uidCounter)
            r.splice(r.length-c.length, c.length, c)
            return r.join('')+t
        }
    } catch (err) {
    } finally {
        lt = t
    }
}




// shift array right
function shiftA(arr, amt = 1, right=true, isStr=false) {
    if(isStr) arr = arr.split('')
    for(let i of range(amt)) {
        if(right) arr.unshift(arr.pop())
        else arr.push(arr.shift())
    }
    return arr
}



function single(nr) {
    while(str(nr).length > 1) {
        nr = str(nr).split('').map(i=>+i).reduce((t, c,idx , arr)=> {
            return t + c
        }, 0)
    }
    return nr
}


function hash(s, iterations = 10) {
    let arr = s.split('')
    for(let i of range(iterations)){
        arr=arr.map((i, idx) => {
            return single(int(i)+idx)
        });
        arr = shiftA(arr)
    }
    log(s, arr.join(''))
    return arr.join('')
}