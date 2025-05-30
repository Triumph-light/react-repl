import React from "react";
import "./index.less";
import Sun from '../../assets/sun'
import { useControllableValue } from "ahooks";
import Moon from "../../assets/moon";
import Github from "../../assets/github";

interface HeaderProps {
  theme?: 'light' | 'dark';
  onChangeTheme?: (theme: 'light' | 'dark') => void;
}

const Header = (props: HeaderProps) => {
  const [theme, setTheme] = useControllableValue<'light' | 'dark'>(props, {
    defaultValue: 'light',
    valuePropName: 'theme',
    trigger: 'onChangeTheme'
  });
  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <nav>
      <h1>
        <svg
          width="30px"
          height="30px"
          viewBox="-10.5 -9.45 21 18.9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ color: `rgba(8, 126, 164, 1)` }}
        >
          <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
          <g stroke="currentColor" stroke-width="1" fill="none">
            <ellipse rx="10" ry="4.5"></ellipse>
            <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
            <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
          </g>
        </svg>
        <span>React Playground</span>
      </h1>
      <div className="links">
        <button className="toggle-dark" onClick={handleToggleTheme}>
          {theme === 'light' ? <Sun></Sun> : <Moon></Moon>}
        </button>
        <a
          href="https://github.com/Triumph-light/react-repl"
          target="_blank"
          title="View on GitHub"
          className="github"
        >
          <Github></Github>
        </a>
      </div>
    </nav>
  );
};

export default Header;
