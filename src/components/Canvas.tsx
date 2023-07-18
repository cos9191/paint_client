import React, {FC, useEffect, useRef, useState} from 'react';
import '../styles/canvas.scss';
import {observer} from 'mobx-react-lite';
import canvasState from "../store/canvasState";
import Brush from "../tools/brush";
import toolState from "../store/toolState";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useParams} from "react-router-dom";
import Rect from "../tools/rect";
import axios from "axios"

class Message {
    figure: {
        type: string
        x: number
        y: number
        width: number
        height: number
        color: string
    } = { type: '', x: 0, y: 0, width: 0, height: 0, color: ''}
}

const Canvas: FC = observer(() => {

    const serverUrl = 'https://cos9191.github.io/paint_online_server:5000'

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null)
    const [isShown, setModal] = useState(true)
    const params = useParams()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current!);
        let context = canvasRef.current?.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    context?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
                    context?.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height)
                }
            })
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000/')
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id || '')
            toolState.setTool(new Brush(canvasRef.current!, socket, params.id!))
            socket.onopen = () => {
                socket.send(JSON.stringify({
                        id:params.id,
                        username: canvasState.username,
                        method: 'connection',
                    })
                )
            }
            socket.onmessage = (event) => {
                let message = JSON.parse(event.data)
                switch (message.method) {
                    case 'connection':
                        console.log(`User ${message.username} logged in`)
                        break
                    case 'draw':
                        drawHandler(message)
                        break
                }
            }
        }
    }, [canvasState.username])
    const drawHandler = (message: Message) => {
        const figure = message.figure
        const context = canvasRef.current?.getContext('2d')
        switch(figure.type) {
            case 'brush':
                Brush.draw(context!, figure.x, figure.y)
                break
            case 'rect':
                Rect.staticDraw(context!, figure.x, figure.y, figure.width, figure.height, figure.color)
                break
            case 'finish':
                context?.beginPath()
                break
        }
    }
    const mouseDownHandler = () => {
        if (canvasRef.current) {
            canvasState.pushToUndo(canvasRef.current.toDataURL())
            axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()}).then(response => console.log(response.data))
        }
    }
    const connectionHandler = () => {
        canvasState.setUsername(usernameRef.current!.value)
        setModal(false)
    }

    return (
        <div className='canvas'>
            <Modal show={isShown} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>Enter your name</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <input type={'text'} ref={usernameRef} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectionHandler()}>
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400} />
        </div>
    )
});
export default Canvas;
