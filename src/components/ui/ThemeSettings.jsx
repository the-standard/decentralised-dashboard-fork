import { useEffect, useRef, useState } from "react";

import {
  useCurrentTheme,
  useLocalThemeStore,
  useLocalModeStore,
  useLocalModePrefStore,
} from "../../store/Store";

import Modal from "./Modal";
import Button from "./Button";
import Typography from "./Typography";
import Select from "./Select";

import {
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/solid';

const allThemes = [
  {
    name: 'Deluxe',
    value: 'deluxe',
  },
  {
    name: 'Nebula',
    value: 'nebula',
  },
  {
    name: 'Simple',
    value: 'simple',
  },
];

const allModes = [
  {
    name: 'Use Device Settings',
    value: 'device',
  },
  {
    name: 'Dark',
    value: 'dark',
  },
  {
    name: 'Light',
    value: 'light',
  },
];

const ThemeToggle = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentTheme } = useCurrentTheme();

  const { localThemeStore, setLocalThemeStore } = useLocalThemeStore();
  const { localModeStore } = useLocalModeStore();
  const { localModePrefStore, setLocalModePrefStore } = useLocalModePrefStore();

  const chosenTheme = localThemeStore;

  const chosenModePref = localModePrefStore;

  const isLight = localModeStore && localModeStore.includes('light');

  const handleThemeChange = (e) => {
    setLocalThemeStore(e.target.value)
  }
  const handleModePrefChange = (e) => {
    setLocalModePrefStore(e.target.value)
  }

  return (
    <>
      <Button
        shape="circle"
        color="ghost"
        className="md:mr-2"
        onClick={() => setIsOpen(true)}
      >
        {isLight ? (
          <SunIcon className="w-6 h-6"/>
        ) : (
          <MoonIcon className="w-6 h-6"/>
        )}
      </Button>
      <Modal
        open={isOpen}
        closeModal={() => {
          setIsOpen(false);
        }}
      >
        <div>
          <Typography
            variant="p"
            className="mb-2"
          >
            Theme:
          </Typography>
          <Select
            value={chosenTheme}
            label="Theme"
            handleChange={handleThemeChange}
            optName="name"
            optValue="value"
            options={allThemes || []}
            className="w-full mb-4"
          >
          </Select>
        </div>
        <div>
          <Typography
            variant="p"
            className="mb-2"
          >
            Dark/Light Mode:
          </Typography>
          <Select
            value={chosenModePref}
            label="Appearance"
            handleChange={handleModePrefChange}
            optName="name"
            optValue="value"
            options={allModes || []}
            className="w-full mb-4"
          >
          </Select>
        </div>
      </Modal>
    </>
  )

};

export default ThemeToggle;