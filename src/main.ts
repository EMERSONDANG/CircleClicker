import {
    setSKDrawCallback,
    setSKEventListener,
    SKEvent,
    startSimpleKit,
    SKResizeEvent,
    SKMouseEvent,
    setSKAnimationCallback,
    skTime,
    addSKEventTranslator,
} from "simplekit/canvas-mode";
import {} from "simplekit/utility";
import { CircleObjects } from "./circle";
import { Mouse } from "./mouse.ts";
import { Timer } from "./timer.ts";
import { yellowCircle } from "./yellowCircle.ts";
import { longclickTranslator } from "./longclick.ts";

startSimpleKit();

addSKEventTranslator(longclickTranslator);

let canvasWidth = 0;
let canvasHeight = 0;

let circleObjects = new CircleObjects();
circleObjects.createCircle();

let yellowcircle = new yellowCircle();

let setup: boolean = true;
let play: boolean = false;
let finish: boolean = false;
let num_clicks: number = 0;
let bestTimeUpdated: boolean = false;

let timer = new Timer();
let error: boolean = false;

// for animate, has a timestamp
setSKAnimationCallback((timestamp) => {
    if (play == true) {
        timer.update(timestamp);
        circleObjects.animate(timer.curTime);
        for (const circle of circleObjects.circleArray) {
            circle.animate(timer.curTime);
        }
    }

    yellowcircle.animate(timestamp);
});

setSKDrawCallback((gc: CanvasRenderingContext2D) => {
    if (error === true) {
        gc.fillStyle = "darkred";
    } else {
        gc.fillStyle = "black";
    }

    gc.fillRect(0, 0, gc.canvas.width, gc.canvas.height);

    // Render white horizontal line
    gc.strokeStyle = "white";
    gc.lineWidth = 2;
    gc.beginPath();
    gc.moveTo(0, 50);
    gc.lineTo(gc.canvas.width, 50);
    gc.stroke();

    if (setup === true) {
        // "Click target 1 to begin" rendered
        gc.fillStyle = "white";
        gc.font = "24px sans-serif";
        gc.textAlign = "center"; // horizontal alignment
        gc.textBaseline = "middle"; // vertical alignment
        gc.fillText("Click target 1 to begin", gc.canvas.width / 2, 50 / 2);
    }

    if (play === true) {
        if (setup === false && num_clicks < circleObjects.arraySize) {
            gc.fillStyle = "white";
            gc.font = "24px sans-serif";
            gc.textAlign = "center"; // horizontal alignment
            gc.textBaseline = "middle"; // vertical alignment
            gc.fillText(timer.getCurrentTime(), gc.canvas.width / 2, 50 / 2);
        }
    }

    if (finish === true) {
        gc.fillStyle = "white";
        gc.font = "24px sans-serif";
        gc.textAlign = "center"; // horizontal alignment
        gc.textBaseline = "middle"; // vertical alignment

        if (bestTimeUpdated) {
            gc.fillText(
                `${timer.getBestTime()} (new best!)`,
                gc.canvas.width / 2,
                50 / 2
            );
        } else {
            gc.fillText(
                `${timer.getCurrentTime()} (best: ${timer.getBestTime()})`,
                gc.canvas.width / 2,
                50 / 2
            );
        }
    }

    circleObjects.drawOnCanvas(gc);
    yellowcircle.draw(gc);
});

