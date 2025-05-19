import React, { useContext } from 'react';
import './index.less';
import AutoSaveContext from '../repl/autoSaveContext';

const ToggleButton = () => {
  const { autoSave, toggleAutoSave } = useContext(AutoSaveContext)
  return (
    <div className='wrapper' onClick={toggleAutoSave}>
      <span>AutoSave</span>
      <div className={`toggle ${autoSave && 'active'}`}>
        <div className='indicator'></div>
      </div>
    </div>
  );
};

export default ToggleButton;