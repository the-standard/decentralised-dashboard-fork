import { useState, useCallback } from "react";
import { ToastContainer, Slide } from 'react-toastify';
import {
  Drawer,
} from 'react-daisyui';

import {
  useLocalThemeModeStore,
  useGuestShowcaseStore,
} from "../../store/Store";

import {
  UserIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

import ChainChecker from "../ChainChecker";
import RainbowConnect from "../RainbowConnectButton";

import TopNav from './TopNav';
import SideNav from './SideNav';
import Footer from './Footer';

import Card from "./Card";
import Button from "./Button";
import Typography from "./Typography";

const DashLayout = ({children}) => {
  const {
    useShowcase,
  } = useGuestShowcaseStore();
  const [showSideNav, setShowSideNav] = useState(false);

  const toggleVisible = useCallback(() => {
    setShowSideNav(visible => !visible);
  }, []);

  const { localThemeModeStore } = useLocalThemeModeStore();
  const isLight = localThemeModeStore && localThemeModeStore.includes('light');

  return (
    <div className="tst-con">
      <ToastContainer
        position="bottom-left"
        stacked
        newestOnTop={true}
        closeOnClick={false}
        pauseOnHover={true}
        autoClose={4000}
        transition={Slide}
        draggablePercent={40}
        pauseOnFocusLoss={false}
        theme={'colored'}
      />
      <Drawer
        open={showSideNav}
        onClickOverlay={toggleVisible}
        side={
          <SideNav toggleVisible={toggleVisible} />
        }
        className="md:drawer-open bg-base-400/0"
        contentClassName="tst-sidenav__content min-h-screen bg-base-400/0"
        sideClassName="tst-sidenav__side bg-base-400/0 z-[1]"
      >
        <TopNav toggleVisible={toggleVisible} />
          <div className="tst-inner">
            <ChainChecker>
              {useShowcase ? (
                <Card className="card-compact mb-4">
                  <div className="card-body">
                    <Typography variant="h2" className="card-title flex justify-between">
                      <span>
                        <UserIcon className="w-6 h-6 inline-block mr-2"/>
                        Guest Showcase
                      </span>
                    </Typography>
                    <div className="overflow-x-auto">
                      <Typography variant="p" className="mb-2">
                        Welcome to The Standard.io dashboard! You are currenlty viewing a showcase as a guest, so not all functions will be available to you.
                      </Typography>
                      <Typography variant="p" className="mb-2">
                        To start staking and earning with TST connect your wallet below or in the navigation header above.
                      </Typography>
                      <div
                        className="card-actions"
                      >
                        <RainbowConnect />
                      </div>
                    </div>
                  </div>
                </Card>
              ) : null}

              {children}
            </ChainChecker>
          </div>
        <Footer />
      </Drawer>
    </div>
  );
};

export default DashLayout;