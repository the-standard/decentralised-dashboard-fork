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
  useGuestShowcaseStore,
} from "../../store/Store";

import { useInactivityControl } from '../../components/InactivityControl';

import CenterLoader from "../../components/ui/CenterLoader";
import Button from "../../components/ui/Button";

import Debt from "../../components/vault/Debt";
import VaultStats from "../../components/vault/VaultStats";
import TokenList from "../../components/vault/TokenList";
import VaultSend from "../../components/vault/VaultSend";
import TokenTotalPie from "../../components/vault/TokenTotalPie";
import VaultNFT from "../../components/vault/VaultNFT";
import VaultSavingsSummary from "../../components/vault/VaultSavingsSummary";
import VaultRedemptionAlert from "../../components/vault/VaultRedemptionAlert";

import YieldParentNew from "../../components/vault/yield/YieldParentNew";

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
  const { isActive } = useInactivityControl();

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

  // const { isConnected, address } = useAccount();
  const {
    useWallet,
    useShowcase,
  } = useGuestShowcaseStore();
  const accountAddress = useWallet;

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
    enabled: isActive,
  });

  const { data: vaultDatasUSD, refetch: refetchsUSD, isLoading: isLoadingsUSD } = useReadContract({
    abi: vaultManagerAbi,
    address: sUSDVaultManagerAddress,
    functionName: "vaultData",
    args: [vaultId],
    enabled: isActive,
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
    enabled: isActive,
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
        {vaultType === 'USDs' ? (
          <Button
            onClick={() => navigate('./merkl')}
            variant="outline"
            disabled={isLoading}
          >
            Merkl Rewards
          </Button>
        ) : null}
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

  if (!currentVault || !isValidVaultType) {
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
            <div className="w-full md:w-2/3">
              {vaultNav()}
              <VaultStats
                currentVault={currentVault}
                vaultType={vaultType}
                isLoading={isLoading}
                yieldEnabled={yieldEnabled}
              />
              <div className="pt-4 hidden md:block">
                <Debt
                  currentVault={currentVault}
                  vaultType={vaultType}
                />
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
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
          {vaultType === 'USDs' ? (
            <VaultRedemptionAlert
              vaultId={vaultId}
            />
          ) : null}
          <VaultSavingsSummary />
          <TokenList
            vaultType={vaultType}
            assets={assets}
            assetsLoading={!assets.length || assets.length === 0}
            yieldEnabled={yieldEnabled}
          />
          <Card className="flex-1 card-compact mt-4">
            <div className="card-body">
              <div
                className="flex flex-col md:flex-row"
              >
                <div className="flex flex-col my-auto mx-0">
                  <Typography variant="h2" className="card-title">
                    Earn From Every Transaction | TST stakers receive:
                  </Typography>
                  <Typography variant="p">
                    💰 1% of all yield pool deposits<br/>
                    💸 Up to 5% of debt minting fees<br/>
                    💎 1% of all collateral trades
                  </Typography>
                </div>
              </div>

              <div
                className="card-actions pt-4"
              >
                <Button
                  className="w-full"
                  color="primary"
                  onClick={() => navigate('../staking-pool')}
                >
                  Start Staking
                </Button>
              </div>
            </div>
          </Card>

        </div>
        <div className="flex-1 grow-[3]">
          <YieldParentNew
            yieldEnabled={yieldEnabled}
            vaultType={vaultType}
          />

          <div className="mt-4">
            <VaultNFT
              currentVault={currentVault}
              vaultId={vaultId}
              vaultType={vaultType}
            />
          </div>

        </div>
      </div>
      
      <div className="mt-4">
        {useShowcase ? (null) : (
          <VaultSend
            currentVault={currentVault}
            vaultId={vaultId}
            address={accountAddress}
            vaultType={vaultType}
          />
        )}
      </div>
    </main>
  )
};

export default Vault;