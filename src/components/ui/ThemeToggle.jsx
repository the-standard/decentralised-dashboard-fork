import {
  useCurrentTheme,
} from "../../store/Store";

import Button from "./Button";

import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeToggle = () => {
  const { setCurrentTheme } = useCurrentTheme();

  const chosenTheme = localStorage.getItem('theme');

  const toggleTheme = () => {
    switch (chosenTheme) {
      case 'light':
        saveTheme("dark");
        break;
      case 'dark':
        saveTheme("light");
        break;
      default:
        saveTheme("light");
        break;
    }  
  }

  const saveTheme = (newTheme) => {
    localStorage.setItem("theme", newTheme);
    setCurrentTheme(newTheme);
  }

  return (
    <Button
      shape="circle"
      color="ghost"
      className="md:mr-2"
      onClick={() => toggleTheme()}
    >
      {chosenTheme === 'light' ? (
        <SunIcon className="w-6 h-6"/>
      ) : (
        <MoonIcon className="w-6 h-6"/>
      )}
    </Button>
  );
};

export default ThemeToggle;