const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function isMobile(){
return /Mobi|Android/i.test(navigator.userAgent);
}

/* IMAGENES */

const backgroundImg = new Image();
backgroundImg.src="f1.jpg";

const snoopyImg = new Image();
snoopyImg.src="i1.png";

const cherryImg = new Image();
cherryImg.src="i2.jpeg";

const strawberryImg = new Image();
strawberryImg.src="i3.jpeg";

/* SONIDOS */

const coinSound = new Audio("coin.mp3");
const lifeSound = new Audio("powerup.wav");
const failSound = new Audio("fail.wav");
const gameOverSound = new Audio("gameover.wav");
const music = new Audio("music.mp3");

music.loop=true;
music.volume=0.3;

/* VARIABLES */

let player;
let foods=[];
let keysPressed={left:false,right:false};

let score=0;
let misses=0;

let lastSpawn=0;

let gameStarted=false;

const maxMisses=5;

/* CANVAS */

function resizeCanvas(){

if(isMobile()){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}else{
canvas.width=700;
canvas.height=500;
}

}

window.addEventListener("resize",resizeCanvas);

/* RESET */

function resetGame(){

resizeCanvas();

player={
width:90,
height:90,
speed:10,
x:canvas.width/2-45,
y:canvas.height-110
};

foods=[];
score=0;
misses=0;
lastSpawn=0;

}

/* CONTROLES PC */

document.addEventListener("keydown",e=>{

if(e.code==="ArrowLeft") keysPressed.left=true;
if(e.code==="ArrowRight") keysPressed.right=true;

});

document.addEventListener("keyup",e=>{

if(e.code==="ArrowLeft") keysPressed.left=false;
if(e.code==="ArrowRight") keysPressed.right=false;

});

/* CONTROLES MOVIL */

if(isMobile()){

document.getElementById("mobileControls").style.display="flex";

const leftBtn=document.getElementById("leftBtn");
const rightBtn=document.getElementById("rightBtn");

leftBtn.addEventListener("touchstart",()=>keysPressed.left=true);
leftBtn.addEventListener("touchend",()=>keysPressed.left=false);

rightBtn.addEventListener("touchstart",()=>keysPressed.right=true);
rightBtn.addEventListener("touchend",()=>keysPressed.right=false);

}

/* COLISION */

function collide(a,b){

return(
a.x < b.x+b.width &&
a.x+a.width > b.x &&
a.y < b.y+b.height &&
a.y+a.height > b.y
);

}

/* LOOP */

function gameLoop(timestamp){

if(!gameStarted) return;

/* movimiento */

if(keysPressed.left && player.x>0){
player.x-=player.speed;
}

if(keysPressed.right && player.x+player.width<canvas.width){
player.x+=player.speed;
}

/* spawn frutas */

if(timestamp-lastSpawn>1000){

let isLife=Math.random()<0.15;

foods.push({

x:Math.random()*(canvas.width-40),
y:-40,
width:40,
height:40,
life:isLife,
image:isLife?cherryImg:strawberryImg

});

lastSpawn=timestamp;

}

/* mover frutas */

foods.forEach(f=>f.y+=3);

/* colisiones */

foods=foods.filter(f=>{

if(collide(player,f)){

if(f.life){
lifeSound.play();
misses=Math.max(0,misses-1);
}else{
coinSound.play();
score++;
}

return false;

}

if(f.y>canvas.height){

if(!f.life){
failSound.play();
misses++;
}

return false;

}

return true;

});

/* game over */

if(misses>=maxMisses){

gameOverSound.play();

alert("💔 Juego Terminado\nPuntos: "+score);

resetGame();

}

/* dibujar */

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(backgroundImg,0,0,canvas.width,canvas.height);

ctx.drawImage(snoopyImg,player.x,player.y,player.width,player.height);

foods.forEach(f=>{
ctx.drawImage(f.image,f.x,f.y,f.width,f.height);
});

/* UI */

ctx.fillStyle="white";
ctx.font="24px Arial";

ctx.fillText("Puntos: "+score,20,40);
ctx.fillText("Vidas: "+(maxMisses-misses),20,70);

requestAnimationFrame(gameLoop);

}

/* START */

document.getElementById("btnStart").addEventListener("click",()=>{

document.getElementById("intro").style.display="none";

canvas.style.display="block";

music.play();

resetGame();

gameStarted=true;

requestAnimationFrame(gameLoop);

});