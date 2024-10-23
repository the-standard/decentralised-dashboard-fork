import {
  useCurrentTheme,
} from "../../store/Store";
import Button from "./Button";

import {
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/solid';

const ThemeToggle = (props) => {
  const classes = props.className || '';
  const buttonType = props.buttonType || 'square';
  const { setCurrentTheme } = useCurrentTheme();

  const chosenTheme = localStorage.getItem('theme');

  const setTheme = (theme) => {
    saveTheme(theme);
  }

  const saveTheme = (newTheme) => {
    localStorage.setItem("theme", newTheme);
    setCurrentTheme(newTheme);
  }

  const isLight = chosenTheme && chosenTheme.includes('light');

  return (
    <div
      className={`dropdown ${classes ? classes : ''}`}
    >
      <Button
        tabIndex={0}
        shape={buttonType}
        color="ghost"
        className="md:mr-2"
      >
        {isLight ? (
          <SunIcon className="w-6 h-6"/>
        ) : (
          <MoonIcon className="w-6 h-6"/>
        )}
      </Button>
      <div tabIndex={0} className="dropdown-content p-2 shadow-md rounded-box w-40 mt-4 tst-card opacity-100 before:backdrop-blur-[8px]">
        <div className="relative flex flex-col">
          <Button
            color="ghost"
            size="sm"
            className="justify-between"
            onClick={() => setTheme('deluxe-dark')} 
          >
            Deluxe Dark
            <MoonIcon className="w-4 h-4"/>
          </Button>
          <Button
            color="ghost"
            size="sm"
            className="justify-between"
            onClick={() => setTheme('deluxe-light')} 
          >
            Deluxe Light
            <SunIcon className="w-4 h-4"/>
          </Button>
          <Button
            color="ghost"
            size="sm"
            className="justify-between"
            onClick={() => setTheme('nebula-dark')} 
          >
            Nebula Dark
            <MoonIcon className="w-4 h-4"/>
          </Button>
          <Button
            color="ghost"
            size="sm"
            className="justify-between"
            onClick={() => setTheme('nebula-light')} 
          >
            Nebula Light
            <SunIcon className="w-4 h-4"/>
          </Button>
        </div>
      </div>
    </div>
  )

  // return (
    // <Button
    //   shape="circle"
    //   color="ghost"
    //   className="md:mr-2"
    //   onClick={() => toggleTheme()}
    // >
    //   {chosenTheme === 'light' ? (
    //     <SunIcon className="w-6 h-6"/>
    //   ) : (
    //     <MoonIcon className="w-6 h-6"/>
    //   )}
    // </Button>
  // );
};

export default ThemeToggle;