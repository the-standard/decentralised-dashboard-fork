import { useState, useCallback } from "react";
import { ToastContainer, Slide } from 'react-toastify';
import {
  Drawer,
} from 'react-daisyui';

import TopNav from './TopNav';
import SideNav from './SideNav';

const DashLayout = ({children}) => {
  const [showSideNav, setShowSideNav] = useState(false);

  const toggleVisible = useCallback(() => {
    setShowSideNav(visible => !visible);
  }, []);

  return (
    <>
      <TopNav toggleVisible={toggleVisible} />
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
        className="md:drawer-open"
        contentClassName="min-h-screen shadow-[inset_0_4px_6px_-1px_rgba(0,0,0,0.1)]"
        sideClassName="bg-base-400"
      >
        <div className="p-4 max-w-[1440px] m-auto">
          {children}
        </div>
      </Drawer>
    </>
  );
};

export default DashLayout;