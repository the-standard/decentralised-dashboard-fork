import { useAccount } from "wagmi";
import {
  Button,
  useTheme
} from 'react-daisyui';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const TopNav = (props) => {
  const { toggleVisible } = props;
  const { address } = useAccount();

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

  if (address) {
    return (
      <div className="navbar sticky bg-base-100 shadow-md">
        <div className="navbar-start">
          <Button
            className="md:hidden"
            color="ghost"
            onClick={toggleVisible}
          >
            <Bars3Icon className="h-6 w-6 inline-block"/>
          </Button>
          <Button
            className="text-xl hidden md:flex"
            color="ghost"
            onClick={toggleVisible}
          >
            {import.meta.env.VITE_COMPANY_DAPP_NAME || ''}
          </Button>
        </div>
        <div className="navbar-end">
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

          <w3m-button />
        </div>
      </div>
    )
  }
  return (<></>);
};

export default TopNav;