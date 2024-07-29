import {
    Arrow
} from "./Arrow.js";

import {
    ClearCanvas
} from "./ClearCanvas.js"
import { Items } from "./Items.js";

import {
    Particles
} from "./Particles.js";


import * as setting from "./setting.js";
// Import the functions you need from the SDKs you need 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



class App {
    constructor(nickname) {
        //보너스 점수
        this.bonusScore = 0

        this.nickname = nickname;
        //쉴드 변수
        this.shieldTime = 7
        this.nowShieldTime = 0
        this.angles = [0, Math.PI * 2 / 3, Math.PI * 4 / 3]; // 120도 간격
        this.shieldRadian = 15;
        this.shieldImg = new Image();
        this.shieldImg.src = "/img/shield.png";

        this.lifeImg = new Image()
        this.lifeImg.src = "/img/heart.png";
        this.score = 0;
        this.life = 3;
        this.gameOver = false;
        this.nowArrow = null;
        this.reloadImg = new Image();
        this.reloadImg.src = "img/reload.png";
        this.reloadImgSize = 50;

        //슬로우 아이템 획득
        this.slowTime = 10
        this.nowSlowTime = 0

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

        this.putItme()
        this.timeCheck()

    }

    
    timeCheck() {
        setInterval(() => {
            if(this.nowSlowTime > 0) {
                this.nowSlowTime -= 1
            }
            if(this.nowShieldTime > 0) {
                this.nowShieldTime -= 1
            }
        }, 1000)
    }
    putItme() {
        setInterval(() => {
            if(this.gameOver === false) {
                let item = new Items(app)
                item.animate()
            }
        }, 10000)
    }

    drawShield() {
        if(this.nowShieldTime > 0) {
            const speed = 0.01;
            const radius = 100;
            this.angles.forEach((angle, index) => {
                const x = this.mouseX + radius * Math.cos(angle);
                const y = this.mouseY + radius * Math.sin(angle);
        
                this.ctx.drawImage(this.shieldImg, 0, 0, 512, 512, x, y, 30, 30 );
                //r : 15
                //이미지 크기 : 30
        
                // 각도 업데이트
                this.angles[index] += speed;
            });
        } 
        

    }

    //쉴드와 화살이 닿았을 때 파티클
    drawParticle(x, y) {
        let particles = new Particles(x, y);
        particles.createFirework(x, y);
        particles.animate();
    }

    inital() {
        this.bonusScore = 0
        this.score = 0;
        this.life = 3;
        this.gameOver = false;
        this.nowArrow = null;
        this.reloadImgSize = 50;

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
                if(this.nowSlowTime > 0) {
                    speed = 5
                }
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
            this.drawShield();
        }
        if(this.gameOver == true) {
            gameover(this.difficulty + this.bonusScore)
        } else {
            hideGameover()
        }


    }
    mouseup(e) {
    }

    touchend(e) {
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

        for(let i = 1; i <= this.life; i ++) {
            this.ctx.drawImage(this.lifeImg, 0, 0, 512, 512, 40 * i, 30, 30, 30);
        }
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

export const restart = () => {
    app.inital()
    gameoverTrigger = false;

    document.querySelector("#score_board").className = '';
    document.querySelector("#score").textContent = '화이팅!'
}

export const tutorial = () => {
    document.querySelector(".tutorial_hidden").className = 'tutorial'
}

let clearCanvas = null;
let app = null;

let firebase = null; //파이어베이스 App
let database = null;  //파이어베이스 데이터베이스
let getNickname = ''

export const gameStart = (nickname) => {
    clearCanvas = new ClearCanvas();
    clearCanvas.animate();
    nickname = nickname.replace(/_/g, "")
    nickname = nickname + "_" + generateRandomString(7)
    getNickname = nickname;

    app = new App(nickname);
    app.animate();

}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


const hideGameover = () => {

    document.querySelector("#score_board").className = ""
    document.querySelector("#score").textContent = '화이팅'
}

let gameoverTrigger = false; //db 한번만 읽을 수 있도록 설정
let allScores = [] //모든 점수 받기


function writeUserData(userId, value) {
    set(ref(database, 'users/' + userId), {
      value: value,
    });
  }

const gameover = (score) => {
    document.querySelector("#score_board").className = "score_board_show"
    document.querySelector("#score").textContent = score

    if(gameoverTrigger === false) {
        gameoverTrigger = true;

        
        if(allScores[getNickname] === undefined)   writeUserData(getNickname, score)
        else if(allScores[getNickname] < score) {
            writeUserData(getNickname, score)
        }
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users`)).then((snapshot) => {
            if (snapshot.exists()) {
                let data = snapshot.val();
                let sortedEntries = Object.entries(data).sort((a, b) => b[1].value - a[1].value);


                let maxLeng = sortedEntries.length > 5 ? 5 : sortedEntries.length;
                for(let i = 0; i < maxLeng; i ++) {
                    if(i < 3) {
                        document.querySelector(`#ranking${i + 1}`).textContent = i + 1 + '. 👑' + sortedEntries[i][0].split("_")[0]
                    } else {
                        document.querySelector(`#ranking${i + 1}`).textContent = i + 1 + '. ' + sortedEntries[i][0].split("_")[0]
                    }
                    document.querySelector(`#ranking${i + 1}_score`).textContent = sortedEntries[i][1].value
                }

            } else {
                console.log("No data available");
            }
            }).catch((error) => {
            console.error(error);
        });
    }
}


const load = () => {
    // Initialize Firebase
    firebase = initializeApp(setting.firebaseConfig);
    database = getDatabase(firebase);

    const dbRef = ref(getDatabase());
    get(child(dbRef, `users`)).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            let sortedEntries = Object.entries(data).sort((a, b) => b[1].value - a[1].value);
            allScores = sortedEntries;
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
    });
}

load();