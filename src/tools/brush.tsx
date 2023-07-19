import Tool from "./Tool";

export default class Brush extends Tool {
    isDrawing: boolean;
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
        super(canvas, socket, id);
        this.isDrawing = false;
        this.listen();
    }
    listen() {
        this.canvas.addEventListener("mousemove", this.drawHandler);
        this.canvas.addEventListener("mousedown", this.startDrawingHandler);
        this.canvas.addEventListener("mouseup", this.stopDrawingHandler);

        // Add touch event listeners for smartphone support
        this.canvas.addEventListener("touchmove", this.drawHandler);
        this.canvas.addEventListener("touchstart", this.startDrawingHandler);
        this.canvas.addEventListener("touchend", this.stopDrawingHandler);
    }
    drawHandler = (evt: MouseEvent | TouchEvent) => {
        evt.preventDefault();

        if (this.isDrawing) {
            const target = this.canvas;
            let x, y;

            if (evt instanceof MouseEvent) {
                x = evt.pageX - target.offsetLeft;
                y = evt.pageY - target.offsetTop;
            } else if (evt instanceof TouchEvent) {
                const touch = evt.touches[0];
                x = touch.pageX - target.offsetLeft;
                y = touch.pageY - target.offsetTop;
            }

            this.socket.send(
                JSON.stringify({
                    method: "draw",
                    id: this.id,
                    figure: {
                        type: "brush",
                        x: x,
                        y: y,
                    },
                })
            );
        }
    };
    startDrawingHandler = (evt: MouseEvent | TouchEvent) => {
        evt.preventDefault();

        this.isDrawing = true;
        const target = this.canvas;
        let x, y;

        if (evt instanceof MouseEvent) {
            x = evt.pageX - target.offsetLeft;
            y = evt.pageY - target.offsetTop;
        } else if (evt instanceof TouchEvent) {
            const touch = evt.touches[0];
            x = touch.pageX - target.offsetLeft;
            y = touch.pageY - target.offsetTop;
        }

        this.context?.beginPath();
        // @ts-ignore
        this.context?.moveTo(x, y);
    };
    stopDrawingHandler = () => {
        this.isDrawing = false;
        this.socket.send(
            JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "finish",
                },
            })
        );
    };
    static draw(context: CanvasRenderingContext2D, x: number, y: number) {
        context.lineTo(x, y);
        context.stroke();
    }
}

// export default class Brush extends Tool {
//     mouseDown: boolean;
//     constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
//         super(canvas, socket, id)
//         this.mouseDown = false
//         this.listen()
//     }
//     listen() {
//         this.canvas.onmousemove = (evt: MouseEvent) => this.mouseMoveHandler(evt);
//         this.canvas.onmousedown = (evt: MouseEvent) => this.mouseDownHandler(evt);
//         this.canvas.onmouseup = (evt: MouseEvent) => this.mouseUpHandler(evt);
//     }
//     mouseUpHandler(evt: MouseEvent) {
//         this.mouseDown = false
//         this.socket.send(JSON.stringify({
//             method: "draw",
//             id: this.id,
//             figure: {
//                 type: 'finish',
//             }
//         }))
//     }
//     mouseDownHandler(evt: MouseEvent) {
//         this.mouseDown = true
//         const target = evt.target as HTMLElement;
//         this.context?.beginPath()
//         this.context?.moveTo(
//             evt.pageX - target.offsetLeft,
//             evt.pageY - target.offsetTop
//         )
//     }
//     mouseMoveHandler(evt: MouseEvent) {
//         if (this.mouseDown) {
//             const target = evt.target as HTMLElement;
//             this.socket.send(JSON.stringify({
//                 method: "draw",
//                 id: this.id,
//                 figure: {
//                     type: 'brush',
//                     x: evt.pageX - target.offsetLeft,
//                     y: evt.pageY - target.offsetTop,
//                 }
//             }))
//         }
//     }
//
//     static draw(context: CanvasRenderingContext2D, x: number, y: number) {
//             context.lineTo(x, y)
//             context.stroke()
//     }
// }
