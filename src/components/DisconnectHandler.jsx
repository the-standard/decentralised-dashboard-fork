import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

import {
  useGuestShowcaseStore,
} from "../store/Store";

const DisconnectHandler = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isDisconnected,
  } = useAccount();

  const {
    useShowcase,
  } = useGuestShowcaseStore();

  useEffect(() => {
    if (
      isDisconnected 
      && location.pathname !== '/'
      && !useShowcase // do not redirect if using showcase mode
    ) {
      navigate("/");
    }
  }, [isDisconnected]);  

  return (
    <>
      {children}
    </>
  )};

export default DisconnectHandler;