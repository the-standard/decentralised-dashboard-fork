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
    <div className="tst-con">
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
        className="md:drawer-open bg-base-400/0"
        contentClassName="min-h-screen bg-base-400/0"
        sideClassName="bg-base-400/0"
      >
        <div className="tst-inner">
          {children}
        </div>
      </Drawer>
    </div>
  );
};

export default DashLayout;