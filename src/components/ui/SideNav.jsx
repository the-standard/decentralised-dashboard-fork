import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Tooltip,
} from 'react-daisyui';
import {
  CircleStackIcon,
  BanknotesIcon,
  XMarkIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';

import {
  useCurrentTheme,
} from "../../store/Store";

import StandardioLogoWhite from "../../assets/standardiologo-white.svg";
import StandardioLogoBlack from "../../assets/standardiologo-black.svg";

import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const SideNav = (props) => {
  const { toggleVisible } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTheme } = useCurrentTheme();

  const isLight = currentTheme && currentTheme.includes('light');

  return (
    <Menu className="p-0 text-base-content tst-sidenav">
      <div className="flex flex-row flex-no-wrap space-x-2 md:hidden p-2 h-16">
        <Button
          className="flex grow text-xl p-2 px-4"
          color="ghost"
          style={{justifyContent: "flex-start"}}
          onClick={() => navigate("/")}
        >
          <img
            src={isLight ? (StandardioLogoBlack) : (StandardioLogoWhite)}
            alt="TheStandard.io Logo"
            className="h-5"
          />
          {/* {import.meta.env.VITE_COMPANY_DAPP_NAME || ''} */}
        </Button>
        <Button color="ghost" onClick={toggleVisible}>
          <XMarkIcon className="h-6 w-6 inline-block"/>
        </Button>
      </div>
      {/* Small - */}
      <div className="p-2 flex flex-col gap-2 w-full md:hidden">
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
            <span className="md:hidden">
              Vaults
            </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink
            to="/staking-pool"
            className={({ isActive }) => 
              isActive ||
              location.pathname.includes('/staking-pool') ?
              'navbar-item active' : 'navbar-item'
            }
          >
            <Square3Stack3DIcon className="h-6 w-6 inline-block"/>
            Staking Pool
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
            <span className="md:hidden">
              Liquidation Pools
            </span>
          </NavLink>
        </Menu.Item>
      </div>
      {/* Med + */}
      <div className="p-2 flex-col gap-2 w-full hidden md:flex">
        <Tooltip
          position="right"
          message="Vaults"
        >
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
              <span className="md:hidden">
                Vaults
              </span>
            </NavLink>
          </Menu.Item>
        </Tooltip>
        <Tooltip
          position="right"
          message="Staking Pool"
        >
          <Menu.Item>
            <NavLink
              to="/staking-pool"
              className={({ isActive }) => 
                isActive ||
                location.pathname.includes('/staking-pool') ?
                'navbar-item active' : 'navbar-item'
              }
            >
              <Square3Stack3DIcon className="h-6 w-6 inline-block"/>
              <span className="md:hidden">
                Staking Pool
              </span>
            </NavLink>
          </Menu.Item>
        </Tooltip>
        <Tooltip
          position="right"
          message="Liquidation Pools"
        >
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
              <span className="md:hidden">
                Liquidation Pools
              </span>
            </NavLink>
          </Menu.Item>
        </Tooltip>
      </div>
      <div className="block md:hidden self-center mt-auto pb-4">
        <ThemeToggle className="dropdown-top" />
      </div>
    </Menu>
  );
};

export default SideNav;