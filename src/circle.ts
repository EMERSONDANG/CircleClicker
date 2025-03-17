export class CircleObjects {
    constructor(
        public circleArray: Circle[] = [],
        // for rotation and hexagon center
        public xCenter: number = 0,
        public yCenter: number = 0,
        public hexRadius: number = 0,
        public rotationSpeed : number = 5,
        public arraySize : number = 6,
    ) {}

    createCircle() {
        // store circle objects into array to call them, reset first
        this.circleArray = [];

        for (let i = 0; i < this.arraySize; i++) {
            let circle: Circle = new Circle();
            circle.order = i + 1;
            this.circleArray.push(circle);
        }

        this.setOrder();
        this.setCircleCenter(this.xCenter * 2, this.yCenter * 2);
    }

    // Loop to draw 6 circles
    drawOnCanvas(gc: CanvasRenderingContext2D) {
        for (let i = 0; i < this.arraySize; i++) {
            this.circleArray[i].drawCircle(gc);
        }
    }

    // Set circles in a hexagon shape at start
    setCircleCenter(canvasWidth: number, canvasHeight: number) {
        // Set x and y coordinate of circle center
        this.xCenter = canvasWidth / 2; // Center of the hexagon, x
        this.yCenter = canvasHeight / 2; // Center of hexagon, y
        this.hexRadius = 200; // Radius of the hexagon

        for (let i = 0; i < this.arraySize; i++) {
            const angle = ((2 * Math.PI) / this.arraySize) * i; // 60 degrees in radians, initial value
            // create a circle at each point, 60, 120, 180 ... 360
            this.circleArray[i].circleX =
                this.xCenter + this.hexRadius * Math.cos(angle); // X-coordinate of circle
            this.circleArray[i].circleY =
                this.yCenter + this.hexRadius * Math.sin(angle); // Y-coordinate of circle
        }
    }

    // Randomize order when space bar is pressed
    setOrder() {
        let numArray: number[] = [];

        for (let i = 1; i < this.arraySize + 1; i++) {
            numArray.push(i);
        }

        for (let i = numArray.length - 1; i > 0; i--) {
            let j: number = Math.floor(Math.random() * (i + 1));
            [numArray[i], numArray[j]] = [numArray[j], numArray[i]];
        }

        for (let k = 0; k < this.arraySize; k++) {
            if (numArray[k] === 1) {
                this.circleArray[k].activeTarget = true;
            } else {
                this.circleArray[k].activeTarget = false;
            }

            this.circleArray[k].order = numArray[k];
        }
    }

    animate(time : number) {
        const radians = this.rotationSpeed * (Math.PI / 180);
        
        for (let i = 0; i < this.arraySize; i++) {
            const angle = ((2 * Math.PI) / this.arraySize) * i + (radians * time) / 1000; // previous position, add to new one
            // create a circle at each point, 60, 120, 180 ... 360
            this.circleArray[i].circleX =
                this.xCenter + this.hexRadius * Math.cos(angle); // X-coordinate of circle
            this.circleArray[i].circleY =
                this.yCenter + this.hexRadius * Math.sin(angle); // Y-coordinate of circle
        }
    }
}

export class Circle {
    constructor(
        public startRadius: number = Math.random() * 30 + 15,
        public animateRadius : number = 0,
        public order: number = Math.ceil(Math.random() * 6),
        public circleX: number = 0,
        public circleY: number = 0,
        public clicked: boolean = false,
        public activeTarget: boolean = false,
        public angle: number = 0,
        public outline : boolean = false,
        public hue : number = 0
    ) {
        const radius = Math.random() * 30 + 15;
        this.startRadius = radius;
        this.animateRadius =  15 * Math.sin(radius) + 30;
    }

    drawCircle(gc: CanvasRenderingContext2D) {
        // Draw each circle
        gc.beginPath();
        gc.arc(this.circleX, this.circleY, this.animateRadius, 0, 2 * Math.PI); // Circle

        if (this.activeTarget === true) {
            gc.fillStyle = "white";
        } else if (this.clicked === true) {
            gc.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        } else {
            gc.fillStyle = "darkgrey"; // Circle color
        }

        gc.fill();

        if (this.activeTarget === true || this.clicked == true) {
            gc.fillStyle = "black";
            gc.font = "20px sans-serif";
            gc.fillText(this.order.toString(), this.circleX, this.circleY);
        }

        if (this.outline === true) {
            gc.strokeStyle = "lightblue";
            gc.lineWidth = 3;
            gc.stroke();
        }
    }

    animate(time : number) {
        let speed : number = 2 * (Math.PI) / 3.6;
        this.animateRadius =  15 * Math.sin(((speed * time) / 1000) + this.startRadius) + 30;
    }
}
