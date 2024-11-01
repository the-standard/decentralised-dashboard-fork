import {
  useThemeSettingsOpenStore,
  useLocalModeStore,
} from "../../store/Store";

import Button from "./Button";

import {
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/solid';

const ThemeButton = () => {
  const { setThemeSettingsOpenStore } = useThemeSettingsOpenStore();

  const { localModeStore } = useLocalModeStore();

  const isLight = localModeStore && localModeStore.includes('light');

  return (
    <>
      <Button
        shape="circle"
        color="ghost"
        className="md:mr-2"
        onClick={() => setThemeSettingsOpenStore(true)}
      >
        {isLight ? (
          <SunIcon className="w-6 h-6"/>
        ) : (
          <MoonIcon className="w-6 h-6"/>
        )}
      </Button>
    </>
  )

};

export default ThemeButton;