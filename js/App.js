import {
    Arrow
} from "./Arrow.js";

import {
    ClearCanvas
} from "./ClearCanvas.js"

class App {
    constructor() {
        this.score = 0;
        this.life = 3;
        this.gameOver = false;
        this.nowArrow = null;
        this.reloadImg = new Image();
        this.reloadImg.src = "img/reload.png";
        this.reloadImgSize = 50;

        this.charImg = new Image();
        this.charImg.src = "img/char.png";
        this.difficulty = 0;
        this.difficultyControl = [false, false, false, false, false, false, false];

        this.nowSpeed = 20;
        this.maxSpeed = 20; //70

        this.nowScale = 1;
        this.maxScale = 1; //3

        this.createTime = 60;
        this.index = 0;
        this.arrows = [];
        this.sec = 1;
        this.timer = 0;
        this.frameRate = this.sec / this.createTime;
        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");

        window.addEventListener("touchmove", this.touchmove.bind(this), false);
        window.addEventListener("touchend", this.touchend.bind(this), false);
        window.addEventListener("mousemove", this.mousemove.bind(this));
        window.addEventListener("mouseup", this.mouseup.bind(this));
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();


        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;

    }

    animate(t) {
        if(this.life <= 0)  this.gameOver = true;

        requestAnimationFrame(this.animate.bind(this));

        if(this.gameOver == false) {
            this.timer += this.frameRate;
            if(this.timer > this.sec)  {
                this.difficulty += 1;
                this.timer = 0;
                let x = this.getRandomInt(0, this.canvas.width);
                let y = this.getRandomInt(0, this.canvas.height);
                let size = this.getRandomArbitrary(this.nowScale, this.maxScale);
                let speed = this.getRandomInt(this.nowSpeed, this.maxSpeed);
                let rotateSpeed = this.getRandomInt(70, 120);
                this.nowArrow = new Arrow(x, y, size, speed, rotateSpeed, this.index, {x: this.mouseX, y:this.mouseY}, this);
                this.nowArrow.animate();
                this.index += 1;
    
                if(this.difficulty >= 10 && this.difficultyControl[0] == false) {
                    console.log("난이도 Up");
                    this.difficultyControl[0] = true;
                    this.maxScale = 2;
                    this.createTime = 50;
                    this.frameRate = this.sec / this.createTime;
                }
    
                else if(this.difficulty >= 30 && this.difficultyControl[1] == false) {
                    console.log("난이도 Up");
                    this.difficultyControl[1] = true;
                    this.createTime = 40;
                    this.frameRate = this.sec / this.createTime;
                    this.maxSpeed = 40;
                }
    
                else if(this.difficulty >= 60 && this.difficultyControl[2] == false) {
                    console.log("난이도 Up");
                    this.difficultyControl[2] = true;
                    this.createTime = 30;
                    this.frameRate = this.sec / this.createTime;
                    this.maxSpeed = 50;
                }
    
                else if(this.difficulty >= 90 && this.difficultyControl[3] == false) {
                    console.log("난이도 Up");
                    this.difficultyControl[3] = true;
                    this.maxSpeed = 60;
                }
    
                else if(this.difficulty >= 120 && this.difficultyControl[4] == false) {
                    console.log("난이도 Up");
                    this.difficultyControl[4] = true;
                    this.maxSpeed = 70;
                }
    
                else if(this.difficulty >= 150 && this.difficultyControl[5] == false) {
                    console.log("난이도 Up");
                    this.difficultyControl[5] = true;
                    this.createTime = 20;
                    this.frameRate = this.sec / this.createTime;
                }
    
                else if(this.difficulty >= 200 && this.difficultyControl[6] == false) {
                    console.log("난이도 Up");
                    this.difficultyControl[6] = true;
                    this.createTime = 10;
                    this.frameRate = this.sec / this.createTime;
                }
            }  
            this.drawChar();
            this.drawLife();
        }
        if(this.gameOver == true)
            this.drawScore();


    }
    mouseup(e) {
        if(this.gameOver == true) {
            let x = e.clientX;
            let y = e.clientY;

            if((x >= 5 && x <= 85) && (y >= 135 && y <= 195)){
                location.reload();
            }
        }
    }

    touchend(e) {
        if(this.gameOver == true) {
            let touches = e.changedTouches;
            let x = touches[0].clientX;
            let y = touches[0].clientY;

            if((x >= 5 && x <= 85) && (y >= 135 && y <= 195)){
                location.reload();
            }
        }
    }
    mousemove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

    }
    touchmove(e) {
        let touches = e.changedTouches;
        this.mouseX = touches[0].clientX;
        this.mouseY = touches[0].clientY;
    }

    resize() {        
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
    }
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    drawLife() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#EC7063";
        this.ctx.arc(30, 30, 10, 0, 2 * Math.PI);
        if(this.life >= 1) this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.fillStyle = "#EC7063";
        this.ctx.arc(60, 30, 10, 0, 2 * Math.PI);
        if(this.life >= 2) this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.fillStyle = "#EC7063";
        this.ctx.arc(90, 30, 10, 0, 2 * Math.PI);
        if(this.life >= 3) this.ctx.fill();
        this.ctx.stroke();
    }

    drawScore() {
        this.ctx.fillStyle = "black";
        this.ctx.font = '30px 맑은 고딕';
        let str = "";
        let s = Math.floor(this.difficulty / 10);
        switch(s){
            case 0: str = "이게 뭐에요?"; break;
            case 1: str = "이것밖에 안 돼요? 더 해봐요!"; break;
            case 2: str = "에이 좀 더 잘 해봐요"; break;
            case 3: str = "잘 피해봐요!"; break;
            case 4: str = "조금 빠르죠?"; break;
            case 5: str = "이제 시작이에요"; break;
            case 6: str = "아쉬워요 ㅜㅜ.."; break;
            case 7: str = "에잇"; break;
            case 8: str = "잘하는데요?"; break;
            case 9: str = "우와?"; break;
            case 10: str = "대단해요!"; break;
            default: str = "사람이에요?"; break;
        }
        
       


        this.ctx.fillText(str, 10, 50);
        this.ctx.fillText('점수 : ' + this.difficulty, 10, 100);

        this.ctx.save();
        this.ctx.translate(80, 140);
        this.ctx.drawImage(this.reloadImg, 0, 0, 512, 512, -this.reloadImgSize/2, -this.reloadImgSize/2, this.reloadImgSize, this.reloadImgSize);
        //this.ctx.arc(this.mouseX, this.mouseY, 30, 0, 2 * Math.PI);
        this.ctx.restore();


        
    }
    drawChar() {
        let imgSize = 50;
        this.ctx.save();
        this.ctx.translate(this.mouseX, this.mouseY);
        this.ctx.drawImage(this.charImg, 0, 0, 512, 512, -imgSize/2, -imgSize/2, imgSize, imgSize);
        //this.ctx.arc(this.mouseX, this.mouseY, 30, 0, 2 * Math.PI);
        this.ctx.restore();
    }
}

window.onload = () => {
    console.log("hello world");

    let clearCanvas = new ClearCanvas();
    clearCanvas.animate();

    let app = new App();
    app.animate();


}