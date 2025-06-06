import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useReadContract,
  useChainId,
  useBlockNumber,
  useWatchBlockNumber,
} from "wagmi";

import axios from "axios";

import { arbitrumSepolia } from "wagmi/chains";
import {
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

import {
  useLocalThemeModeStore,
  usesUSDContractAddressStore,
  useVaultManagerAbiStore,
  useVaultAddressStore,
  useVaultStore,
} from "../../store/Store";

import { useInactivityControl } from '../../components/InactivityControl';

import MerklPoweredDark from "../../assets/merkl-powered-dark.svg";
import MerklPoweredLight from "../../assets/merkl-powered-light.svg";

import RewardList from "../../components/vault/merkl/RewardList";

import CenterLoader from "../../components/ui/CenterLoader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const VaultMerkl = () => {
  const chainId = useChainId();
  const { isActive } = useInactivityControl();

  const {
    arbitrumsUSDSepoliaContractAddress,
    arbitrumsUSDContractAddress
  } = usesUSDContractAddressStore();

  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const { setVaultAddress } = useVaultAddressStore();
  const { vaultStore, setVaultStore } = useVaultStore();
  const { vaultType, vaultId } = useParams();
  const { localThemeModeStore } = useLocalThemeModeStore();
  const navigate = useNavigate();

  const { data: blockNumber } = useBlockNumber();
  const [renderedBlock, setRenderedBlock] = useState(blockNumber);

  const [vaultsLoading, setVaultsLoading] = useState(true);
  const [ merklRewards, setMerklRewards ] = useState({});
  const [ merklRewardsLoading, setMerklRewardsLoading ] = useState(true);

  const isLight = localThemeModeStore && localThemeModeStore.includes('light');

  const vaultNav = () => {
    return (
      <div className="flex flex-col sm:flex-row mb-4">
        <div className="flex flex-1 sm:flex-auto flex-wrap gap-4">
          <Button
            onClick={() => navigate(`../vault/${vaultType.toString()}/${vaultId}`)}
            variant="outline"
            disabled={vaultsLoading}
            className="pl-2"
          >
            <ChevronLeftIcon className="h-6 w-6 inline-block"/>
            Back To Vault
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            disabled={vaultsLoading}
          >
            All Vaults
          </Button>
        </div>
        <div className="hidden sm:flex flex-1 sm:flex-auto justify-start sm:justify-end">
          <img
            src={isLight ? (MerklPoweredLight) : (MerklPoweredDark)}
            alt="Powered By Merkl"
            className="h-8"
          />
        </div>
      </div>
    )
  };

  useEffect(() => {
    // fixes flashing "no vault found" on first load
    setVaultsLoading(true);
    setTimeout(() => {
      setVaultsLoading(false);
    }, 1000);
  }, []);

  const sUSDVaultManagerAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumsUSDSepoliaContractAddress
      : arbitrumsUSDContractAddress;          

  const { data: vaultData } = useReadContract({
    abi: vaultManagerAbi,
    address: sUSDVaultManagerAddress,
    functionName: "vaultData",
    args: [vaultId],
    enabled: isActive,
  });

  // useWatchBlockNumber({
  //   enabled: isActive,
  //   onBlockNumber() {
  //     refetch();
  //   },
  // })

  const currentVault = vaultData;

  useEffect(() => {
    getMerklRewardsData();
  }, [currentVault, vaultsLoading]);

  const getMerklRewardsData = async () => {  
    const { vaultAddress } = currentVault.status;

    try {
      setMerklRewardsLoading(true);
      const response = await axios.get(
        `https://api.merkl.xyz/v3/userRewards?chainId=42161&proof=true&user=${vaultAddress}`
      );

      const useData = response?.data;

      const rewardsArray = [];

      Object.keys(useData).forEach(key => {
        const value = useData[key];
        const rewardItem = {
          tokenAddress: key,
          ... value
        }
        rewardsArray.push(rewardItem);
      });

      setMerklRewards(rewardsArray);
      setMerklRewardsLoading(false);
    } catch (error) {
      setMerklRewardsLoading(false);
      console.log(error);
    }
  };

  if (!currentVault) {
    return (
      <div>
        <Card className="card-compact">
          <div className="card-body">
            {vaultNav()}
            <CenterLoader />
          </div>
        </Card>
      </div>
    );
  }

  const { vaultAddress } = currentVault.status;

  if (
    vaultStore.tokenId !== currentVault.tokenId ||
    blockNumber !== renderedBlock
  ) {
    setVaultStore(currentVault);
    setVaultAddress(vaultAddress);
    setRenderedBlock(blockNumber);
  }

  return (
    <div>
      <Card className="card-compact mb-4">
        <div className="card-body">
          {vaultNav()}
          <RewardList
            merklRewards={merklRewards}
            merklRewardsLoading={merklRewardsLoading}
            getMerklRewardsData={getMerklRewardsData}
          />
        </div>
      </Card>

    </div>
  )
};

export default VaultMerkl;
