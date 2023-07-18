import Brush from "./brush";
export default class Eraser extends Brush {
    draw(x: number, y: number) {
        if (this.context) {
            this.context.strokeStyle = 'white'
            this.context.lineTo(x, y)
            this.context.stroke()
        }
    }
}
