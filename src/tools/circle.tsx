import Tool from "./Tool";

export default class Circle extends Tool {
    mouseDown: boolean
    startX!: number
    startY!: number
    saved: string | null = null
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
        this.context?.beginPath()
        this.startX = evt.pageX - target.offsetLeft
        this.startY = evt.pageY - target.offsetTop
        this.saved = this.canvas.toDataURL()
    }
    mouseMoveHandler(evt: MouseEvent) {
        if (this.mouseDown) {
            const target = evt.target as HTMLElement
            let currentX = evt.pageX - target.offsetLeft
            let currentY = evt.pageY - target.offsetTop
            let radius = Math.max(Math.abs(currentX - this.startX), Math.abs(currentY - this.startY))
            this.draw(this.startX, this.startY, radius)
        }
    }

    draw(x: number, y: number, radius: number) {
        const img = new Image()
        img.src = this.saved!
        img.onload = () => {
            if (this.context) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                this.context.beginPath()
                this.context.arc(x, y, radius, 0, 2 * Math.PI);
                this.context.fill()
                this.context.stroke()
            }
        }
    }
}
