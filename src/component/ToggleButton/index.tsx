import React, { useContext } from 'react';
import './index.less';
import AutoSaveContext from '../repl/autoSaveContext';

interface ToggleButtonProps {
  text: string;
}

const ToggleButton = ({ text }: ToggleButtonProps) => {
  const { autoSave, toggleAutoSave } = useContext(AutoSaveContext)
  return (
    <div className='wrapper' onClick={toggleAutoSave}>
      <span>{text}</span>
      <div className={`toggle ${autoSave && 'active'}`}>
        <div className='indicator'></div>
      </div>
    </div>
  );
};

export default ToggleButton;