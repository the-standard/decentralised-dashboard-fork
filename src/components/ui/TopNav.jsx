import { useAccount } from "wagmi";
import {
  Button,
  useTheme
} from 'react-daisyui';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

import ThemeToggle from "./ThemeToggle";

const TopNav = (props) => {
  const { toggleVisible } = props;
  const { address } = useAccount();

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
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <w3m-button />
        </div>
      </div>
    )
  }
  return (<></>);
};

export default TopNav;