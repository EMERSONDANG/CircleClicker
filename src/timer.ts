export class Timer {
    constructor(
        public startTime : number = 0,
        public curTime : number = 0,
        public bestTime : number = 9999999
    ) {}

    start(startTime : number) {
        this.startTime = startTime;   
    }

    getCurrentTime() {
        return (this.curTime / 1000).toFixed(1);
    }

    getBestTime() {
        return (this.bestTime / 1000).toFixed(1);
    }

    updateBestTime() {
        if (this.curTime < this.bestTime) {
            this.bestTime = this.curTime;
            return true;
        }

        return false;
    }

    update(time : number) {
        this.curTime = time - this.startTime;
    }
}
