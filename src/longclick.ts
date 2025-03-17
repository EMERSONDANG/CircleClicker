import { FundamentalEvent, SKEvent, SKMouseEvent } from "simplekit/canvas-mode"

export const longclickTranslator = {
    minTime: 1,
    mouseX: 0,
    mouseY: 0,
    timer: 0,
    update(fe: FundamentalEvent) : SKEvent | undefined { // returns either an SKEvent or 
        switch (fe.type) {
            case "mousedown":
                const mouseDown = fe as SKMouseEvent;
                this.mouseX = mouseDown.x;
                this.mouseY = mouseDown.y;
                this.timer = Date.now()
                break
            case "mouseup":
                const mouseUp = fe as SKMouseEvent;
                const distance = Math.sqrt((mouseUp.x - this.mouseX) ** 2 + (mouseUp.y - this.mouseY) ** 2);
                const span = (Date.now() - this.timer) / 1000
                if (span >= this.minTime && distance < 10) 
                    return new SKMouseEvent("longclick", fe.timeStamp, fe.x || 0, fe.y || 0)
                break
        }
    }
}
