import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ethers } from "ethers";
import {
  useAccount,
  useChainId,
  useReadContract,
  useReadContracts,
  useWatchBlockNumber,
  useWatchContractEvent
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  useVaultManagerAbiStore,
  usesUSDContractAddressStore,
  useContractAddressStore,
  useGuestShowcaseStore,
} from "../../store/Store";

import { useInactivityControl } from '../../components/InactivityControl';

import VaultCreate from "../../components/vaults/VaultCreate";
import VaultList from "../../components/vaults/VaultList";
import Card from "../../components/ui/Card";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";

const Vaults = () => {
  // const { address: accountAddress } = useAccount();
  // const { address: wagmiWallet } = useAccount();
  const { isActive } = useInactivityControl();

  const {
    useWallet,
  } = useGuestShowcaseStore();

  const accountAddress = useWallet;

  const { vaultManagerAbi } = useVaultManagerAbiStore();

  const navigate = useNavigate();

  const {
    arbitrumSepoliaContractAddress,
    arbitrumContractAddress
  } = useContractAddressStore();

  const {
    arbitrumsUSDSepoliaContractAddress,
    arbitrumsUSDContractAddress,
  } = usesUSDContractAddressStore();

  const chainId = useChainId();

  const vaultManagerAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumSepoliaContractAddress
      : arbitrumContractAddress;

  const sUSDVaultManagerAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumsUSDSepoliaContractAddress
      : arbitrumsUSDContractAddress;      

  const { data: sEURvaultIDs, refetch: refetchsEURVaultIDs } = useReadContract({
    abi: vaultManagerAbi,
    address: vaultManagerAddress,
    functionName: "vaultIDs",
    args: [accountAddress || ethers?.constants?.AddressZero],
    enabled: isActive,
  });

  const { data: sUSDvaultIDs, refetch: refetchsUSDVaultIDs } = useReadContract({
    abi: vaultManagerAbi,
    address: sUSDVaultManagerAddress,
    functionName: "vaultIDs",
    args: [accountAddress || ethers?.constants?.AddressZero],
    enabled: isActive,
  });

  const [tokenId, setTokenId] = useState();
  const [vaultType, setVaultType] = useState();

  // Watch for EUROs Vaults
  useWatchContractEvent({
    abi: vaultManagerAbi,
    address: vaultManagerAddress,
    eventName: "VaultDeployed",
    args: {
      owner: accountAddress
    },
    poll: true,
    pollingInterval: 1000,
    onLogs(logs) {
      if (logs[0] && logs[0].args) {
        const { tokenId } = logs[0] && logs[0].args;
        setTokenId(tokenId);
        setVaultType('EUROs');

        try {
          plausible('CreateVault', {
            props: {
              VaultType: 'EUROs',
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  });

  // Watch for USDs Vaults
  useWatchContractEvent({
    abi: vaultManagerAbi,
    address: sUSDVaultManagerAddress,
    eventName: "VaultDeployed",
    args: {
      owner: accountAddress
    },
    poll: true,
    pollingInterval: 1000,
    onLogs(logs) {
      if (logs[0] && logs[0].args) {
        const { tokenId } = logs[0] && logs[0].args;
        setTokenId(tokenId);
        setVaultType('USDs');

        try {
          plausible('CreateVault', {
            props: {
              VaultType: 'USDs',
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  });

  const sEURvaultDataContract = {
    abi: vaultManagerAbi,
    address: vaultManagerAddress,
    functionName: "vaultData",
  };

  const sUSDvaultDataContract = {
    abi: vaultManagerAbi,
    address: sUSDVaultManagerAddress,
    functionName: "vaultData",
  };

  const sEURcontracts = sEURvaultIDs?.map((id) => {
    return ({
      ...sEURvaultDataContract,
      args: [id],
    })
  });

  const sUSDcontracts = sUSDvaultIDs?.map((id) => {
    return ({
      ...sUSDvaultDataContract,
      args: [id],
    })
  });

  const { data: sEURvaultData, isPending: sEURisPending, refetch: refetchsEURVaultData } = useReadContracts({
    contracts: sEURcontracts,
    enabled: isActive,
  });

  const { data: sUSDvaultData, isPending: sUSDisPending, refetch: refetchsUSDVaultData } = useReadContracts({
    contracts: sUSDcontracts,
    enabled: isActive,
  });

  const mysEURVaults = sEURvaultData?.map((item) => {
    if (item && item.result) {
      return (
        item.result
      )    
    }
  });

  const mysUSDVaults = sUSDvaultData?.map((item) => {
    if (item && item.result) {
      return (
        item.result
      )    
    }
  });

  useWatchBlockNumber({
    enabled: isActive,
    onBlockNumber() {
      refetchsEURVaultIDs();
      refetchsEURVaultData();
      refetchsUSDVaultIDs();
      refetchsUSDVaultData();
    },
  })

  return (
    <main>
      <Card className="flex-1 card-compact mb-4">
        <div className="card-body">
          <div
            className="flex flex-col md:flex-row"
          >
            <div className="flex flex-col my-auto mx-0">
              <Typography variant="h2" className="card-title">
              Stake TST Today | Earn Protocol Fees + Early Governance | Join Before $10M TVL
              </Typography>
              <Typography variant="h3">
                💰 1% of all yield pool deposits<br/>
                💸 Up to 5% of debt minting fees<br/>
                💎 1% of all collateral trades
              </Typography>
            </div>
          </div>

          <div
            className="card-actions"
          >
            <Button
              className="w-auto"
              color="primary"
              onClick={() => navigate('../staking-pool')}
            >
              Start Staking
            </Button>
          </div>
        </div>
      </Card>
      <VaultCreate
        tokenId={tokenId}
        vaultType={vaultType}
        vaultsLoading={sEURisPending || sUSDisPending || false}
      />
      <VaultList
        listType={'USDs'}
        vaults={mysUSDVaults || []}
        vaultsLoading={sUSDisPending || false}
      />
      <VaultList
        listType={'EUROs'}
        vaults={mysEURVaults || []}
        vaultsLoading={sEURisPending || false}
      />
    </main>
  );
};

export default Vaults;