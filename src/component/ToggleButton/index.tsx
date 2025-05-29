import React from 'react';
import './index.less';
import { useControllableValue } from 'ahooks';

interface ToggleButtonProps {
  text?: string;
  value?: boolean
  onChange?: (value: boolean) => void
}

const ToggleButton = (props: ToggleButtonProps) => {
  const { text } = props
  const [active, setActive] = useControllableValue<boolean>(props, {
    defaultValue: false
  })
  return (
    <div className='wrapper' onClick={() => setActive(pre => !pre)}>
      <span>{text}</span>
      <div className={`toggle ${active && 'active'}`}>
        <div className='indicator'></div>
      </div>
    </div>
  );
};

export default ToggleButton;