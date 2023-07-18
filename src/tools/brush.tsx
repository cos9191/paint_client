import Tool from "./Tool";

export default class Brush extends Tool {
    mouseDown: boolean;
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
        super(canvas, socket, id)
        this.mouseDown = false
        this.listen()
    }
    listen() {
        this.canvas.onmousemove = (evt: MouseEvent) => this.mouseMoveHandler(evt);
        this.canvas.onmousedown = (evt: MouseEvent) => this.mouseDownHandler(evt);
        this.canvas.onmouseup = (evt: MouseEvent) => this.mouseUpHandler(evt);
    }
    mouseUpHandler(evt: MouseEvent) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: 'finish',
            }
        }))
    }
    mouseDownHandler(evt: MouseEvent) {
        this.mouseDown = true
        const target = evt.target as HTMLElement;
        this.context?.beginPath()
        this.context?.moveTo(
            evt.pageX - target.offsetLeft,
            evt.pageY - target.offsetTop
        )
    }
    mouseMoveHandler(evt: MouseEvent) {
        if (this.mouseDown) {
            const target = evt.target as HTMLElement;
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: 'brush',
                    x: evt.pageX - target.offsetLeft,
                    y: evt.pageY - target.offsetTop,
                }
            }))
        }
    }

    static draw(context: CanvasRenderingContext2D, x: number, y: number) {
            context.lineTo(x, y)
            context.stroke()
    }
}
