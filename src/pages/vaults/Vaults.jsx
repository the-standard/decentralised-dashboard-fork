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

  const { data: sEURvaultIDs, refetch: refetchsEURVaultIDs } = useReadContract({
    abi: vaultManagerAbi,
    address: vaultManagerAddress,
    functionName: "vaultIDs",
    args: [accountAddress || ethers?.constants?.AddressZero]
  });

  const { data: sUSDvaultIDs, refetch: refetchsUSDVaultIDs } = useReadContract({
    abi: vaultManagerAbi,
    address: sUSDVaultManagerAddress,
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
    contracts: sEURcontracts
  });

  const { data: sUSDvaultData, isPending: sUSDisPending, refetch: refetchsUSDVaultData } = useReadContracts({
    contracts: sUSDcontracts
  });

  // const allVaultData = [].concat(sEURvaultData, sUSDvaultData);

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
    onBlockNumber() {
      refetchsEURVaultIDs();
      refetchsEURVaultData();
      refetchsUSDVaultIDs();
      refetchsUSDVaultData();
    },
  })

  return (
    <main>
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