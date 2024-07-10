import { useMemo } from 'react';
import { WagmiProvider, http } from 'wagmi';
import { convertExtendedChain } from '@lifi/wallet-management';
import { useAvailableChains } from '@lifi/widget';
import { RainbowKitProvider, getDefaultConfig, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  arbitrumSepolia
} from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

import {
  useCurrentTheme,
} from "../store/Store";

import CenterLoader from "./ui/CenterLoader";

const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

const WalletProvider = ({ children }) => {
  const { currentTheme } = useCurrentTheme();
  const isLight = currentTheme && currentTheme.includes('light');

  const { chains, isLoading } = useAvailableChains();

  const wagmiConfig = useMemo(() => {
    const mainChains = chains?.length
    ? (chains.map(convertExtendedChain))
    : [arbitrum];

    const _chains = [...mainChains, arbitrumSepolia];

    const wagmiConfig = getDefaultConfig({
      appName: 'The Standard',
      projectId: projectId,
      chains: _chains,
      transports: {
        [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`),
        [arbitrumSepolia.id]: http(`https://arb-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_SEPOLIA_API_KEY}`)
      },    
    });

    return wagmiConfig;
  }, [chains]);

  let useTheme = darkTheme({overlayBlur: 'small'});
  if (isLight) {
    useTheme = lightTheme({overlayBlur: 'small'});
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <CenterLoader />
      </div>
    )
  }

  return (
    <WagmiProvider
      config={wagmiConfig}
      reconnectOnMount={true}
    >
      <RainbowKitProvider modalSize="compact" theme={useTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;