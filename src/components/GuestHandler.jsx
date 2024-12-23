import { useEffect } from "react";
import { useAccount } from "wagmi";

import {
  useGuestShowcaseStore,
} from "../store/Store";

const GuestHandler = ({children}) => {
  const {
    useShowcase,
    setUseShowcase,
    showcaseWallet,
    useWallet,
    setUseWallet,
  } = useGuestShowcaseStore();

  const {
    isDisconnected,
    isConnected,
    address: accountAddress,
  } = useAccount();

  const localShowcase = localStorage.getItem('guestShowcase');

  useEffect(() => {
    if (localShowcase) {
      if (localShowcase.includes('true')) {
        setUseShowcase(true);
      }
    }
  }, [])

  useEffect(() => {
    if (isDisconnected) {
      if (useShowcase) {
        setUseWallet(showcaseWallet);
        localStorage.setItem('guestShowcase', true)
      } else {
        localStorage.setItem('guestShowcase', false)
      }
    }
  }, [useShowcase, isDisconnected])

  useEffect(() => {
    if (isConnected) {
      if (accountAddress) {
        setUseWallet(accountAddress);
        setUseShowcase(false);
        localStorage.setItem('guestShowcase', false)
      } else {
      }
    }
  }, [accountAddress, isConnected])
  
  return (
    <>
      {children}
    </>
  )
};

export default GuestHandler;