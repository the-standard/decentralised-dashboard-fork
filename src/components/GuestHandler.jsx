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
        console.log('USE GUEST TRUE')
        setUseWallet(showcaseWallet);
        localStorage.setItem('guestShowcase', true)
      } else {
        localStorage.setItem('guestShowcase', false)
        console.log('USE GUEST FALSE')
      }
    }
  }, [useShowcase, isDisconnected])

  useEffect(() => {
    console.log(10101, {isConnected}, {accountAddress})
    if (isConnected) {
      if (accountAddress) {
        console.log('USE WALLET TRUE')
        setUseWallet(accountAddress);
        setUseShowcase(false);
        localStorage.setItem('guestShowcase', false)
      } else {
        console.log('USE WALLET FALSE')
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