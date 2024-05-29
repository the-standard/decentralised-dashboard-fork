import { Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import wagmiConfig from "./WagmiConfig";

import Web3ModalHandler from './components/Web3ModalHandler';
import ThemeHandler from './components/ThemeHandler';
import DisconnectHandler from './components/DisconnectHandler';
import DashLayout from "./components/ui/DashLayout";
import Home from './pages/Home';
import Vaults from './pages/vaults/Vaults';
import Vault from './pages/vault/Vault';
import VaultHistory from './pages/vault/VaultHistory';
import LiquidationPools from './pages/liquidation-pools/LiquidationPools';

import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';


function App() {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <ThemeHandler>
          <Web3ModalHandler>
            <DisconnectHandler>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="vaults" element={<DashLayout><Vaults /></DashLayout>} />
                <Route path="vault/:vaultId" element={<DashLayout><Vault /></DashLayout>} />
                <Route path="vault/:vaultId/history" element={<DashLayout><VaultHistory /></DashLayout>} />
                <Route path="liquidation-pools" element={<DashLayout><LiquidationPools /></DashLayout>} />
                <Route path="*" element={<Home/>} />
              </Routes>
            </DisconnectHandler>
          </Web3ModalHandler>
        </ThemeHandler>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App;
