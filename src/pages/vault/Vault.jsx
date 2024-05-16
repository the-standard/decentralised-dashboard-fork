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
      <div className="flex flex-wrap mb-4">
        <Button
          onClick={() => navigate('/')}
          disabled={isLoading}
        >
          <ChevronLeftIcon className="h-6 w-6 inline-block"/>
          Return to Vaults
        </Button>
      </div>
    )
  };

  if (isLoading) {
    return (
      <main>
        {vaultNav()}
        <Card className="card-compact">
          <div className="card-body">
            <CenterLoader />
          </div>
        </Card>
      </main>
    )
  }

  if (!currentVault || !isConnected) {
    return (
      <main>
        {vaultNav()}
        <Card className="card-compact">
          <div className="card-body">
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

  return (
    <main>
      {vaultNav()}
      <Card className="card-compact">
        <div className="card-body">
          <VaultStats
            currentVault={currentVault}
          />
          <Debt
            currentVault={currentVault}
          />
        </div>
      </Card>

      <div className="mt-4">
        <Card className="card-compact">
          <div className="card-body">
            <TokenTotalPie
              chartData={chartData}
              currentVault={currentVault}
            />
          </div>
        </Card>
      </div>
      
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