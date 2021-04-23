var c = document.getElementById("main_canvas");
var containerCanva = document.getElementsByClassName('canva_container')[0];
var ctx = c.getContext("2d");

const widthScreen = 500;
const heightScreen = 500;
const amountAxis = 4;
const pointAxisRadius = 10;

var axis = [
    // {
    //     x: 487,
    //     y: 444
    // },
    // {
    //     x: 18,
    //     y: 276
    // },
    // {
    //     x: 64,
    //     y: 352
    // },
    // {
    //     x: 370,
    //     y: 496
    // }
]

// ctx.moveTo(randomX, randomY);
// ctx.lineTo(50, 100);
// ctx.stroke();

// ctx.beginPath();
// ctx.arc(randomX, randomY, 40, 0, 2 * Math.PI);
// ctx.stroke();

function generatePointAxis(axisX, axisY, index) {
    const pointAxis = document.createElement('div');
    pointAxis.classList.add('point_axis');
    pointAxis.id = `axis_${index}`;
    pointAxis.style.top = `${axisY - pointAxisRadius}px`;
    pointAxis.style.left = `${axisX - pointAxisRadius}px`;
    pointAxis.draggable = true;
    containerCanva.appendChild(pointAxis);

    pointAxis.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        pointAxis.style.top = (pointAxis.offsetTop - pos2) + "px";
        pointAxis.style.left = (pointAxis.offsetLeft - pos1) + "px";
        const indexOnAxis = e.target.id.split("_")[1];
        axis[indexOnAxis] = { x: e.x, y: e.y }
        generateConnectionPoints();
    }

    function closeDragElement(e) {
        document.onmouseup = null;
        document.onmousemove = null;

        pointAxis.style.top = `${e.y - pointAxisRadius}px`;
        pointAxis.style.left = `${e.x - pointAxisRadius}px`;

        const indexOnAxis = e.target.id.split("_")[1];
        axis[indexOnAxis] = { x: e.x, y: e.y }
        generateConnectionPoints();
    }
}

for (let i = 0; i < amountAxis; i++) {
    const randomY = Math.floor(Math.random() * heightScreen);
    const randomX = Math.floor(Math.random() * widthScreen);
    // const randomY = axis[i].y;
    // const randomX = axis[i].x;
    generatePointAxis(randomX, randomY, i);
    axis.push({ x: randomX, y: randomY });
}



function generateConnectionPoints() {
    const linesContainer = document.getElementsByClassName('lines')[0];
    linesContainer.remove();
    const lines = document.createElement('div');
    lines.classList.add('lines')
    for (let i = 0; i < axis.length; i++) {
        const line = document.createElement('div');
        line.classList.add('line')
        if (!!axis[i + 1]) {
            const currentAxis = axis[i];
            const nextAxis = axis[i + 1];
            const hypotenuse = Math.sqrt(Math.abs(currentAxis.x - (nextAxis.x)) ** 2 + Math.abs(currentAxis.y - (nextAxis.y)) ** 2);
            line.style.width = `${hypotenuse + 1}px`;
            line.style.top = `${currentAxis.y}px`;
            line.style.left = `${currentAxis.x}px`;
            line.style.transform = `rotate(${findAngle(currentAxis.x, currentAxis.y, nextAxis.x, nextAxis.y)}deg)`;
            line.style.transformOrigin = "0% 0%"
            // ctx.moveTo(axis[i].x, axis[i].y);
            // ctx.lineTo(axis[i+1].x, axis[i+1].y);
        } else {
            const currentAxis = axis[i];
            const firstAxis = axis[0];
            const hypotenuse = Math.sqrt(Math.abs(currentAxis.x - firstAxis.x) ** 2 + Math.abs(currentAxis.y - firstAxis.y) ** 2);
            line.style.width = `${hypotenuse + 1}px`;
            line.style.top = `${currentAxis.y}px`;
            line.style.left = `${currentAxis.x}px`;
            line.style.transform = `rotate(${findAngle(currentAxis.x , currentAxis.y, firstAxis.x, firstAxis.y)}deg)`;
            line.style.transformOrigin = "0% 0%"
            // ctx.moveTo(axis[i].x, axis[i].y);
            // ctx.lineTo(axis[0].x, axis[0].y);
        }
        lines.appendChild(line);
        containerCanva.appendChild(lines);
        // ctx.lineWidth = 0.5; 
        // ctx.stroke();
    }
}

function findAngle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}

generateConnectionPoints();
