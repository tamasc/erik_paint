var canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d")
var mode = "pen"
var colorinp = document.getElementById('colorinp').value;
var rangeinp = document.getElementById('rangeinp')
var lineW;
var lastX;
var lastY;
document.getElementById('rangeinp').value = 1
canvas.width = 1600
canvas.height = 1300
var region = null;
var regionFirstEvent = false;

let painting = false

function Pen() {
    mode = "pen"
    console.log(mode)
}

function eraser() {
    mode = "eraser"
    console.log(mode)
}

function clearAll() {
    ctx.clearRect(0, 0, 600, 300)
}


function startPos(e) {
    painting = true
    draw(e)
}

function endPos(e) {
    painting = false
    ctx.beginPath()
    draw(e)
}

function draw(e) {
    lastX = parseInt(e.clientX - 60);
    lastY = parseInt(e.clientY)
    lineW = document.getElementById('rangeinp').value
    ctx.lineWidth = lineW;
    if (!painting) return;
    if (mode == "pen") {
        ctx.lineCap = "round"
        ctx.strokeStyle = document.getElementById('colorinp').value;
        ctx.globalCompositeOperation = "source-over";
        ctx.lineTo(lastX, lastY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(e.clientX - 60, e.clientY)
        console.log(lineW)
    } else if (mode == "polygon") {
        if (!regionFirstEvent) {
            regionFirstEvent = true;
            region.moveTo(lastX, lastY);
            return;
        }
        region.lineTo(lastX, lastY);
        ctx.stroke(region);
    } else {
        ctx.lineTo(lastX, lastY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(e.clientX - 60, e.clientY)
        ctx.globalCompositeOperation = "destination-out";
    }
}

function drawPolygon() {
    mode = "polygon"
    region = new Path2D();
    region.moveTo(30, 90);
    function finishPolygon() {
        region.closePath();
        canvas.removeEventListener("dblclick", finishPolygon);
        mode = "pen";
        ctx.fillStyle = 'green';
        ctx.fill(region, 'evenodd');
        region = null;
        regionFirstEvent = false;
    }
    canvas.addEventListener("dblclick", finishPolygon);
}

canvas.addEventListener("mousedown", startPos)
canvas.addEventListener("mouseup", endPos)
canvas.addEventListener("mouseleave", endPos)
canvas.addEventListener("mousemove", draw)