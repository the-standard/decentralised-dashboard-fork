import { ethers } from "ethers";
import {
  useAccount,
  useChainId,
  useReadContract,
  useReadContracts,
  useWatchBlockNumber
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  useVaultManagerAbiStore,
  useContractAddressStore,
} from "../../store/Store.jsx";

import VaultList from "../../components/vaults/VaultList";

const Vaults = () => {
  const { address: accountAddress } = useAccount();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const { arbitrumSepoliaContractAddress, arbitrumContractAddress } = useContractAddressStore();

  const chainId = useChainId();
  const vaultManagerAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumSepoliaContractAddress
      : arbitrumContractAddress;

  const { data: vaultIDs, refetch: refetchVaultIDs } = useReadContract({
    address: vaultManagerAddress,
    abi: vaultManagerAbi,
    functionName: "vaultIDs",
    args: [accountAddress || ethers?.constants?.AddressZero]
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
      <VaultList
        vaults={myVaults || []}
        vaultsLoading={isPending || false}
      />
    </main>
  );
};

export default Vaults;