
const main = async()=> {
    const wordAnime = new WordAnime()
    const effect = new Effects()

    const form = document.querySelector('form');
    form.elements.input.value = JSON.parse(sessionStorage.getItem("input")) || "x"


    form.addEventListener('submit', async (e)=> {
        e.preventDefault()
        clear()
        triggerAnimations()
    })


    async function triggerAnimations() {
        const val = form.elements['input'].value
        sessionStorage.setItem("input", JSON.stringify(val))

        // set pixels from input
        wordAnime.writeText(val)
        // get pixel value from canvas
        const pxData = await wordAnime.getPixels({borderFiltered: true})


        // limit the lines to the amount of gathered pixels
        effect.linesAmount = pxData.length
        // display effect
        effect.lettersCircle(pxData)
    }

    triggerAnimations()
}


window.resetAnimation = ()=> {
    //sessionStorage.clear()
    window.location.reload()

}

main()