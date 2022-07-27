const body = document.querySelector('body')

const sings= " .:-i|=+%O#@"

for(let i = 0; i< sings.length;i++) {
    const n = document.createElement('div')
    n.style.background = "#222"
    n.style.width = "fit-content"
    for(let j = 0; j< 10;j++) {
        n.innerHTML += sings[i] ||"p"

    }
    body.appendChild(n)
}

const divs = document.querySelectorAll('div')
divs.forEach((i)=> {
    i.innerHTML += " " +i.offsetWidth
})