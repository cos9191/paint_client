export default class Tool {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D | null
    socket: WebSocket
    id: string
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
        this.canvas = canvas
        this.socket = socket
        this.id = id
        this.context = canvas.getContext('2d')
        this.destroyEvents()
    }
    set fillColor (color: string) {
        if (this.context) {
            this.context.fillStyle = color
        }
    }
    set strokeColor(color: string) {
        if (this.context) {
            this.context.strokeStyle = color
        }
    }
    set lineWidth(width: number) {
        if (this.context) {
            this.context.lineWidth = width
        }
    }
    destroyEvents() {
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
    }
}
