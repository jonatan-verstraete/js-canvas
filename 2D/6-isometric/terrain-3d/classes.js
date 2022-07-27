class Material {
    constructor(val) {
        this.ocean = {...hsl(230, 50, 40, 0.8, true), type: 'water'}
        this.water = {...hsl(210, 60, 50, 0.7, true), type: 'water'}
        this.shallow = {...hsl(195, 60, 60, 0.6, true), type: 'water'}
        this.grass = {...hsl(120, 50, 50, 1, true), type: 'land'}
        this.rock = {...hsl(60, 20, 20, 1, true), type: 'platau'}
        this.earth = {...hsl(45, 50, 30, 1, true), type: 'land'}
        this.sand = {...hsl(40, 40, 80, 1, true), type: 'sand'}
        this.white = {...hsl(0, 0, 100, 1, true), type: 'white'}
        this.black = {...hsl(0, 0, 0, 1, true), type: 'black'}
        this.air = {...hsl(210, 60, 90, 0.0, true), type: 'air'}

        this.val = val
        this.mat = null 
    }
    getByVal(val,{air=false}= {}) {
        //return hsl(val, 50, 50, val > 180 ? 0 : 1, true)
        val = overcount(val, 360)
        if(air) return this.air
        if(val > 240) return this.ocean
        if(val > 210) return this.water
        if(val > 190) return this.shallow
        if(val > 150) return this.sand
        if(val > 140) return this.grass
        if(val > 130) return this.earth
        if(val > 110) return this.rock
        if(val > 40) return this.black
        return this.white
    }
}

/** Number seeder */
class NumSeeder {
    constructor(seed = 0, ) {
      this.s = seed
      this.inc = 0 //randint(10000)
      log('-- seeding:', seed)
    }
    get() { // mulberry32 // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
      //this.inc++
      // return str((posInt(tan(this.inc))))[4]
      let t = this.s += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    } 
}





function rotateX(x, y, z, theta=gThetaX) {
    const X = x
    const Y = y*cos(theta) - z*sin(theta)
    const Z = y*sin(theta) + z*cos(theta)
    return {x:X, y:Y, z:Z}
}
  
  function rotateY(x, y, z, theta=gThetaY) {
    const Y = y
    const X = x*cos(theta) + z*sin(theta)
    const Z = z*cos(theta) + x*sin(theta)
    return {x:X, y:Y, z:Z}
}
  
  function rotateZ(x, y, z, theta=gThetaZ) {
    const X = x*cos(theta) - y*sin(theta)
    const Y = x*sin(theta) + y*cos(theta)
    const Z = z
    return {x:X, y:Y, z:Z}
}


function nameConvert(x, y, z) {
    if(typeof x === 'object') {
        return x.x+';'+x.y+';'+x.z
    }
    return x+';'+y+';'+z
}



/**

            const id = nameConvert(px, py, pz)
            const v = this.#calcualteNeighbours(px, py, pz)
            let mat = {type: ''}
            let pv = gridMap.get(id)
            pv.val = v
            pv.x = px
            pv.y = py
            pv.z = pz
            if(i === iterations-1) {
              mat = material.get(v)
              pv.mat = mat
            }
            gridMap.set(id, pv)
            if(pz >= 1 && material.rock.type != mat.type) break loopz;  
            
 */