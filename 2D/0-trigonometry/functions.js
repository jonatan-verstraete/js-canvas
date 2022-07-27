function X0(add = 0) {
    return oX + add
}

function Y0(add = 0) {
    return oY - add
}


function Circle(x, y, r, fill = "") {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    ctx.stroke();
}

function line(x1, y1, x2, y2, color = '') {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    if (color) ctx.strokeStyle = color
    ctx.stroke();
}

function clear(drawBase = true) {
    ctx.clearRect(0, 0, cn.width, cn.height);
    if(drawBase) {
        ctx.strokeStyle = '#a00';

        Circle(oX, oY, rMain)
        Radline(0, cMy)
        Radline(90, cMx)
        Radline(180, cMy)
        Radline(270, cMx)
        ctx.strokeStyle = '#111';
    }

};

clear()

function Radline(i = 90, s = rMain) {
    const ang = ((Math.PI * 2) * (i / fullDeg)) - ((Math.PI * 2) / 4);

    const xn = oX + Math.cos(ang) * s
    const yn = oY + Math.sin(ang) * s

    line(oX, oY, xn, yn)

}

function shade(cl = "#111") {
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 30;
    ctx.shadowOffsetY = 30;
    ctx.shadowColor = cl
}


function setAngle(n = 90, size = rMain) {
    const ang = ((Math.PI * 2) * (n / fullDeg)) - ((Math.PI * 2) / 4),

    xn = oX + Math.cos(ang) * size,
    yn = oY + Math.sin(ang) * size;
    return { xn, yn }
}


function BaseTriangle(ri = 0, filled = false, shade = false) {
    let { xn, yn } = setAngle()

    ctx.beginPath();
    if(shade) {
        shade(shade)
    }
    ctx.moveTo(oX, oY);

    ({ xn, yn } = setAngle(ri / 2))
    ctx.lineTo(xn, yn);

    ({ xn, yn } = setAngle(ri + 90))

    ctx.lineTo(xn, yn);
    ctx.closePath();

    if (filled) {
        ctx.fillStyle = filled
        ctx.fill()
    } else {
        ctx.stroke();
    }
}

function Triangle2({
        x1 = 0,
        y1 = 0,
        x2 = 90,
        y2 = 30,
        x3 = 40,
        y3 = 80,
        ri = 0,
        shade = false,
        filled = false,
        stroke = true
    } = {}) {
    ctx.beginPath();
    ctx.moveTo(X0(x1), Y0(y1));
    if (shade) {
        shade()
    }

    ctx.lineTo(X0(x2), Y0(y2))
    ctx.lineTo(X0(x3), Y0(y3))

    ctx.closePath();
    if (filled) {
        ctx.fillStyle = filled
        ctx.fill()
    }
    if (stroke) {
        ctx.stroke();
    }
}

function Triangle({x1 = 0, y1 = 0, size = rMain, ri = 0, shade = false, filled = false } = {}) {


    ctx.beginPath();
    if(shade) {
        shade()
    }
    ctx.moveTo(X0(x1), Y0(y1));

    let { xn, yn } = setAngle(ri, size)

    ctx.lineTo(xn + x1, yn + y1);
    ({ xn, yn } = setAngle(ri + 90, size))

    ctx.lineTo(xn - x1, yn - y1);
    ctx.closePath();

    if (filled) {
        ctx.fillStyle = filled
        ctx.fill()
    } else {
        ctx.stroke();
    }
    return {x1: x1, y1: y1, size:size}
}

function BaseTriangleEffect(ri = 0, filled = false, shade = true) {
    let { xn, yn } = setAngle()

    ctx.beginPath();
    if(shade) {
        shade()
    }
    ctx.moveTo(oX, oY);

    ({ xn, yn } = setAngle(ri / angleDivision))
    ctx.lineTo(xn, yn);

    ({ xn, yn } = setAngle(ri + 90))

    ctx.lineTo(xn, yn);
    ctx.closePath();

    if (filled) {
        ctx.fillStyle = filled
        ctx.fill()
    } else {
        ctx.stroke();
    }
}