// Q10, SKEvent is a superclass with many subclasses
// SKEvent is the parent, KeyboadEvent, SKResizeEvent are children
// This method is used to detect all user input related actions
setSKEventListener((Event: SKEvent) => {
    //console.log(Event.type);
    switch (Event.type) {
        // space bar changes order of circles from 1-6
        case "keydown":
            const keyEvent = Event as KeyboardEvent;
            if (setup === true) {
                if (keyEvent.key === " ") {
                    circleObjects.setOrder();
                }

                if (keyEvent.key === "]") {
                    if (circleObjects.arraySize < 8) {
                        circleObjects.arraySize++;
                        circleObjects.createCircle();
                    }
                }

                if (keyEvent.key === "[") {
                    if (circleObjects.arraySize > 3) {
                        circleObjects.arraySize--;
                        circleObjects.createCircle();
                    }
                }

                if (keyEvent.key === "{") {
                    if (circleObjects.rotationSpeed > 1) {
                        circleObjects.rotationSpeed--;
                    }
                }

                if (keyEvent.key === "}") {
                    if (circleObjects.rotationSpeed < 10) {
                        circleObjects.rotationSpeed++;
                    }
                }
            }

            if (setup === true || play === true) {
                if (keyEvent.key === "c") {
                    for (const circle of circleObjects.circleArray) {
                        if (circle.activeTarget == true) {
                            circle.hue = Math.floor(Math.random() * 361);

                            circle.activeTarget = false;
                            num_clicks += 1;
                            circle.clicked = true;

                            if (circle.order === 1) {
                                console.log("Mouse in circle");
                                play = true;
                                setup = false;
                                timer.start(skTime);
                            }

                            // end
                            if (circle.order === circleObjects.arraySize) {
                                play = false;
                                finish = true;

                                bestTimeUpdated = timer.updateBestTime();
                            }

                            for (
                                let i = 0;
                                i < circleObjects.circleArray.length;
                                i++
                            ) {
                                if (
                                    circleObjects.circleArray[i].order ==
                                    num_clicks + 1
                                ) {
                                    circleObjects.circleArray[i].activeTarget =
                                        true;
                                }
                            }
                            break;
                        }
                    }
                }
            }

            if (finish === true) {
                if (keyEvent.key === " ") {
                    setup = true;
                    finish = false;
                    circleObjects.createCircle();
                    num_clicks = 0;
                }
            }

            break;
        // used for when canvas width and height is resized
        case "resize":
            const re = Event as SKResizeEvent;
            canvasWidth = re.width;
            canvasHeight = re.height;

            circleObjects.setCircleCenter(canvasWidth, canvasHeight);
            break;

        case "click":
            // check if we click on target 1
            const mouseEvent = Event as SKMouseEvent;
            let mouse = new Mouse(mouseEvent.x, mouseEvent.y);

            for (const circle of circleObjects.circleArray) {
                if (mouse.isMouseInCircle(mouseEvent.x, mouseEvent.y, circle)) {
                    if (circle.activeTarget == true) {
                        // creating yellow circle when user clicks on correct circle
                        yellowcircle.mouseX = mouseEvent.x;
                        yellowcircle.mouseY = mouseEvent.y;
                        yellowcircle.startTime = skTime;

                        // for the hue
                        circle.hue = Math.floor(Math.random() * 361);

                        circle.activeTarget = false;
                        num_clicks += 1;
                        circle.clicked = true;

                        if (circle.order === 1) {
                            console.log("Mouse in circle");
                            play = true;
                            setup = false;
                            timer.start(skTime);
                        }

                        // end
                        if (circle.order === circleObjects.arraySize) {
                            play = false;
                            finish = true;

                            bestTimeUpdated = timer.updateBestTime();
                        }

                        for (
                            let i = 0;
                            i < circleObjects.circleArray.length;
                            i++
                        ) {
                            if (
                                circleObjects.circleArray[i].order ==
                                num_clicks + 1
                            ) {
                                circleObjects.circleArray[i].activeTarget =
                                    true;
                            }
                        }
                    }
                }
            }
            break;

        case "mousedown":
            const mouseDown = Event as SKMouseEvent;
            let mouseD = new Mouse(mouseDown.x, mouseDown.y);

            let currCircle;

            for (const circle of circleObjects.circleArray) {
                if (mouseD.isMouseInCircle(mouseDown.x, mouseDown.y, circle)) {
                    currCircle = circle;
                }
            }

            if (!currCircle || currCircle.activeTarget == false) {
                error = true;
            }
            break;

        case "mouseup":
            error = false;
            break;

        case "mousemove":
            const mouseMove = Event as SKMouseEvent;
            let mouseM = new Mouse(mouseMove.x, mouseMove.y);

            for (const circle of circleObjects.circleArray) {
                if (mouseM.isMouseInCircle(mouseMove.x, mouseMove.y, circle)) {
                    circle.outline = true;
                } else {
                    circle.outline = false;
                }
            }
            break;

        case "longclick":
            if (play === true) {
                setup = true;
                play = false;
                num_clicks = 0;
                circleObjects.createCircle();
            }
    }
});
