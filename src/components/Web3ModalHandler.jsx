import { createWeb3Modal, useWeb3Modal } from '@web3modal/wagmi/react';
import { arbitrum, arbitrumSepolia } from "wagmi/chains";

import wagmiConfig from "../WagmiConfig";
const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

const Web3ModalHandler = ({children}) => {

  const localTheme = localStorage.getItem('theme');
  const useTheme = localTheme || "light";

  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains: [arbitrum, arbitrumSepolia],
    themeMode: useTheme,
  });

  return (
    <>
      {children}
    </>
  )};

export default Web3ModalHandler;