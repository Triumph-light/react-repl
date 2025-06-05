import React from "react";
import "./index.less";
import Sun from '../../assets/sun'
import { useControllableValue } from "ahooks";
import Moon from "../../assets/moon";
import Github from "../../assets/github";
import ReactLogo from "../../assets/react";

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
        <ReactLogo></ReactLogo>
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
