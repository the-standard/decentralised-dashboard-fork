import { useState, useCallback } from "react";
import { ToastContainer, Slide } from 'react-toastify';
import {
  Drawer,
} from 'react-daisyui';

import TopNav from './TopNav';
import SideNav from './SideNav';
import Footer from './Footer';

const DashLayout = ({children}) => {
  const [showSideNav, setShowSideNav] = useState(false);

  const toggleVisible = useCallback(() => {
    setShowSideNav(visible => !visible);
  }, []);

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
<<<<<<< HEAD
        className="md:drawer-open bg-base-400/0"
        contentClassName="tst-sidenav__content min-h-screen bg-base-400/0"
        sideClassName="tst-sidenav__side bg-base-400/0 z-[1]"
=======
        className="md:drawer-open"
        contentClassName="min-h-screen shadow-[inset_0_4px_6px_-1px_rgba(0,0,0,0.1)]"
        sideClassName="bg-base-400"
>>>>>>> dcac62b (feat: added glass start)
      >
        <TopNav toggleVisible={toggleVisible} />
        <div className="tst-inner">
          {children}
        </div>
        <Footer />
      </Drawer>
    </div>
  );
};

export default DashLayout;