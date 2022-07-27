// `


// 3<>2 = 5

// nr  {} idx
// 6   {} 2-
// 12 {} 4
// 18 {} 6
// 24 {} 8
// 30 {} 10 

// nr = 3
// targ = 2
// intv = 5




// function FitsItNum<Int>(int a, int b){} 
//     => true/false ? (a / (a/b)) % b === 0





// `
const intRange = 20
const diagnoseSize = 20
const diagnoseSizeX = diagnoseSize
const diagnoseSizeY = diagnoseSize

let intChange = 1
let startCount = 0




function prArr(a, c = false){
    if(c){
        a.forEach(i => log(i))
    }
}

// ? @a firts into @b
function f(b, a){  
    let res = []
    for(let i of range(intRange)){
        i = startCount + i + intChange
        let c = i * a
        if(c % b === 0){
            res.push(`${i}|  i${""} ${c},  f{} ${c/b}`)
        }
    }
    prArr(res, false)
    return res.length
}

log(f(2))




function diagnoseX(amp = 1){
    let d = []
    let res = []
    for(let i of range(diagnoseSizeX)){
        i = startCount + i + 1
        let a = i + amp
        let b = i + amp * 2
        d.push(`'${b}' fits '${f(a, b)}' times into '${a}'`)
        res.push(f(a, b))
    }
     
    prArr(res, false)
    return res
}

function diagnoseY(){
    let res = []
    for(let i of range(diagnoseSizeY)){
        i +=1
        res.push(diagnoseX(i))
    }
     
    
    const diagnosticN = new range0(diagnoseSizeY)

    for(let i of res){
        for(let j of range(diagnoseSizeY)){
            diagnosticN[j] += i[j]
        }
    }
    
    return res
}
        








function setupGrpahData(data, dx = 2, dy = 2) {
    const graphData = []

    for(let i of data) {
        let idx = 0
        const cData = []
        for(let j of i) {
            cData.push([idx, j *dx])
            idx+=dy
        }
        graphData.push(cData)
    }
    return graphData
}
const c = diagnoseY() //setupGrpahData(diagnoseY()).map(i=>i.join('_'))
prArr(c, true)

let s = 10
async function animation() {
    // clear()
    const diagnoseData = diagnoseY()
    graphXY(setupGrpahData(diagnoseData, s, s), {scale: 6, guides:false})
    // s+=0.1
    intChange-=0.01
    await sleep()
    await pauseHalt()
    requestAnimationFrame(animation)
}

animation()


