const cn = document.querySelector('#canvas_01')
const ctx = cn.getContext('2d')

cn.height = 750;
cn.width = window.innerWidth - 200;

const oX = cn.width / 2
const oY = cn.height / 2
const cMx = cn.width
const cMy = cn.height
const rMain = 350
const fullDeg = 360
const trianglesArr = []


let pause = false

const angleDivision = 1


