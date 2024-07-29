export class Items {
    constructor(main) {
        let itemList = ['heart', 'shield', 'score', 'slow'];
        let imgList = ['/img/heart.png', '/img/shield.png', '/img/star.png', '/img/slow.png']
        let random = this.getRandomInt(0, 4);
        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");

        
        this.isSlow = false
        this.imgWidth = 30;
        this.imgHeight = 30;
        this.main = main;
        this.itemType = itemList[random];
        this.itemImg = new Image()
        this.itemImg.src = imgList[random];
        this.posX = this.getRandomInt(0, this.canvas.width);
        this.posY = this.getRandomInt(0, this.canvas.height);
        this.staticPosX = this.posX;
        this.staticPosY = this.posY
        this.growing = true;
        this.isGet = false;
        this.isEnd = false;
        this.hitbox = {
            x: this.posX + 15,
            y: this.posY + 15,
            r: 20
        }
    }

    detectCollision() {
        if(this.isGet) return
        const dx = this.main.mouseX - this.hitbox.x;
        const dy = this.main.mouseY - this.hitbox.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30 + this.hitbox.r) {
            if(this.itemType === 'shield') this.getShield()
            else if(this.itemType === 'heart') this.getHeart()
            else if(this.itemType === 'slow') this.getSlow();
            else if(this.itemType === 'score') this.getScore();
            return true;
        } else {
            return false;
        }
    }

    //쉴드 아이템 획득
    getShield() {
        this.isEnd = true;
        this.isGet = true;
        this.main.nowShieldTime += this.main.shieldTime;
        setTimeout(() => {
            this.isEnd = true;
        }, this.main.shieldTime * 1000)

    }

    //하트 아이템 획득
    getHeart() {
        this.isEnd = true;
        this.isGet = true;
        this.main.life += 2

    }

    //슬로우 아이템 획득
    getSlow() {
        this.isSlow = true;
        this.isGet = true;
        this.main.nowSlowTime += this.main.slowTime 

        setTimeout(() => {
            this.isEnd = true;
        }, this.main.slowTime * 1000)
    }

    //점수 아이템 획득
    getScore() {
        this.main.bonusScore += 10;
        this.isEnd = true;
        this.isGet = true;
    }
    
    drawItem() {

        if(this.isSlow) {
            this.ctx.save();
            // 투명도 설정 (0.0에서 1.0 사이의 값)
            this.ctx.globalAlpha = 0.2; // 50% 투명도
            this.ctx.drawImage(this.itemImg, 0, 0, 512, 512, this.canvas.width / 2 - this.canvas.width / 4, this.canvas.height / 2 - this.canvas.width / 4, this.canvas.width / 2, this.canvas.width / 2);
            this.ctx.restore();
        }
        if (this.growing) {
            this.imgWidth += 0.5
            this.imgHeight += 0.5
            this.posX -= 0.25
            this.posY -= 0.25
            if (this.imgWidth >= 40) {
                this.growing = false;
            }
        } else {
            this.imgWidth -= 0.5
            this.imgHeight -= 0.5
            this.posX += 0.25
            this.posY += 0.25
            
            if (this.imgWidth <= 30) {
                this.growing = true;
            }
        }
        if(this.isGet === false) {

            this.ctx.drawImage(this.itemImg, 0, 0, 512, 512, this.posX, this.posY, this.imgWidth, this.imgHeight);
            this.ctx.restore();
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
    }


    animate(t) {
        if(this.main.gameOver === false && this.isEnd === false) {
            requestAnimationFrame(this.animate.bind(this));
            this.drawItem();
            this.detectCollision();
        }
    }
}