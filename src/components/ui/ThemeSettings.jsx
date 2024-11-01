import {
  useThemeSettingsOpenStore,
  useLocalThemeStore,
  useLocalThemeModePrefStore,
} from "../../store/Store";

import Modal from "./Modal";
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

  const chosenTheme = localThemeStore;

  const chosenModePref = localThemeModePrefStore;

  const handleThemeChange = (e) => {
    setLocalThemeStore(e.target.value)
  }
  const handleModePrefChange = (e) => {
    setLocalThemeModePrefStore(e.target.value)
  }

  return (
    <>
      <Modal
        open={themeSettingsOpenStore}
        closeModal={() => {
          setThemeSettingsOpenStore(false);
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

export default ThemeSettings;