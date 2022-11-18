
const BG_IMG=new Image();
BG_IMG.src='image/bg.jpg';


const SCORE_IMG=new Image();
SCORE_IMG.src='image/bs.png';


const LIFE_IMG=new Image();
LIFE_IMG.src='image/ble.png';


const LEVEL_IMG=new Image();
LEVEL_IMG.src='image/bl.png';






const WALL_HIT=new Audio();
WALL_HIT.src='sounds/wall.wav';


const LIFE_LOST=new Audio();
LIFE_LOST.src='sounds/life_lost.wav';


const PADDLE_HIT=new Audio();
PADDLE_HIT.src='sounds/paddle_hit.wav';


const WIN=new Audio();
WIN.src='sounds/win.wav';

const BRICK_HIT=new Audio();
BRICK_HIT.src='sounds/brick_hit.wav';

let cvs=document.getElementById('breakout');
let ctx=cvs.getContext('2d');



const BALL_RADIUS=8;
let LIFE=3;
let SCORE=0;
const SCORE_UNIT=10;
const MAX_LEVEL=7;
let LEVEL=1;
let GAME_OVER=false;

ctx.lineWidth=3;
const PADDLE_WIDTH=125;
const PADDLE_HEIGHT=20;
const PADDLE_MARGIN_BOTTOM=50;

let leftArrow=false;
let rightArrow=false;


const paddle={
   x:cvs.width/2-PADDLE_WIDTH/2,
   y:cvs.height-PADDLE_MARGIN_BOTTOM-PADDLE_HEIGHT,
   width:PADDLE_WIDTH,
   height:PADDLE_HEIGHT,
   dx:5
}

function drawPaddle(){
	ctx.fillStyle='#2e3548';
	ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
    
    ctx.strokeStyle='#ffcd05';
    ctx.strokeRect(paddle.x,paddle.y,paddle.width,paddle.height);
}

document.addEventListener('keydown',function(e){
       if(e.keyCode==37){
       	leftArrow=true;
       }
       else if(e.keyCode==39){
       	rightArrow=true;
       }     
});
document.addEventListener('keyup',function(e){
       if(e.keyCode==37){
       	leftArrow=false;
       }
       else if(e.keyCode==39){
       	rightArrow=false;
       }     
});

function movepaddle(){
	if(rightArrow&&paddle.x+paddle.width<cvs.width){
		paddle.x+=paddle.dx;
	}else if(leftArrow&&paddle.x>0){
		paddle.x-=paddle.dx;
	}
}

const ball={
	x:cvs.width/2,
	y:paddle.y-BALL_RADIUS,
	radius:BALL_RADIUS,
	speed:4,
	dx:3,
	dy:-3
}

function drawBall(){
      ctx.beginPath();
      ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
      ctx.fillStyle='#ffcd05';
      ctx.fill();

      ctx.strokeStyle='#2e3548';
      ctx.stroke();
      ctx.closePath();
}

function moveball(){
	 ball.x+=ball.dx;
	 ball.y+=ball.dy;
}
const brick={
	row:1,
	column:5,
	width:55,
	height:20,
	offsetleft:20,
	offsettop:20,
	margin_top:40,
	fillcolor:'#2e3548',
	strokecolor:'#FFF'
}
let bricks=[];
function createbricks(){
   for(let r=0;r<brick.row;r++){
   	 bricks[r]=[];
   	for(let c=0;c<brick.column;c++){
   		bricks[r][c]={
                x:c*(brick.offsetleft+brick.width)+brick.offsetleft,
                y:r*(brick.offsettop+brick.height)+brick.offsettop+brick.margin_top,
                status:true
   		}
   	}
   }
}
createbricks();

function drawbricks(){
	for(let r=0;r<brick.row;r++){
   	 for(let c=0;c<brick.column;c++){
         let b=bricks[r][c];
         if(b.status){
         	ctx.fillStyle=brick.fillcolor;
         	ctx.fillRect(b.x,b.y,brick.width,brick.height);

         	ctx.strokeStyle=brick.strokecolor;
         	ctx.strokeRect(b.x,b.y,brick.width,brick.height);
         }
   	}
   }
}
function ballBrickcollision(){
	for(let r=0;r<brick.row;r++){
   	 for(let c=0;c<brick.column;c++){
         let b=bricks[r][c];
         if(b.status){
                 if(ball.x+ball.radius>b.x&&ball.x-ball.radius<b.x+brick.width&&
                 	ball.y+ball.radius>b.y&&ball.y-ball.radius<b.y+brick.height){
                 	BRICK_HIT.play();
                 	ball.dy=-ball.dy;
                  b.status=false;
                  SCORE+=SCORE_UNIT;
                 }
         }
   	}
   }
}
function gamesetupmaterials(text,textX,textY,img,imgX,imgY){
      ctx.fillStyle='#FFF';
      ctx.font='25px Germania One';
      ctx.fillText(text,textX,textY);

      ctx.drawImage(img,imgX,imgY,width=25,height=25);
}

