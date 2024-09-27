import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  useBlockNumber,
  useReadContract,
  useChainId,
  useWatchBlockNumber,
  useAccount,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useVaultStore,
  useVaultIdStore,
  useContractAddressStore,
  useVaultManagerAbiStore,
  usesUSDContractAddressStore,
  useSmartVaultABIStore,
} from "../../store/Store";

import CenterLoader from "../../components/ui/CenterLoader";
import Button from "../../components/ui/Button";

import Debt from "../../components/vault/Debt";
import VaultStats from "../../components/vault/VaultStats";
import TokenList from "../../components/vault/TokenList";
import VaultSend from "../../components/vault/VaultSend";
import TokenTotalPie from "../../components/vault/TokenTotalPie";

import YieldParent from "../../components/vault/yield/YieldParent";

import Card from "../../components/ui/Card";
import Typography from "../../components/ui/Typography";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const Vault = () => {
  const { vaultType, vaultId } = useParams();
  const { setVaultAddress } = useVaultAddressStore();
  const { vaultStore, setVaultStore } = useVaultStore();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const { setVaultID } = useVaultIdStore();

  const {
    arbitrumSepoliaContractAddress,
    arbitrumContractAddress
  } = useContractAddressStore();

  const {
    arbitrumsUSDSepoliaContractAddress,
    arbitrumsUSDContractAddress,
  } = usesUSDContractAddressStore();

  //local states
  const { data: blockNumber } = useBlockNumber();
  const [renderedBlock, setRenderedBlock] = useState(blockNumber);
  const navigate = useNavigate();

  const chainId = useChainId();
  const query = useQuery();

  const { isConnected, address } = useAccount();

  useEffect(() => {
    setVaultID(vaultId);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const vaultManagerAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumSepoliaContractAddress
      : arbitrumContractAddress;

  const sUSDVaultManagerAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumsUSDSepoliaContractAddress
      : arbitrumsUSDContractAddress;          

  const { data: vaultDatasEUR, refetch: refetchsEUR, isLoading: isLoadingsEUR } = useReadContract({
    abi: vaultManagerAbi,
    address: vaultManagerAddress,
    functionName: "vaultData",
    args: [vaultId],
  });

  const { data: vaultDatasUSD, refetch: refetchsUSD, isLoading: isLoadingsUSD } = useReadContract({
    abi: vaultManagerAbi,
    address: sUSDVaultManagerAddress,
    functionName: "vaultData",
    args: [vaultId],
  });

  let currentVault = {};
  let isLoading = true;
  let isValidVaultType = false;

  if (vaultType === 'EUROs') {
    currentVault = vaultDatasEUR;
    isLoading = isLoadingsEUR;
    isValidVaultType = true;
  }

  if (vaultType === 'USDs') {
    currentVault = vaultDatasUSD;
    isLoading = isLoadingsUSD;
    isValidVaultType = true;
  }

  useWatchBlockNumber({
    onBlockNumber() {
      setRenderedBlock(blockNumber);
      if (vaultType === 'EUROs') {
        refetchsEUR();
      }
      if (vaultType === 'USDs') {
        refetchsUSD();
      }
    },
  })

  const vaultNav = (element) => {
    return (
      <div className="flex flex-wrap mb-4 gap-4">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          disabled={isLoading}
          className="pl-2"
        >
          <ChevronLeftIcon className="h-6 w-6 inline-block"/>
          All Vaults
        </Button>
        <Button
          onClick={() => navigate('./history')}
          variant="outline"
          disabled={isLoading}
        >
          History
        </Button>
        <Button
          onClick={() => handleArbiscanLink()}
          variant="outline"
          disabled={isLoading}
        >
          Arbiscan
        </Button>
      </div>
    )
  };

  const handleArbiscanLink = () => {
    const arbiscanUrl = chainId === arbitrumSepolia.id
      ? `https://sepolia.arbiscan.io/address/${vaultAddress}`
      : `https://arbiscan.io/address/${vaultAddress}`;
    window.open(arbiscanUrl, "_blank");
  };

  if (isLoading) {
    return (
      <main>
        <Card className="card-compact">
          <div className="card-body">
            {vaultNav()}
            <CenterLoader />
          </div>
        </Card>
      </main>
    )
  }

  if (!currentVault || !isConnected || !isValidVaultType) {
    return (
      <main>
        <Card className="card-compact">
          <div className="card-body">
            {vaultNav()}
            <Typography
              variant="h2"
            >
              Vault Not Found
            </Typography>
          </div>
        </Card>
      </main>
    );
  }

  const assets = currentVault.status.collateral;
  const { vaultAddress } = currentVault.status;

  if (
    vaultStore.tokenId !== currentVault.tokenId ||
    blockNumber !== renderedBlock
  ) {
    setVaultStore(currentVault);
    setVaultAddress(vaultAddress);
    setRenderedBlock(blockNumber);
  }

  const chartData = currentVault.status.collateral.map((asset) => {
    return {
      name: ethers.decodeBytes32String(asset.token.symbol),
      prices: Number(ethers.formatEther(asset.collateralValue)).toFixed(2),
      total: Number(ethers.formatUnits(asset.amount, asset.token.dec)).toFixed(2),
    };
  });

  const vaultVersion = vaultStore?.status?.version || '';

  const yieldEnabled = (vaultType === 'USDs') && (vaultVersion >= 4);

  return (
    <main>
      <Card className="card-compact">
        <div className="card-body">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1">
              {vaultNav()}
              <VaultStats
                currentVault={currentVault}
                vaultType={vaultType}
              />
              <div className="pt-4 hidden md:block">
                <Debt
                  currentVault={currentVault}
                  vaultType={vaultType}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <TokenTotalPie
                chartData={chartData}
                currentVault={currentVault}
                vaultType={vaultType}
                vaultId={vaultId}
                vaultVersion={vaultVersion}
              />
              <div className="pt-4 w-full block md:hidden">
                <Debt
                  currentVault={currentVault}
                  vaultType={vaultType}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div className="flex flex-col md:flex-row mt-4 gap-4 flex-wrap">
        <div className="flex-1 grow-[4]">
          <TokenList
            vaultType={vaultType}
            assets={assets}
            assetsLoading={!assets.length || assets.length === 0}
            yieldEnabled={yieldEnabled}
          />
        </div>

        <YieldParent
          yieldEnabled={yieldEnabled}
          vaultType={vaultType}
        />
      </div>
      
      <div className="mt-4">
        <VaultSend
          currentVault={currentVault}
          vaultId={vaultId}
          address={address}
        />
      </div>
    </main>
  )
};

export default Vault;