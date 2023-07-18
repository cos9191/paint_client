import React, {FC} from 'react';
import '../styles/bar.scss';
import '../styles/toolbar.scss';
import toolState from "../store/toolState";
import Brush from "../tools/brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/rect";
import Tool from "../tools/Tool";
import Circle from "../tools/circle";
import Eraser from "../tools/eraser";
import Line from "../tools/line";
const Toolbar: FC = () => {
    const handleToolClick = (tool: typeof Tool) => (evt: React.MouseEvent<HTMLButtonElement>) => {
        if (canvasState.canvas)
            {
                toolState.setTool(new tool(canvasState.canvas, canvasState.socket!, canvasState.sessionId!))
            }
    }
    const changeColor = (evt: React.ChangeEvent<HTMLInputElement>) => {
        toolState.setStrokeColor(evt.target.value)
        toolState.setFillColor(evt.target.value)
    }
    const download = () => {
        const dataUrl = canvasState.canvas?.toDataURL()
        const a = document.createElement('a')
        a.href = dataUrl!
        a.download = canvasState.sessionId + '.jpg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className='bar toolbar'>
            <button className='toolbar__btn toolbar__brush' onClick={handleToolClick(Brush)}/>
            <button className='toolbar__btn toolbar__rect' onClick={handleToolClick(Rect)}/>
            <button className='toolbar__btn toolbar__circle' onClick={handleToolClick(Circle)}/>
            <button className='toolbar__btn toolbar__eraser' onClick={handleToolClick(Eraser)}/>
            <button className='toolbar__btn toolbar__line' onClick={handleToolClick(Line)}/>
            <input onChange={evt => changeColor(evt)} type='color'/>
            <button className='toolbar__btn toolbar__undo' onClick={() => canvasState.undo()}/>
            <button className='toolbar__btn toolbar__redo' onClick={() => canvasState.redo()}/>
            <button className='toolbar__btn toolbar__save' onClick={() => download()}/>
        </div>
    )
};
export default Toolbar;
