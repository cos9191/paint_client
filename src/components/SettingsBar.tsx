import React, {FC} from 'react';
import '../styles/bar.scss';
import '../styles/settings-bar.scss';
import toolState from "../store/toolState";
const SettingsBar: FC = () => {
    return (
        <div className='bar settings-bar'>
            <label htmlFor={'line-width'}>Line width</label>
            <input
                onChange={evt => toolState.setLineWidth(Number(evt.target.value))}
                id={'line-width'}
                type={'number'}
                min={1} max={100} defaultValue={1}
            />
            <label htmlFor={'stroke-color'}>Stroke color</label>
            <input
                onChange={evt => toolState.setStrokeColor(evt.target.value)}
                id={'stroke-color'}
                type={'color'}
            />
        </div>
    )
};
export default SettingsBar;
