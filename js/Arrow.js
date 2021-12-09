export class Arrow {
    constructor(x, y, size, speed, rotateSpeed, arrowIndex, mousePoint, main) {
        this.main = main;
        this.opacity = 1;
        this.DecreaseOpacity = 0.005;
        this.arrowIndex = arrowIndex;

        this.isEnd = false;
        this.isHit = false;
        this.x = x;
        this.y = y;
        this.imgWidth = 71; //71
        this.imgHeight = 21; //21

        this.nowTime = 0;
        this.focusTime = 3;
        this.splitTimer = this.focusTime / 60;

        this.beforeX = this.x;
        this.beforeY = this.y;
        this.mouseX = mousePoint.x;
        this.mouseY = mousePoint.y;
        this.saveMousePoint = [];

        this.size = size;
        this.speed = speed;
        this.degree = 0;
        this.go = 0;
        
        this.imgGapX;
        this.imgGapY;
        this.hitbox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            r: 0,
            s: 0
        };

        //회전, 시간 관련
        this.rotateSpeed = rotateSpeed;
        this.splitScale = this.size / this.rotateSpeed; //this.size
        this.nowScale = 0;
        this.index = 0;

        //발사 관련
        this.shot = -30.5;
        this.shotSpeed = 10;

        //모션이 완료 됐는지 확인
        this.createMotionFlag = false;
        this.shotMotionFlag = false;
        this.lastPosBackup = null;


        this.img = new Image();
        let arrowRandom = this.getRandomInt(0, 2);
        if(arrowRandom == 0)
            this.img.src = "img/arrow.png";
        else if(arrowRandom == 1)
            this.img.src = "img/arrow2.png";

        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");
        window.addEventListener("mousemove", this.mouseMove.bind(this), false);
        window.addEventListener("touchmove", this.touchMove.bind(this), false);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
    }
    getPos(speed) {
        let targetRadian = -Math.atan2(this.mouseX - this.x, this.mouseY - this.y);
        let targetDegree = this.radianToDegree(targetRadian);
        if(targetDegree < 0) {
            targetDegree += 360;
        }
        //      180
        // 270          90
        //      360(0)
        if(Math.abs(targetDegree - this.degree) > Math.floor(targetDegree) + 360 - Math.floor(this.degree)) {
            //왼쪽에서 오른쪽으로
            targetDegree += 360;
        } else if(Math.abs(targetDegree - this.degree) >  Math.floor(this.degree) + 360 - Math.floor(targetDegree)) {
            //오른쪽에서 왼쪽으로
            this.degree += 360;
        } 
        if(targetDegree - speed > this.degree) {
            this.degree += speed;
        }
        else if(targetDegree + speed < this.degree) {
            this.degree -=speed;
        }

        //console.log(targetDegree);
        let radian = this.degreeToRadian(this.degree);

        return {
            x: this.x,
            y: this.y,
            r: radian,
            d: this.degree
        };
    }

    radianToDegree(radian) {
        return radian * 180 / Math.PI * -1;
    }

    degreeToRadian(degree) {
        return (degree/180) * Math.PI * -1;
    }

    MediateDegree(degree) {
        return this.degreeToRadian(degree % 360);
    }

    mouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    touchMove(e) {
        let touches = e.changedTouches;
        this.mouseX = touches[0].clientX;
        this.mouseY = touches[0].clientY;
    }

    createMotion() {
        let pos;
        let trigger = false;
        if(this.rotateSpeed > 0) {
            this.degree += this.rotateSpeed;
            this.rotateSpeed -= 1;
            this.nowScale += this.splitScale;
        } else { // 다 돌았을 때
            trigger = true;
            this.degree %= 360;
            pos = this.getPos(4);
        }
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.scale(this.nowScale, this.nowScale);
        this.ctx.rotate(this.degreeToRadian(90)); //90도 라디안
        if(trigger == false)
            this.ctx.rotate(this.MediateDegree(this.degree));
        else {
            //다 돌고나서 행동할 모션
            this.nowTime += this.splitTimer;
            if(this.nowTime >= this.focusTime) {
                this.createMotionFlag = true;
            }
            
            this.ctx.rotate(pos.r);
            this.hitbox = {
                x: this.x -this.imgWidth * this.size / 2,
                y: this.y -this.imgHeight * this.size / 2,
                w: this.imgWidth * this.size,
                h: this.imgHeight * this.size,
                r: pos.r + this.degreeToRadian(90),
                s: this.size
            }
        }

        //this.ctx.strokeRect(-this.imgWidth / 2 + 5, -this.imgHeight / 2, this.imgWidth, this.imgHeight);
        //this.ctx.stroke();
        this.imgGapX = -35.5;
        this.imgGapY = -10.5;
        this.ctx.drawImage(this.img, 0, 0, 512, 154, this.imgGapX, this.imgGapY, this.imgWidth, this.imgHeight);
        this.ctx.restore();

    }

    shootingMotion() {
        if(this.lastPosBackup == null){
            this.lastPosBackup = this.getPos(0);
            //console.log(this.lastPosBackup.d);
        }
        

        let angle = this.degreeToRadian(this.lastPosBackup.d - 90);
        //console.log(this.radianToDegree(angle));
        //console.log(pos.d - 90);
        this.x = this.lastPosBackup.x + Math.cos(angle) * this.go;
        this.y = this.lastPosBackup.y + Math.sin(angle) * this.go;
        this.go += this.speed;

        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.scale(this.nowScale, this.nowScale);
        this.ctx.rotate(this.degreeToRadian(90)); //90도 라디안

        this.ctx.rotate(this.lastPosBackup.r);
        //this.ctx.strokeRect(-this.imgWidth / 2 + 5, -this.imgHeight / 2, this.imgWidth, this.imgHeight);
        this.ctx.drawImage(this.img, 0, 0, 512, 154, this.imgGapX, this.imgGapY, this.imgWidth, this.imgHeight);
        //this.ctx.stroke();

        this.ctx.restore();
        this.hitbox = {
            x: this.x -this.imgWidth * this.size / 2,
            y: this.y -this.imgHeight * this.size / 2,
            w: this.imgWidth * this.size,
            h: this.imgHeight * this.size,
            r: this.lastPosBackup.r + this.degreeToRadian(90),
            s: this.size
        }


        if(this.x<= -1 || this.x >= this.canvas.width) {
            this.shotMotionFlag = true;
        }

        if(this.y <= -1 || this.y >= this.canvas.height) {
            this.shotMotionFlag = true;
        }
    }

    leftMotion() {
        this.ctx.save();
        if(this.opacity > this.DecreaseOpacity)
            this.opacity -= this.DecreaseOpacity;
        else{
            this.opacity = 0;
            this.isEnd = true;
        }
        this.ctx.globalAlpha = this.opacity;
        this.ctx.translate(this.x, this.y);
        this.ctx.scale(this.nowScale, this.nowScale);
        this.ctx.rotate(this.degreeToRadian(90)); //90도 라디안
        
        this.ctx.rotate(this.lastPosBackup.r);
        this.ctx.drawImage(this.img, 0, 0, 512, 154, this.imgGapX, this.imgGapY, this.imgWidth, this.imgHeight);
        this.ctx.restore();
    }


    animate(t) {
        if(this.isEnd == false) {
            requestAnimationFrame(this.animate.bind(this));
        
            if(this.createMotionFlag == false)
                this.createMotion();
            else if(this.shotMotionFlag == false)
                this.shootingMotion();
            else if(this.shotMotionFlag == true)
                this.leftMotion();
            
    
            this.CharCollision();
        }
    }

    detectCollision(rect, circle) {
        var cx, cy
        var angleOfRad = -rect.r;
        var rectCenterX = rect.x + rect.w / 2;
        var rectCenterY = rect.y + rect.h / 2;

        var rotateCircleX = Math.cos(angleOfRad) * (circle.x - rectCenterX) - Math.sin(angleOfRad) * (circle.y - rectCenterY) + rectCenterX;
        var rotateCircleY = Math.sin(angleOfRad) * (circle.x - rectCenterX) + Math.cos(angleOfRad) * (circle.y - rectCenterY) + rectCenterY;

        if (rotateCircleX < rect.x) {
            cx = rect.x;
        } else if (rotateCircleX > rect.x + rect.w) {
            cx = rect.x + rect.w;
        } else {
            cx = rotateCircleX;
        }

        if (rotateCircleY < rect.y) {
            cy = rect.y;
        } else if (rotateCircleY > rect.y + rect.h) {
            cy = rect.y + rect.h;
        } else {
            cy = rotateCircleY;
        }
        //console.log('rotateCircleX', rotateCircleX)
        //console.log('rotateCircleY', rotateCircleY)
        //console.log('cx', cx)
        //console.log('cy', cy)
        //console.log(this.distance(rotateCircleX, rotateCircleY, cx, cy))
        if (this.distance(rotateCircleX, rotateCircleY, cx, cy) < circle.r && this.isHit == false) {
            console.log("detection");
            this.main.life -= 1;
            this.isHit = true;
            return true;
        }

        return false;

    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    CharCollision() {
        //this.detectCollision(this.hitbox,{x: this.mouseX, y: this.mouseY, r: 10});
        if(this.shotMotionFlag == false)
            this.detectCollision(this.hitbox,{x: this.mouseX, y: this.mouseY, r: 30});
        
        /*
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.scale(this.hitbox.s, this.hitbox.s);
        this.ctx.rotate(this.hitbox.r);
        this.ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
        this.ctx.stroke();
        this.ctx.restore();
        */
    }

    
}