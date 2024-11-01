import { useEffect } from "react";
import {
  Theme,
} from 'react-daisyui';

import {
  useLocalThemeStore,
  useLocalThemeModeStore,
  useLocalThemeModePrefStore,
} from "../store/Store";

import ThemeSettings from "./ui/ThemeSettings";

const ThemeHandler = ({children}) => {
  const { localThemeStore, setLocalThemeStore } = useLocalThemeStore();
  const { localThemeModeStore, setLocalThemeModeStore } = useLocalThemeModeStore();
  const { localThemeModePrefStore, setLocalThemeModePrefStore } = useLocalThemeModePrefStore();

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
    setLocalThemeModePrefStore(useModePref);
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', localThemeStore)
  }, [localThemeStore])
  
  useEffect(() => {
    localStorage.setItem('modePref', localThemeModePrefStore)
    handleDarkMode();
  }, [localThemeModePrefStore])

  const handleDarkMode = () => {
    switch(localThemeModePrefStore){
      case 'dark':
        setLocalThemeModeStore('dark');
        break;
      case 'light':
        setLocalThemeModeStore('light');
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
        setLocalThemeModeStore('dark');
      } else {
        setLocalThemeModeStore('light');
      }
    } else {
      setLocalThemeModeStore('dark');
    }
  }

  const useDaisyTheme = `${localThemeStore}-${localThemeModeStore}`;

  return (
    <Theme dataTheme={useDaisyTheme} className="tst-bg">
      {children}
      <ThemeSettings />
    </Theme>
  )
};

export default ThemeHandler;