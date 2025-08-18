import { useState, useCallback, useRef, useEffect } from "react";
import { ToastContainer, Slide, Bounce, toast } from 'react-toastify';
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
import { useInactivityControl } from '../InactivityControl';

import TopNav from './TopNav';
import SideNav from './SideNav';
import Footer from './Footer';

import Card from "./Card";
import Button from "./Button";
import Typography from "./Typography";
import Modal from "./Modal";

const DashLayout = ({children}) => {
  const {
    useShowcase,
  } = useGuestShowcaseStore();
  const [showSideNav, setShowSideNav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isActive } = useInactivityControl();
  const isActiveToastRef = useRef(null);

  const MODAL_VIEWED_KEY = 'thestandard_announcement_viewed';

  const toggleVisible = useCallback(() => {
    setShowSideNav(visible => !visible);
  }, []);

  const { localThemeModeStore } = useLocalThemeModeStore();
  const isLight = localThemeModeStore && localThemeModeStore.includes('light');

  useEffect(() => {
    const hasViewed = localStorage.getItem(MODAL_VIEWED_KEY);
    if (!hasViewed) {
      setIsOpen(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(MODAL_VIEWED_KEY, 'true');
  }, []);

  useEffect(() => {
    if (!isActive) {
      isActiveToastRef.current = toast('🌙 App Sleeping', {
        theme: "dark",
        position: "bottom-center",
        transition: Slide,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        progress: undefined,
        hideProgressBar: true,
        pauseOnFocusLoss: false,
      });
    } else {
      if (isActiveToastRef.current) {
        toast.update(isActiveToastRef.current, {
          render: "🔆 App Waking",
          theme: "light",
          position: "bottom-center",
          transition: Slide,
          autoClose: 3000,
          closeOnClick: false,
          draggable: true,
          progress: undefined,
          hideProgressBar: false,
          pauseOnFocusLoss: false,
        });  
        isActiveToastRef.current = null;
        // toast.dismiss(toastIdRef.current);
      }
    }
  }, [isActive]);

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
        // className="md:drawer-open bg-base-400/0"
        className="min-[1220px]:drawer-open bg-base-400/0"
        contentClassName="tst-sidenav__content min-h-screen bg-base-400/0"
        sideClassName="tst-sidenav__side bg-base-400/0 z-[1]"
      >

        <div tabindex="-1" class="top-0 start-0 z-50 flex justify-between w-full p-2 bg-primary">
          <div class="flex items-center mx-auto">
            <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
              A Message from Joshua Scigala - Co-Founder of TheStandard.io
            </p>
            <Button
              onClick={() => setIsOpen(true)}
              size={'sm'}
              variant="outline"
              className="ml-2"
            >
              Read More
            </Button>
          </div>
        </div>

        <Modal
          open={isOpen}
          closeModal={closeModal}
        >
          <Typography variant="h2" className="card-title justify-between">
            A Message from Joshua Scigala - Co-Founder of TheStandard.io
          </Typography>
          <p
            className="text-base mb-2"
          >
            After five years of full-time work and over $1.2M of my own funding, I've made the difficult decision to wind down TheStandard.io. The technology works, but despite every effort, we couldn't overcome the liquidity and marketing challenges. For the last nine months I personally kept the project financially afloat, but my health now requires me to step back.
          </p>
          <p
            className="text-base mb-2 font-bold"
          >
            For Smart Vault Users:
          </p>
          
          <p
            className="text-base mb-2"
          >
            &bull; The contracts are fully permissionless and will continue to function.<br/>

            &bull; We have reduced the global borrow limit to zero - no new borrowing is possible.<br/>

            &bull; You can repay your loans and withdraw your collateral at your convenience.<br/>

            &bull; Nobody, including myself, has control over your collateral.
          </p>
          <p
            className="text-base mb-2"
          >
            Please note: the protocol will no longer be maintained going forward.
          </p>

          <p
            className="text-base mb-2 font-bold"
          >
            For TST Holders:
          </p>

          <p
            className="text-base mb-2"
          >
            This is not the end for TST holders. I will soon release a token swap contract, allowing TST to be exchanged for the new token powering TheKey.Fun,  a cross-chain game with real yield distribution in USDC.
          </p>

          <p
            className="text-base mb-2"
          >
            To everyone who supported TheStandard - whether vocally or quietly in the background - thank you. It has been an honor to build alongside you.
          </p>

          <p
            className="text-base mb-2"
          >
            With gratitude,<br/>
            Joshua Scigala
          </p>
        </Modal>

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