export class ClearCanvas {
    constructor() {
        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    animate(t) {
        requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}