function draw(){
    drawPaddle();
    drawBall();
    drawbricks();
    gamesetupmaterials(SCORE,35,25,SCORE_IMG,5,5);
    gamesetupmaterials(LIFE,cvs.width-25,25,LIFE_IMG,cvs.width-55,5);
    gamesetupmaterials(LEVEL,cvs.width/2,25,LEVEL_IMG,cvs.width/2-30,5);
}

function collisionBallwithWall(){
   if(ball.x+ball.radius>cvs.width||ball.x-ball.radius<0){
    	WALL_HIT.play();
    	ball.dx=-ball.dx;
    	
   }
   if(ball.y-ball.radius<0){
   	    ball.dy=-ball.dy;
   }
   if(ball.y+ball.radius>cvs.height){
        LIFE_LOST.play();
       LIFE--;
       
        resetBall();
   }
}

function collisionBallwithPaddle(){
        if(ball.x < paddle.x + paddle.width && ball.x > paddle.x&&
        	 ball.y < paddle.y + paddle.height && ball.y > paddle.y){
        	PADDLE_HIT.play();

        let collidePoint=ball.x-(paddle.x+paddle.width/2);
        console.log(collidePoint);
             collidePoint=collidePoint/(paddle.width/2);
            console.log(collidePoint);
        let angle=collidePoint*Math.PI/3;
                 console.log(angle);

       		 ball.dx=ball.speed*Math.sin(angle);
       		     console.log(ball.dx);  
	         ball.dy=-ball.speed*Math.cos(angle);
                      console.log(ball.dy);       
}    
}

function resetBall(){
	ball.x=cvs.width/2;
	ball.y=paddle.y-BALL_RADIUS;
	ball.dx=3*(Math.random()*2-1);
	ball.dy=-3;
}

function gameover(){
	if(LIFE<0){
	    restart();
		GAME_OVER=true;
	
	}
	
}

function levelup(){
	isleveldone=true;

	for(let r=0;r<brick.row;r++){
   	 for(let c=0;c<brick.column;c++){
              isleveldone=isleveldone && !bricks[r][c].status;
   	}
   	if(isleveldone){
   		WIN.play();
   		if(LEVEL>=MAX_LEVEL){
   		    gameove();
   			GAME_OVER=true;
   			return;
   		}
   		brick.row++;
   		createbricks();
   		ball.speed+=0.5;
   		resetBall();
   		LEVEL++;

   	}
   }

}

function update(){
     movepaddle();
     moveball();
     collisionBallwithWall();
     collisionBallwithPaddle();
     ballBrickcollision();
     gameover();
     levelup();
}

function loop(){
	ctx.drawImage(BG_IMG,0,0);
	draw();
	update();
	if(!GAME_OVER){
		requestAnimationFrame(loop);
	}
	
}
loop();

const soundElement=document.getElementById('sound');
soundElement.addEventListener('click',audioManager);
function audioManager(){
	let imgSrc=soundElement.getAttribute('src');
    let SOUND_IMG=imgSrc=='image/img.png'?'image/soundoff.jpg':'image/img.png';

    soundElement.setAttribute('src',SOUND_IMG);
    
    WALL_HIT.muted=WALL_HIT.muted?false:true;
    PADDLE_HIT.muted=PADDLE_HIT.muted?false:true;
    BRICK_HIT.muted=BRICK_HIT.muted?false:true;
    WIN.muted=WIN.muted?false:true;
    LIFE_LOST.muted=LIFE_LOST.muted?false:true;

}

const restart_div=document.getElementById('Restart_div');
const play_again=document.getElementById('play');
const decide_loser=document.getElementById('decideloser');
const decide_winner=document.getElementById('decidewinner');


function restart(){
    restart_div.style.display="block";
    decide_loser.style.display="block";
}

function gameove(){
    restart_div.style.display="block";
    decide_winner.style.display="block";
}
  play_again.addEventListener('click',function(){
    location.reload();
});