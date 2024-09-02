import { useState } from "react";

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
} from "../../store/Store.jsx";

import VaultCreate from "../../components/vaults/VaultCreate";
import VaultList from "../../components/vaults/VaultList";

const Vaults = () => {
  const { address: accountAddress } = useAccount();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
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

  const { data: vaultIDs, refetch: refetchVaultIDs } = useReadContract({
    address: vaultManagerAddress,
    abi: vaultManagerAbi,
    functionName: "vaultIDs",
    args: [accountAddress || ethers?.constants?.AddressZero]
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

  const vaultDataContract = {
    address: vaultManagerAddress,
    abi: vaultManagerAbi,
    functionName: "vaultData",
  };

  const contracts = vaultIDs?.map((id) => {
    return ({
      ...vaultDataContract,
      args: [id],
    })
  });

  const { data: vaultData, isPending, refetch: refetchVaultData } = useReadContracts({
    contracts
  });

  const myVaults = vaultData?.map((item) => {
    if (item && item.result) {
      return (
        item.result
      )    
    }
  });

  useWatchBlockNumber({
    onBlockNumber() {
      refetchVaultIDs();
      refetchVaultData();
    },
  })

  return (
    <main>
      <VaultCreate
        tokenId={tokenId}
        vaultType={vaultType}
        vaults={myVaults || []}
        vaultsLoading={isPending || false}
      />
      <VaultList
        tokenId={tokenId}
        vaults={myVaults || []}
        vaultsLoading={isPending || false}
      />
    </main>
  );
};

export default Vaults;