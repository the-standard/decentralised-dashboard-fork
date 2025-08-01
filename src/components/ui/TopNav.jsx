import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { Bars3Icon } from '@heroicons/react/24/outline';

import {
  useLocalThemeModeStore,
  useGuestShowcaseStore,
} from "../../store/Store";

import StandardioLogoWhite from "../../assets/standardiologo-white.svg";
import StandardioLogoBlack from "../../assets/standardiologo-black.svg";

import Button from "./Button";
import ThemeButton from "./ThemeButton";
// import Notifications from "./Notifications";

import RainbowConnect from "../RainbowConnectButton";

const TopNav = (props) => {
  const { toggleVisible } = props;
  // const { address: wagmiWallet } = useAccount();

  const {
    useShowcase,
    useWallet,
  } = useGuestShowcaseStore();

  const accountAddress = useWallet;

  const navigate = useNavigate();
  const { localThemeModeStore } = useLocalThemeModeStore();

  const isLight = localThemeModeStore && localThemeModeStore.includes('light');

  // const navButtonClass = 'hidden md:flex';
  const navButtonClass = 'hidden min-[1220px]:flex';

  if (accountAddress) {
    return (
      <div className="navbar sticky shadow-md tst-topnav">
        <div className="navbar-start gap-[4px]">
          <Button
            // className="md:hidden"
            className="min-[1220px]:hidden"
            color="ghost"
            onClick={toggleVisible}
          >
            <Bars3Icon className="h-6 w-6 inline-block"/>
          </Button>
          <Button
            className="text-xl hidden md:flex"
            // className="text-xl hidden min-[1220px]:flex"
            color="ghost"
            onClick={() => navigate("/")}
          >
            <img
              src={isLight ? (StandardioLogoBlack) : (StandardioLogoWhite)}
              alt="TheStandard.io Logo"
              className="h-4"
            />  
          </Button>
          <Button
            className={location.pathname === '/' || location.pathname.includes('/vaults') ?
              `${navButtonClass} btn-outline` : `${navButtonClass} btn-ghost`
            }
            onClick={() => navigate("/vaults")}
          >
            Vaults
          </Button>
          <Button
            className={location.pathname.includes('/staking-pool') ?
              `${navButtonClass} btn-outline` : `${navButtonClass} btn-ghost`
            }
            color="ghost"
            onClick={() => navigate("/staking-pool")}
          >
            Staking Pool
          </Button>
          <Button
            className={location.pathname.includes('/dex') ?
              `${navButtonClass} btn-outline` : `${navButtonClass} btn-ghost`
            }
            color="ghost"
            onClick={() => navigate("/dex")}
          >
            Cross-Chain Dex
          </Button>
          <Button
            className={location.pathname.includes('/liquidations') ?
              `${navButtonClass} btn-outline` : `${navButtonClass} btn-ghost`
            }
            color="ghost"
            onClick={() => navigate("/liquidations")}
          >
            Liquidations
          </Button>
          <Button
            className={location.pathname.includes('/redemptions') ?
              `${navButtonClass} btn-outline` : `${navButtonClass} btn-ghost`
            }
            color="ghost"
            onClick={() => navigate("/redemptions")}
          >
            Auto Redemptions
          </Button>
          <Button
            className={location.pathname.includes('/projects') ?
              `${navButtonClass} btn-outline` : `${navButtonClass} btn-ghost`
            }
            color="ghost"
            onClick={() => navigate("/projects")}
          >
            Other Projects
          </Button>
        </div>
        <div className="navbar-end">
          {/* <div className="hidden md:block"> */}
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