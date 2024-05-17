import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { Bars3Icon } from '@heroicons/react/24/outline';

import StandardioLogo from "../../assets/standardiologo.svg";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const TopNav = (props) => {
  const { toggleVisible } = props;
  const { address } = useAccount();
  const navigate = useNavigate();

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
              src={StandardioLogo}
              alt="TheStandard.io Logo"
              className="h-6"
            />  
            {/* {import.meta.env.VITE_COMPANY_DAPP_NAME || ''} */}
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