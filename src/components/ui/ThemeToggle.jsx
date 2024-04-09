import {
  Button,
  useTheme
} from 'react-daisyui';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeToggle = (props) => {

  const {
    theme,
    setTheme,
  } = useTheme();

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

  const saveTheme = (theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
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