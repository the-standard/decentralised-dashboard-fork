import React, { useEffect } from "react";

import { createWeb3Modal, useWeb3ModalTheme, } from '@web3modal/wagmi/react';

import { arbitrum, arbitrumSepolia } from "wagmi/chains";

import {
  useCurrentTheme,
} from "../store/Store";

import wagmiConfig from "../WagmiConfig";
const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

const Web3ModalHandler = ({children}) => {

  const { currentTheme } = useCurrentTheme();

  const isLight = currentTheme && currentTheme.includes('light');

  let useTheme = 'dark';
  if (isLight) {
    useTheme = 'light';
  }

  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains: [arbitrum, arbitrumSepolia],
    themeMode: useTheme,
  });

  const { setThemeMode } = useWeb3ModalTheme()

  useEffect(() => {
    setThemeMode(useTheme)
  }, [useTheme]);

  return (
    <>
      {children}
    </>
  )};

export default Web3ModalHandler;