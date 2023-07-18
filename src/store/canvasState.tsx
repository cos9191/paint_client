import {makeAutoObservable} from "mobx";
class CanvasState {
    canvas: HTMLCanvasElement | null = null
    socket: WebSocket | null = null
    sessionId: string | null = null
    undoList: string[] = []
    redoList: string[] = []
    username = ''
    constructor() {
        makeAutoObservable(this)
    }
    setSocket(socket: WebSocket) {
        this.socket = socket
    }
    setSessionId(id: string) {
        this.sessionId = id
    }
    setUsername(username: string) {
        this.username = username
    }
    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas
    }
    pushToUndo(data: string) {
        this.undoList.push(data)
    }
    pushToRedo(data: string) {
        this.redoList.push(data)
    }
    undo() {
        let context = this.canvas?.getContext('2d')
        if (this.undoList.length) {
            let dataURL = this.undoList.pop() as string
            this.redoList.push(this.canvas!.toDataURL())
            let img = new Image()
            img.src = dataURL
            img.onload = () => {
                context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height)
                context?.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height)
            }
        }
        context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height)
    }
    redo() {
        let context = this.canvas?.getContext('2d')
        if (this.redoList.length) {
            let dataURL = this.redoList.pop() as string
            this.undoList.push(this.canvas!.toDataURL())
            let img = new Image()
            img.src = dataURL
            img.onload = () => {
                context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height)
                context?.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height)
            }
        }
    }
}

const canvasState = new CanvasState()
export default canvasState;
