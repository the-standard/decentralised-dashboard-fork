import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import WalletProvider from './components/WalletProvider';
import ThemeHandler from './components/ThemeHandler';
import DisconnectHandler from './components/DisconnectHandler';
import DashLayout from "./components/ui/DashLayout";
import Home from './pages/Home';
import Vaults from './pages/vaults/Vaults';
import Vault from './pages/vault/Vault';
import VaultHistory from './pages/vault/VaultHistory';
import LiquidationPools from './pages/liquidation-pools/LiquidationPools';
import StakingPool from './pages/staking-pool/StakingPool';
import TermsOfUse from './pages/TermsOfUse';

import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeHandler>
        <WalletProvider>
          <DisconnectHandler>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="vaults" element={<DashLayout><Vaults /></DashLayout>} />
              <Route path="vault/:vaultId" element={<DashLayout><Vault /></DashLayout>} />
              <Route path="vault/:vaultId/history" element={<DashLayout><VaultHistory /></DashLayout>} />
              <Route path="liquidation-pools" element={<DashLayout><LiquidationPools /></DashLayout>} />
              <Route path="staking-pool" element={<DashLayout><StakingPool /></DashLayout>} />
              <Route path="termsofuse" element={<DashLayout><TermsOfUse /></DashLayout>} />
              <Route path="*" element={<Home/>} />
            </Routes>
          </DisconnectHandler>
        </WalletProvider>
      </ThemeHandler>
    </QueryClientProvider>
  )
}

export default App;
