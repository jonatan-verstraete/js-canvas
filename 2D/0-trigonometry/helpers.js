function log(...a) {
    console.log(...a)
}

async function sleep(s) {
    const ms = (s * 1000)
    return new Promise((resolve) => setTimeout(resolve, ms))
}

document.addEventListener('keydown', function(e){
    if(e.keyCode == 32){
        e.preventDefault()
        pause = !pause
    }
})