const canvas = document.getElementById("gamescreen");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let score = document.getElementById("score");
let scoreCount = 0;
let animationId;
let isGameOver = false
let pipes = []
let pipegap = 200
let frame = 0;
let bird = {
    x: 150,
    y: 200,
    width: 60,
    height: 50,
    velocity: 0,
    gravity: 0.6
}
let birdImg = new Image()
birdImg.src = "bird.png"

let pipeImg = new Image()
pipeImg.src = "pipe.png"

let bgImg = new Image()
bgImg.src = "bg2.png" 

let pointSound = new Audio("point.mp3")
document.addEventListener("touchstart", function(e){
    e.preventDefault();
    jump();
})

document.addEventListener("click", function(e){
    jump();
})

document.addEventListener("keydown", function(e){
    if (e.key === " ") {
        jump();
    }   
})        

function jump() {
    if (isGameOver) return
    bird.velocity = -10;
}

function pipeCollision(pipe) {
    let birdRight = bird.x + bird.width
    let birdBottom = bird.y + bird.height

    let hitX = birdRight > pipe.x && bird.x < pipe.x + pipe.width
    let hitTop = bird.y < pipe.topHeight
    let hitBottom = birdBottom > pipe.topHeight + pipe.gap

    return hitX && (hitTop || hitBottom)
}

function gameover() {
    isGameOver = true
    document.getElementById("final-score").textContent = scoreCount
    document.getElementById("popup").style.display = "block"
    cancelAnimationFrame(animationId)  
}
    
function restart(){
    isGameOver = false
    cancelAnimationFrame(animationId)
    document.getElementById("popup").style.display = "none"
    scoreCount = 0
    score.textContent = scoreCount
    frame = 0
    pipes = []
    bird.y = 200
    bird.velocity = 0
    gameLoop()
}

function gameLoop() {
    if (isGameOver) return;
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    if (frame % 90 === 0) {
        pipes.push({
            x: canvas.width,
            width: 80,
            gap: pipegap,
            topHeight: Math.random() * (canvas.height - 300) + 50,
            scored: false 
        });
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 10;
        ctx.fillStyle = "yellow";
        ctx.save();
        ctx.translate(pipes[i].x + pipes[i].width / 2, pipes[i].topHeight / 2);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImg, -pipes[i].width / 2, -pipes[i].topHeight / 2, pipes[i].width, pipes[i].topHeight);
        ctx.restore();

        
        ctx.drawImage(pipeImg, pipes[i].x, pipes[i].topHeight + pipes[i].gap, pipes[i].width, canvas.height - pipes[i].topHeight - pipes[i].gap);
        if (pipeCollision(pipes[i])) {
            gameover();
        }
        if (bird.y < 0 || bird.y + bird.height > canvas.height) {
            gameover(); 
        }
        if (pipes[i].x + pipes[i].width < bird.x && !pipes[i].scored) {
            pointSound.play()
            pipes[i].scored = true
            scoreCount++
            score.textContent = scoreCount    
        }
        
        pipes = pipes.filter(function(pipe) {
        return pipe.x + pipe.width > 0
        });
    }
    animationId = requestAnimationFrame(gameLoop);
}
gameLoop();
