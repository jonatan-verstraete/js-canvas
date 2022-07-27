const colonies = []


function main() {
    GRID.init()
    colonies.push( new Colony(300, 300, 'Ghibellines'))
    colonies.push( new Colony(400, 600, 'Guelphs'))

    placeFood(500, 500)
    
    const _ = [...GRID.map.values()].forEach((i, idx)=> {
        if(idx%80==0) i.food = 3

    })


    async function animate() {
        clear()
        GRID.decayScent()
        GRID.show()
        for(let colony of colonies) colony.live()

        await pauseHalt()
        requestAnimationFrame(animate)

    }
    animate()
}

ctx.background("#985")
main()





window.addEventListener('click', function(e) {
    const {x, y}= getMouse(e)
    const {x:_x, y:_y}=GRID.getClosest(x, y)
    GRID.map.get(sCoord(_x, _y)).food = 100
})