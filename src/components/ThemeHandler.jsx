import { useEffect } from "react";
import {
  Theme,
} from 'react-daisyui';

import {
  useCurrentTheme,
  useLocalThemeStore,
  useLocalModeStore,
  useLocalModePrefStore,
} from "../store/Store";

import ThemeSettings from "./ui/ThemeSettings";

const ThemeHandler = ({children}) => {
  const { currentTheme, setCurrentTheme } = useCurrentTheme();

  const { localThemeStore, setLocalThemeStore } = useLocalThemeStore();
  const { localModeStore, setLocalModeStore } = useLocalModeStore();
  const { localModePrefStore, setLocalModePrefStore } = useLocalModePrefStore();

  const localTheme = localStorage.getItem('theme');
  const localModePref = localStorage.getItem('modePref');

  useEffect(() => {
    let useTheme = 'deluxe';
    if (localTheme) {
      if (localTheme.includes('deluxe')) {
        useTheme = 'deluxe';
      } else
      if (localTheme.includes('nebula')) {
        useTheme = 'nebula';
      } else
      if (localTheme.includes('simple')) {
        useTheme = 'simple';
      } else {
        useTheme = 'deluxe';
      }
    }
    setLocalThemeStore(useTheme);

    let useModePref = 'device';
    if (localModePref) {
      useModePref = localModePref;
    }
    setLocalModePrefStore(useModePref);
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', localThemeStore)
  }, [localThemeStore])
  
  useEffect(() => {
    localStorage.setItem('modePref', localModePrefStore)
    handleDarkMode();
  }, [localModePrefStore])

  const handleDarkMode = () => {
    switch(localModePrefStore){
      case 'dark':
        setLocalModeStore('dark');
        break;
      case 'light':
        setLocalModeStore('light');
        break;
      case 'device':
        useDeviceAppearance();
        break;  
      default:
        useDeviceAppearance();
        break;
    }
  }

  const useDeviceAppearance = () => {
    if (window.matchMedia) {
      if(window.matchMedia('(prefers-color-scheme: dark)').matches){
        setLocalModeStore('dark');
      } else {
        setLocalModeStore('light');
      }
    } else {
      setLocalModeStore('dark');
    }
  }

  const useDaisyTheme = `${localThemeStore}-${localModeStore}`;

  return (
    <Theme dataTheme={useDaisyTheme} className="tst-bg">
      {children}
      <ThemeSettings />
    </Theme>
  )
};

export default ThemeHandler;