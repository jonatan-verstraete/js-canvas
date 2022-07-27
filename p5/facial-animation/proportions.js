
// https://content.instructables.com/ORIG/F43/C538/HT3E0FPF/F43C538HT3E0FPF.jpg?auto=webp&frame=1&width=320&md=fb7c8868008a7d532d721d84ffad9235
class Proportions  {
    constructor(x, y, height, width) {
        this.x = x+50
        this.y = y
        this.height = height-120
        this.width = width-120


        const h2 = this.height /2
        const w2 = this.width/2
        const w5 = this.width/5


        const eyeHeight = w5/2
        // eyes
        this.eyes=[
            { //right
                x: w5,
                y: h2-eyeHeight,
                w: w5,
                h: eyeHeight
            },
            {// left
                x: w2+w5/4,
                y: h2-eyeHeight,
                w: w5,
                h: eyeHeight
            },
        ]

    }
    drawSketch(){
        return log('not drawn')
        //rect(this.x, this.y, this.width-this.x, this.height-this.y)

        for(let eye of this.eyes) {
            log(eye)
            ellipse(this.x+eye.x, this.y+eye.y, eye.w, eye.h)
        }
    }
}

/**
    PROPORTIONS:

    eyes: 
        x:      1/5 from both sides of outlineX OR 1/5 from middlelineX
        y:      < middlelineY >
        width:  1/5 width
        height: ..
    nose:
        x:      < middleLineX >
        y:      < middleLineX >
        width:  1/5 width
        height: 1/4 height

 */

/*
    LINES:

    chin: 
        - 6 points
        - from ear to ear
        - everything lower is irrelevant
    
    eyes:
        - 2 or 4 points




*/