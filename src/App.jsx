import { Routes, Route } from "react-router-dom";
import { WagmiProvider, useAccount } from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { createWeb3Modal, useWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import wagmiConfig from "./WagmiConfig";

import ThemeHandler from './components/ThemeHandler';
import DisconnectHandler from './components/DisconnectHandler';
import DashLayout from "./components/ui/DashLayout";
import Home from './pages/Home';
import Vaults from './pages/vaults/Vaults';
import Vault from './pages/vault/Vault';
import LiquidationPools from './pages/liquidation-pools/LiquidationPools';
import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';

const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

function App() {
  const queryClient = new QueryClient();

  const localTheme = localStorage.getItem('theme');
  const useTheme = localTheme || "light";

  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains: [arbitrum, arbitrumSepolia],
    themeMode: useTheme,
  });

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <ThemeHandler>
          <DisconnectHandler>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="vaults" element={<DashLayout><Vaults /></DashLayout>} />
              <Route path="vault/:vaultId" element={<DashLayout><Vault /></DashLayout>} />
              <Route path="liquidation-pools" element={<DashLayout><LiquidationPools /></DashLayout>} />
              <Route path="*" element={<Home/>} />
            </Routes>
          </DisconnectHandler>
        </ThemeHandler>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App;
