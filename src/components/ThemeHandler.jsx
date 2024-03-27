import { useEffect } from "react";
import {
  useTheme,
  Theme,
} from 'react-daisyui';

const ThemeHandler = ({children}) => {
  const { setTheme } = useTheme();

  const localTheme = localStorage.getItem('theme');

  useEffect(() => {
    if (localTheme) {
      setTheme(localTheme);
    } else {
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        setTheme("dark");
        localStorage.setItem("theme", "dark");
      } else {
        setTheme("light");
        localStorage.setItem("theme", "light");
      }
    }
  }, [])

  return (
    <Theme dataTheme={localTheme || 'light'} style={{minHeight: "100vh"}}>
      {children}
    </Theme>
  )};

export default ThemeHandler;