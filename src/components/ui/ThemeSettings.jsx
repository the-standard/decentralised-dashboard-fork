import {
  useThemeSettingsOpenStore,
  useLocalThemeStore,
  useLocalThemeModePrefStore,
  useLocalThemeModeStore,
} from "../../store/Store";

import {
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/solid';

import Modal from "./Modal";
import Button from "./Button";
import Typography from "./Typography";
import Select from "./Select";

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

const ThemeSettings = () => {
  const { themeSettingsOpenStore, setThemeSettingsOpenStore } = useThemeSettingsOpenStore();

  const { localThemeStore, setLocalThemeStore } = useLocalThemeStore();
  const { localThemeModePrefStore, setLocalThemeModePrefStore } = useLocalThemeModePrefStore();
  const { localThemeModeStore } = useLocalThemeModeStore();

  const chosenTheme = localThemeStore;

  const chosenModePref = localThemeModePrefStore;

  const handleThemeChange = (e) => {
    setLocalThemeStore(e.target.value)
  }
  const handleModePrefChange = (e) => {
    setLocalThemeModePrefStore(e.target.value)
  }

  const isLight = localThemeModeStore && localThemeModeStore.includes('light');

  return (
    <>
      <Modal
        open={themeSettingsOpenStore}
        closeModal={() => {
          setThemeSettingsOpenStore(false);
        }}
      >
        <Typography variant="h2" className="card-title">
          {isLight ? (
            <SunIcon className="w-6 h-6"/>
          ) : (
            <MoonIcon className="w-6 h-6"/>
          )}
          Theme Settings
        </Typography>
        <Typography variant="p" className="mb-2">
          Select your preferred Theme, and Dark/Light mode settings below.
        </Typography>
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
        <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
          <Button
            className="w-full lg:w-auto"
            variant="outline"
            onClick={() => {
              setThemeSettingsOpenStore(false);
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  )

};

export default ThemeSettings;