import { useEffect } from "react";
import {
  Theme,
} from 'react-daisyui';

import {
  useCurrentTheme,
} from "../store/Store";

const ThemeHandler = ({children}) => {
  const { currentTheme, setCurrentTheme } = useCurrentTheme();

  const localTheme = localStorage.getItem('theme');

  useEffect(() => {
    if (localTheme) {
      setCurrentTheme(localTheme);
    } else {
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        localStorage.setItem("theme", "deluxe-dark");
        setCurrentTheme("deluxe-dark");
      } else {
        localStorage.setItem("theme", "deluxe-light");
        setCurrentTheme("deluxe-light");
      }
    }
  }, [])

  return (
    <Theme dataTheme={currentTheme} className="tst-bg">
      {children}
    </Theme>
  )
};

export default ThemeHandler;