const setup = {
    x: 300, 
    y: 300,
    r: 200,
    width: 40,
    categories: ["blue", "red", "yellow", "green", "orange", "purple", "pink", "cyan", "peru",]
}

/*
TODO:
- setuo.categories should not be predifined
- if person does not have a traight from all possible categories that trait should be marked as 0 or ignored from the categories


*/

function getPoint(deg=int) {
    const {x, y, r} = setup
    return [x+(r * cos(deg)),y+(r * sin(deg))]
}

class Category {
    constructor(pt, name) {
        this.x1 = pt[0][0]
        this.y1 = pt[0][1]
        this.x2 = pt[1][0]
        this.y2 = pt[1][1]

        this.name = name
        this.color = name//COLORS.next()

        const {x, y} = posTowards({x:this.x1, y:this.y1}, setup, setup.width)
        const {x:x2, y:y2} = posTowards({x:this.x2, y:this.y2}, setup, setup.width)

        this.pts = [
            {x:this.x1, y:this.y1},
            {x:this.x2, y:this.y2},
            {x:this.x2+x2, y:this.y2+y2},
            {x:this.x1+x, y:this.y1+y},
        ]
        const {x:tx, y:ty} = posTowards({x:this.x1, y:this.y1}, {x:this.x2+x2, y:this.y2+y2}, setup.width*2)
        this.middle = {x:this.x1+tx, y:this.y1+ty}
    }
    draw() {
        ctx.fillStyle=this.color
        ctx.beginPath()
        for(let i of this.pts) {
            ctx.lineTo(i.x, i.y)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.fill()

        fillText(this.name, this.middle.x, this.middle.y, "black")

    }
}


function getPersonInfo(person, subjects) {
    const res = []
    for(let i of Object.entries(person)){
        if(!subjects[i[0]]) continue
        const {x, y} = subjects[i[0]]
        const {x:_x, y:_y} = posTowards(subjects[i[0]], setup, setup.r/2-mapNums(i[1], 0, 100, 0, (setup.r-setup.width)/2))
        res.push([ x+_x, y+_y])
    }
    return res
}

function plotPersons(person) {
    const p2 = [...person]
    person.shiftRight(setup.categories.length-1)

    ctx.beginPath()
    for(let i = 0;i<person.length;i++) {
        //clear()
        const a = p2[i]
        const b= person[i]
        const mid = [(a[0]+b[0]+setup.x)/3, (a[1]+b[1]+setup.y)/3]

        ctx.bezierCurveTo(a[0], a[1], mid[0], mid[1], b[0], b[1]);
    }
    ctx.closePath()
    ctx.fill()

    // for(let i = 0;i<person.length;i++) {
    //     const a = p2[i]
    //     const b= person[i]

    //     line(a[0], a[1], b[0], b[1]);
    //     line(setup.x, setup.y, b[0], b[1]);
    // }
}

async function formCircle() {
    const pts = []
    const subject = {}

    for(let i=1;i<setup.categories.length+1;i++){
        pts.push(getPoint(degRad((360/setup.categories.length)*i)))
    }

    const categories = pts.map((i, idx)=> {
        const n = pts[idx+1>=pts.length?0:idx+1]
        const cat = new Category([i,n], setup.categories[idx])

        subject[setup.categories[idx]] = cat.middle
        return cat
    })

    const persons = Object.entries(DATA).map((i)=> {
        return {name: i[0], info: getPersonInfo(i[1], subject)}
    })



    async function animate() {
        clear()
        point(setup.x, setup.y, 20, "orange")
        const c = persons.next()
        plotPersons(c.info)
    
        for(let i of categories) i.draw()
        fillText(c.name, setup.x, setup.y, "black")

        await sleep(1)
        requestAnimationFrame(animate)
    }
    animate()
    

}

formCircle()