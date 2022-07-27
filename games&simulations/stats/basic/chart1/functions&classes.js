// setup object
const conf = {
    x: 300, 
    y: 300,
    r: 200,
    width: 40,
    categories: [],//"blue", "red", "yellow", "green", "orange", "purple", "pink", "cyan", "peru",
}

const CACHE = {
    // cache by categories. eg. "blue,red,pink": [<Category>,<Category>,<Category>]
    group: new Map(),
    // seperate categories classes (does it matter?)
    persons: new Map()
}

// class Category
class Category {
    constructor(pt, name) {
        if(pt && name) this.init(pt, name)
    }
    init(pt, name) {
        this.x1 = pt[0][0]
        this.y1 = pt[0][1]
        this.x2 = pt[1][0]
        this.y2 = pt[1][1]

        this.name = name
        this.color = name//COLORS.next()

        const {x, y} = posTowards({x:this.x1, y:this.y1}, conf, conf.width)
        const {x:x2, y:y2} = posTowards({x:this.x2, y:this.y2}, conf, conf.width)

        this.pts = [
            {x:this.x1, y:this.y1},
            {x:this.x2, y:this.y2},
            {x:this.x2+x2, y:this.y2+y2},
            {x:this.x1+x, y:this.y1+y},
        ]
        const {x:tx, y:ty} = posTowards({x:this.x1, y:this.y1}, {x:this.x2+x2, y:this.y2+y2}, conf.width*2)
        this.middle = {x:this.x1+tx, y:this.y1+ty}
    }
    draw(name=this.name) {
        ctx.fillStyle=this.color
        ctx.beginPath()
        for(let i of this.pts) {
            ctx.lineTo(i.x, i.y)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.fill()

        fillText(name, this.middle.x, this.middle.y, "black")
    }
}


// get point in circle
function getPoint(deg=int) {
    const {x, y, r} = conf
    return [x+(r * cos(deg)),y+(r * sin(deg))]
}

// get coordinates of point based on the values
function getPersonInfo(person, subjects) {
    const res = []
    for(let i of Object.entries(person)){
        if(!subjects[i[0]]) continue
        const {x, y} = subjects[i[0]]
        const {x:_x, y:_y} = posTowards(subjects[i[0]], conf, conf.r/2-mapNums(i[1], 0, 100, 0, (conf.r-conf.width)/2))
        res.push([ x+_x, y+_y])
    }
    return res
}



function setup() {
    const cats = []
    for(let i of Object.values(DATA)) {
        for(let key of Object.keys(i)) {
            if(!cats.includes(key)) cats.push(key)
        }
    }
    // set all possible categories
    setup.categories = cats
}

setup()



/*
function animatePerson(person) {
    const p = Object.entries(person)
    const fields = Object.keys(p[1])
    const name = p[0]
    let data = null
    if(CACHE.persons[name]) {
        data = CACHE.persons[name]
    } else {
        showCategories(fields)
    }
}

function showCategories(fields) {
    let useCached = false
    let categories = []

    if(CACHE.group[fields.join(',')]) {
        useCached=true
        categories= CACHE.group[fields.join(',')]
    } else {
        for(let i of fields) {
            if(CACHE.category[i]) categories.push(CACHE.category[i])
            else categories.push(new Category())
        }
    }


}

*/