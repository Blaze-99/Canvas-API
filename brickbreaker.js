
var canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');

//variables I'll need later

let ballRadius = 10;
let x = canvas.width/2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleHeight = 10;
let paddleWidth = 100;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed=false;
let leftPressed=false;
let brickRowCount = 5;
let brickColumnCount = 19;
let brickWidth = 40;
let brickHeight = 20;
let brickPadding = 12;
let brickOffsetTop = 35;
let brickOffsetLeft = 25;

let bricks = []; //basic brick design
for (c =0; c<brickColumnCount; c++){
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++){
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

document.addEventListener("mousemove", mouseMoveHandler, false); //moving by mouse

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) { //hopefully mouse stays in check with this
        paddleX = relativeX - paddleWidth/2;
    }
}

function drawBall(){ //creating the ball
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){ //paddle to smack ball
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight); 
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){ //adding bricks from earlier
    for(c=0; c < brickColumnCount; c++){
        for(r=0; r < brickRowCount; r++){
            if(bricks[c][r].status === 1){
                let brickX = (c* (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r* (brickHeight+brickPadding)) + brickOffsetTop;
                bricks[c][r].x=brickX;
                bricks[c][r].y=brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = 'black';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection(){ // physics for collision including destroying them
    for(c=0; c<brickColumnCount;c++){
        for(r=0; r<brickRowCount; r++){
            let b = bricks[c][r];
            if(b.status === 1){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
}
function draw(){ // adding all the previous to the canvas
   
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) { //ball movements
        dx = -dx;
    }

    if(y + dy < ballRadius){
        dy = -dy;
    }
    else if (y + dy > canvas.height-ballRadius){
        
        if(x > paddleX && x < paddleX + paddleWidth){
            dy=-dy;
        }
        
        else {
            alert('Game over, press the OK button to start the game again.');
            document.location.reload();
        }
    }
    
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius){
        dy = -dy;
    }
   
    if(rightPressed && paddleX <canvas.width-paddleWidth){ //without these paddle glitches and does not respond
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }
 
    x +=dx;
    y +=dy; 
}

setInterval(draw, 10) // frames