import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
} from 'react-daisyui';
import {
  CircleStackIcon,
  BanknotesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import StandardioLogo from "../../assets/standardiologo.svg";

import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const SideNav = (props) => {
  const { toggleVisible } = props;
  const location = useLocation();
  const navigate = useNavigate();

  return (
    // <Menu className="p-0 text-base-content bg-nav/60 md:bg-transparent tst-sidenav">
    //   <div className="flex flex-row flex-no-wrap space-x-2 md:hidden p-2 h-16 bg-nav/60">
    <Menu className="p-0 text-base-content tst-sidenav">
      <div className="flex flex-row flex-no-wrap space-x-2 md:hidden p-2 h-16">
        <Button
          className="flex grow text-xl p-2 px-4"
          color="ghost"
          style={{justifyContent: "flex-start"}}
          onClick={() => navigate("/")}
        >
          <img
            src={StandardioLogo}
            alt="TheStandard.io Logo"
            className="h-5"
          />
          {/* {import.meta.env.VITE_COMPANY_DAPP_NAME || ''} */}
        </Button>
        <Button color="ghost" onClick={toggleVisible}>
          <XMarkIcon className="h-6 w-6 inline-block"/>
        </Button>
      </div>
      <div className="p-2 flex flex-col gap-2">
        <Menu.Item>
          <NavLink
            to="/vaults"
            className={({ isActive }) => 
              isActive ||
              location.pathname === '/' ||
              location.pathname.includes('/vault') ?
              'navbar-item active' : 'navbar-item'
            }
          >
            <CircleStackIcon className="h-6 w-6 inline-block"/>
            {/* Vaults */}
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink
            to="/liquidation-pools"
            className={({ isActive }) => 
              isActive ||
              location.pathname.includes('/liquidation-pools') ?
              'navbar-item active' : 'navbar-item'
            }
          >
            <BanknotesIcon className="h-6 w-6 inline-block"/>
            {/* Liquidation Pools */}
          </NavLink>
        </Menu.Item>
      </div>
      <div className="block md:hidden self-center mt-auto pb-4">
        <ThemeToggle />
      </div>
    </Menu>
  );
};

export default SideNav;