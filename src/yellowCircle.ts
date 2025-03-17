export class yellowCircle {
    constructor(
        public mouseX: number = -500,
        public mouseY: number = 0,
        public radius: number = 15,
        public startTime: number = 0
    ) {}

    draw(gc: CanvasRenderingContext2D) {
        if (this.radius <= 45) {
            gc.beginPath();
            gc.strokeStyle = "yellow";
            gc.arc(this.mouseX, this.mouseY, this.radius, 0, 2 * Math.PI);
            gc.stroke();
        }
    }

    animate(time: number) {
        const growSpeed = 30 / 333;
        this.radius = 15 + growSpeed * (time - this.startTime);   
    }
}
