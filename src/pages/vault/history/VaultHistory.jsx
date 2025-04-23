import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useReadContract,
  useChainId,
  useWatchBlockNumber,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import {
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

import {
  useCurrentPageStore,
  useContractAddressStore,
  useVaultManagerAbiStore,
} from "../../../store/Store";

import CenterLoader from "../../../components/ui/CenterLoader";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

import HistoryLegacy from "./HistoryLegacy";
import HistoryGraph from "./HistoryGraph";

const VaultHistory = () => {
  const chainId = useChainId();
  const { arbitrumSepoliaContractAddress, arbitrumContractAddress } = useContractAddressStore();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const { vaultType, vaultId } = useParams();
  const navigate = useNavigate();

  const [vaultsLoading, setVaultsLoading] = useState(true);

  const vaultNav = (element) => {
    return (
      <div className="flex flex-wrap mb-4 gap-4">
        <Button
          onClick={() => navigate(`../vault/${vaultType.toString()}/${vaultId}`)}
          variant="outline"
          // disabled={vaultsLoading}
          className="pl-2"
        >
          <ChevronLeftIcon className="h-6 w-6 inline-block"/>
          Back To Vault
        </Button>
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          // disabled={vaultsLoading}
        >
          All Vaults
        </Button>
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

  const vaultManagerAddress = chainId === arbitrumSepolia.id ?
      arbitrumSepoliaContractAddress :
      arbitrumContractAddress;

  const { data: vaultData, refetch } = useReadContract({
    address: vaultManagerAddress,
    abi: vaultManagerAbi,
    functionName: "vaultData",
    args: [vaultId],
  });

  useWatchBlockNumber({
    onBlockNumber() {
      refetch();
    },
  })

  const currentVault = vaultData;

  const { setCurrentPage, currentPage } = useCurrentPageStore();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (vaultsLoading) {
    return (
      <div>
        <Card className="card-compact">
          <div className="card-body">
            {vaultNav()}
            <CenterLoader />
          </div>
        </Card>
      </div>
    )
  }

  if (!currentVault) {
    return (
      <div>
        <Card className="card-compact">
          <div className="card-body">
            {vaultNav()}
            Vault Not Found
          </div>
        </Card>
      </div>
    );
  }

  if (vaultType === 'USDs') {
    return (
      <HistoryGraph
        currentVault={currentVault}
        vaultsLoading={vaultsLoading}
        handlePageChange={handlePageChange}
        vaultNav={vaultNav}
      />
    );
  }

  return (
    <HistoryLegacy vaultNav={vaultNav} />
  )

};

export default VaultHistory;