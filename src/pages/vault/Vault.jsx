import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
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
  useVaultAddressStore,
  useVaultStore,
  useVaultIdStore,
  useContractAddressStore,
  useVaultManagerAbiStore,
} from "../../store/Store";

import CenterLoader from "../../components/ui/CenterLoader";
import Button from "../../components/ui/Button";

import Debt from "../../components/vault/Debt";
import VaultStats from "../../components/vault/VaultStats";
import TokenList from "../../components/vault/TokenList";
import VaultSend from "../../components/vault/VaultSend";
import TokenTotalPie from "../../components/vault/TokenTotalPie";

import Card from "../../components/ui/Card";
import Typography from "../../components/ui/Typography";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const Vault = () => {
  const { vaultId } = useParams();
  const { setVaultAddress } = useVaultAddressStore();
  const { vaultStore, setVaultStore } = useVaultStore();
  const { arbitrumSepoliaContractAddress, arbitrumContractAddress } =
    useContractAddressStore();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const { setVaultID } = useVaultIdStore();

  //local states
  const { data: blockNumber } = useBlockNumber();
  const [renderedBlock, setRenderedBlock] = useState(blockNumber);
  const navigate = useNavigate();

  const chainId = useChainId();
  const query = useQuery();

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

  const { data: vaultData, refetch, isLoading } = useReadContract({
    address: vaultManagerAddress,
    abi: vaultManagerAbi,
    functionName: "vaultData",
    args: [vaultId],
  });

  useWatchBlockNumber({
    onBlockNumber() {
      setRenderedBlock(blockNumber);
      refetch();
    },
  })

  const { isConnected, address } = useAccount();

  const currentVault = vaultData;

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

  if (!currentVault || !isConnected) {
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

  return (
    <main>
      <Card className="card-compact">
        <div className="card-body">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1">
              {vaultNav()}
              <VaultStats
                currentVault={currentVault}
              />
              <div className="pt-4 hidden md:block">
                <Debt
                  currentVault={currentVault}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <TokenTotalPie
                chartData={chartData}
                currentVault={currentVault}
                vaultId={vaultId}
                vaultVersion={vaultVersion}
              />
              <div className="pt-4 w-full block md:hidden">
                <Debt
                  currentVault={currentVault}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-4">
        <TokenList
          assets={assets}
          assetsLoading={!assets.length || assets.length === 0}
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