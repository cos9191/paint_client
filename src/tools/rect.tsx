import Tool from "./Tool";

export default class Rect extends Tool {
    mouseDown: boolean
    startX!: number
    startY!: number
    width!: number
    height!: number
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
        const target = evt.target as HTMLElement;
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: 'rect',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                color: this.context?.fillStyle
            }
        }))
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
            this.width = currentX - this.startX
            this.height = currentY - this.startY
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }
    draw(x: number, y: number, w: number, h: number) {
        const img = new Image()
        if (typeof this.saved === "string") {
            img.src = this.saved
        }
        img.onload = () => {
            this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.context?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.context?.beginPath()
            this.context?.rect(x, y, w, h)
            this.context?.fill()
            this.context?.stroke()
        }
    }
    static staticDraw(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
        context.fillStyle = color
        context.beginPath()
        context.rect(x, y, w, h)
        context.fill()
        context.stroke()
    }
}
