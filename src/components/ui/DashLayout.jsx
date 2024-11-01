import { useState, useCallback } from "react";
import { ToastContainer, Slide } from 'react-toastify';
import {
  Drawer,
} from 'react-daisyui';

import {
  useLocalThemeModeStore,
} from "../../store/Store";

import {
  BellAlertIcon,
} from '@heroicons/react/24/outline';

import TopNav from './TopNav';
import SideNav from './SideNav';
import Footer from './Footer';

import Card from "./Card";
import Button from "./Button";
import Typography from "./Typography";

import discordlogo from "../../assets/discordlogo.svg";
import telegramlogo from "../../assets/telegramlogo.svg";

import ChainChecker from "../ChainChecker";

const DashLayout = ({children}) => {
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
              {/* <Card className="card-compact mb-4">
                <div className="card-body">
                  <Typography variant="h2" className="card-title flex justify-between">
                    <span>
                      <BellAlertIcon className="w-6 h-6 inline-block mr-2"/>
                      Important Update: Smart Vaults
                    </span>
                    <span className="text-sm font-normal opacity-50">
                      &nbsp; 22/July/2024
                    </span>
                  </Typography>
                  <div className="overflow-x-auto">
                    <Typography variant="p" className="mb-2">
                      Dear Users,
                    </Typography>

                    <Typography variant="p" className="mb-2">
                      We are pausing the creation of new vaults until the V4 Vaults launch with yield generation (ETA: 1 month). You can still manage, pay back debt, and trade collateral in your existing vaults. Take advantage of the slight de-peg to settle debts at a discount!
                    </Typography>

                    <Typography variant="p" className="flex items-center mb-2">
                      Join the Community & Connect with us for updates and support:
                    </Typography>
                    <div className="flex align-center">
                      <Button
                        size="sm"
                        color="ghost"
                        onClick={() => window.open('https://discord.gg/THWyBQ4RzQ', "_blank")}
                      >
                        <img
                          className={
                            isLight ? (
                              'h-4 w-4 inline-block invert'
                            ) : (
                              'h-4 w-4 inline-block'
                            )
                          }
                          src={discordlogo} alt={`Discord logo`}
                        />
                        Discord
                      </Button>
                      <Button
                        size="sm"
                        color="ghost"
                        onClick={() => window.open('https://t.me/TheStandard_io', "_blank")}
                      >
                        <img
                          className={
                            isLight ? (
                              'h-4 w-4 inline-block'
                            ) : (
                              'h-4 w-4 inline-block invert'
                            )
                          }
                          src={telegramlogo} alt={`Telegram logo`}
                        />
                        Telegram
                      </Button>
                    </div>

                  </div>
                </div>
              </Card> */}

              {children}
            </ChainChecker>
          </div>
        <Footer />
      </Drawer>
    </div>
  );
};

export default DashLayout;