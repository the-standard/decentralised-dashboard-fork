import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { Bars3Icon } from '@heroicons/react/24/outline';

import {
  useCurrentTheme,
} from "../../store/Store";

import StandardioLogoWhite from "../../assets/standardiologo-white.svg";
import StandardioLogoBlack from "../../assets/standardiologo-black.svg";

import Button from "./Button";
import ThemeButton from "./ThemeButton";
// import Notifications from "./Notifications";

import RainbowConnect from "../RainbowConnectButton";

const TopNav = (props) => {
  const { toggleVisible } = props;
  const { address } = useAccount();
  const navigate = useNavigate();
  const { currentTheme } = useCurrentTheme();

  const isLight = currentTheme && currentTheme.includes('light');

  if (address) {
    return (
      <div className="navbar sticky shadow-md tst-topnav">
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
            onClick={() => navigate("/")}
          >
            <img
              src={isLight ? (StandardioLogoBlack) : (StandardioLogoWhite)}
              alt="TheStandard.io Logo"
              className="h-6"
            />  
          </Button>
        </div>
        <div className="navbar-end">
          <div className="hidden md:block">
            <ThemeButton />
          </div>
          {/* <Notifications /> */}
          <RainbowConnect />
        </div>
      </div>
    )
  }
  return (<></>);
};

export default TopNav;