/*
TODO:
- if person does not have a traight from all possible categories that trait should be marked as 0 or ignored from the categories


*/
const persons = Object.entries(DATA)


function plotPerson(person) {
    for(let p of person) {
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.moveTo(conf.x, conf.y)
        
        ctx.lineTo(p[0], p[1])
        ctx.lineTo(p[2], p[3])
        ctx.closePath()
        ctx.fill()
    }
}



function animatePerson(p) {
    let usedCacheCat = false
    const fields = Object.keys(p[1])
    const name = p[0]
    let categories, info, subjects = {};

    const cashedCat = CACHE.group.get(fields.join(',')) 
    if(cashedCat) {
        categories = cashedCat
        usedCacheCat = true
    } else {
        const pts = range(fields.length).map((i)=> 
            getPoint(degRad((360/fields.length)*(i+1)))
        );
        categories = pts.map((i,idx)=> {
            const n = pts[idx+1>=pts.length?0:idx+1]
            return new Category([i,n], fields[idx])
        });

    }
    categories.forEach((i,idx)=> {
        subjects[i.name] = i
    });

    const cashedInfo = CACHE.persons.get(name) 
    if(cashedInfo)
        info = cashedInfo
    else 
        info = getPersonInfo(p[1], subjects)

    // drawing
    for(let i of categories) i.draw()
    plotPerson(info)
    fillText(name, conf.x, conf.y, "black")

    log(usedCacheCat ? "used cache" : "no cache")
    if(!usedCacheCat) CACHE.group.set(fields.join(','), categories)

}



function main() {
    const persons = Object.entries(DATA)

    async function animate() {
        clear()
        point(conf.x, conf.y, 20, "orange")
        const c = persons.next()
        animatePerson(c)
    
        await sleep(1)
        await pauseHalt()
        requestAnimationFrame(animate)
    }
    animate()
}
//pause=true

// const grd = ctx.createLinearGradient(0, 0, 0,Ymax);
// grd.addColorStop(0, '#8ED6FF');
// grd.addColorStop(1, '#004CB3');

ctx.background('#333')
// ctx.fillStyle = grd
// ctx.fillRect(0, 0, 500, 500)
main()