class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.colors = ['#ff4b5c', '#ffcd3c', '#4bffb5', '#3c5cff'];
        this.color = this.colors[this.getRandomInt(0, this.colors.length)];
        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");
        this.radius = this.getRandomInt(30, 50);
        this.angle = Math.random() * 2 * Math.PI
        this.shrinkRate = 0.8; // 줄어드는 비율
        this.speed = this.getRandomInt(9, 15)
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
    }

    update() {
        if (this.radius <= 1) return; // 반지름이 1 이하가 되면 멈춤
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

        // 랜덤 방향으로 이동
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // 반지름 줄이기
        this.radius *= this.shrinkRate;
    }
}

export class Particles {
    constructor(x, y) {
        this.particles = []
        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");
        this.x = x;
        this.y = y;

        this.createFirework();
    }

    createFirework() {
        const particleCount = 10;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.x, this.y));
        }
    }

    animate(t) {
        this.particles.forEach((particle, index) => {
            particle.update()
        });
        requestAnimationFrame(this.animate.bind(this));
    }
}