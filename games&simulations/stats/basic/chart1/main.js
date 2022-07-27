/*
TODO:
- if person does not have a traight from all possible categories that trait should be marked as 0 or ignored from the categories


*/
const persons = Object.entries(DATA)






function plotPersons(person) {
    // plot persons
    const p2 = [...person]
    person.shiftRight(person.length-1)
    ctx.fillStyle = "white"
    ctx.beginPath()
    for(let i = 0;i<person.length;i++) {
        const a = p2[i]
        const b= person[i]
        const mid = [(a[0]+b[0]+conf.x)/3, (a[1]+b[1]+conf.y)/3]
        

        ctx.bezierCurveTo(a[0], a[1], mid[0], mid[1], b[0], b[1]);
    }
    ctx.closePath()
    ctx.fill()

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
        subjects[fields[idx]] = i.middle
    });

    const cashedInfo = CACHE.persons.get(name) 
    if(cashedInfo)
        info = cashedInfo
    else 
        info = getPersonInfo(p[1], subjects)




    for(let i of categories) i.draw()
    plotPersons(info)
    fillText(name, conf.x, conf.y, "black")

    log(usedCacheCat ? "used cache" : "no cache")
    if(!usedCacheCat) CACHE.group.set(fields.join(','), categories)

}



function main() {
    const persons = Object.entries(DATA)
    // persons.forEach(i=> {
    //     if(randint(5)==1) i[1][COLORS.random()] = randint(100)
    //     if(randint(5)==1) i[1][COLORS.random()] = randint(100)
    //     if(randint(5)==1) delete i[1]["blue"]

    // })
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

// const grd = ctx.createLinearGradient(0, 0, 0,Ymax);
// grd.addColorStop(0, '#8ED6FF');
// grd.addColorStop(1, '#004CB3');

ctx.background('#333')
// ctx.fillStyle = grd
// ctx.fillRect(0, 0, 500, 500)
main()