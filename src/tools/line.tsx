import Tool from "./Tool";

export default class Line extends Tool {
    mouseDown: boolean;
    currentX!: number
    currentY!: number
    saved: string | null = null;
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
        super(canvas, socket, id)
        this.mouseDown = false;
        this.listen()
    }
    listen() {
        this.canvas.onmousemove = (evt: MouseEvent) => this.mouseMoveHandler(evt);
        this.canvas.onmousedown = (evt: MouseEvent) => this.mouseDownHandler(evt);
        this.canvas.onmouseup = (evt: MouseEvent) => this.mouseUpHandler(evt);
    }
    mouseUpHandler(evt: MouseEvent) {
        this.mouseDown = false
    }
    mouseDownHandler(evt: MouseEvent) {
        this.mouseDown = true
        const target = evt.target as HTMLElement;
        this.currentX = evt.pageX - target.offsetLeft
        this.currentY = evt.pageY - target.offsetTop
        this.context?.beginPath()
        this.context?.moveTo(this.currentX, this.currentY)
        this.saved = this.canvas.toDataURL()
    }
    mouseMoveHandler(evt: MouseEvent) {
        if (this.mouseDown) {
            const target = evt.target as HTMLElement;
            this.draw(
                evt.pageX - target.offsetLeft,
                evt.pageY - target.offsetTop
            )
        }
    }

    draw(x: number, y: number) {
        const img = new Image()
        img.src = this.saved!
        img.onload = () => {
            if (this.context) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                this.context.beginPath()
                this.context.moveTo(this.currentX, this.currentY);
                this.context.lineTo(x, y)
                this.context.stroke()
            }
        }
    }
}
