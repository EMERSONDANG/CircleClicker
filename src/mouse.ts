import { Circle } from "./circle.ts";

export class Mouse {
    constructor(
        public mx: number, 
        public my : number
    ) {}

    isMouseInCircle(mx: number, my: number, circle: Circle) {
        // x squared + y squared <= r squared, circle formula
        return ((mx - circle.circleX) * (mx - circle.circleX)) + ((my - circle.circleY) * (my - circle.circleY)) <= circle.animateRadius * circle.animateRadius;
    }
}