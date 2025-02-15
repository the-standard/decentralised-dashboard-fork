import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useReadContract,
  useChainId,
  useWatchBlockNumber,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { formatUnits, formatEther } from "viem";
import moment from 'moment';
import axios from "axios";
import {
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

import {
  useCurrentPageStore,
  useContractAddressStore,
  useVaultManagerAbiStore,
} from "../../store/Store";

import CenterLoader from "../../components/ui/CenterLoader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";

const itemsPerPage = 8;

const VaultHistory = () => {
  const chainId = useChainId();
  const { arbitrumSepoliaContractAddress, arbitrumContractAddress } = useContractAddressStore();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const { vaultType, vaultId } = useParams();
  const navigate = useNavigate();

  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyData, setHistoryData] = useState(undefined);
  const [totalRows, setTotalRows] = useState(undefined);
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

  if (vaultType === 'USDs') {

    return (
      <div>
        <Card className="card-compact">
          <div className="card-body overflow-x-scroll">
            {vaultNav()}
  
            <div role="alert" className="alert alert-warning bg-yellow-400/20 mb-2">
              <span>
                <b>V4 Vaults History Maintenance</b>
                <br/>
                We are are currently reworking the tx history indexing for V4 vaults. We apologise for the downtime until this is completed.
              </span>
            </div>
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Minted (EUROs)</th>
                  <th>Total Collateral Value (€)</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
            </table>
            <div className="card-actions pt-4 justify-between items-center">
              <div>&nbsp;</div>
            </div>
          </div>
         
        </Card>
      </div>
    )  
  }

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

  useEffect(() => {
    if (currentVault && !vaultsLoading) {
      getHistoryData();
    }
  }, [currentPage, currentVault, vaultsLoading]);

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

  const { vaultAddress } = currentVault.status;

  const getHistoryData = async () => {
    try {
      setHistoryLoading(true);
      const limit = itemsPerPage;
      const page = currentPage - 1;
      const response = await axios.get(
        `https://smart-vault-api.thestandard.io/transactions/${vaultAddress}?page=${page}&limit=${limit}`
      );
      const data = response.data.data;
      const rows = response.data.pagination.totalRows;
      setHistoryData(data);
      setTotalRows(rows);
      setHistoryLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const rows = historyData || [];

  const handleEtherscanLink = (txRef) => {
    const arbiscanUrl = chainId === arbitrumSepolia.id
      ? `https://sepolia.arbiscan.io/tx/${txRef}`
      : `https://arbiscan.io/tx/${txRef}`;
      
    window.open(arbiscanUrl, "_blank");
  };

  return (
    <div>
      <Card className="card-compact">
        <div className="card-body overflow-x-scroll">
          {vaultNav()}

          <div role="alert" className="alert alert-warning bg-yellow-400/20 mb-2">
            <span>
              <b>History Maintenance</b>
              <br/>
              We are are working on improving the speed of history updates. In the meantime you may experience temporary drops in history coverage or delayed new entries.
            </span>
          </div>
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Type</th>
                <th>Time</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Minted (EUROs)</th>
                <th>Total Collateral Value (€)</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            {vaultsLoading ? (null) : (
              <tbody>
                {rows && rows.length ? (
                  <>
                    {rows.map(function(row, index) {
                      const useType = row.type || '';
                      const useTimestamp = row.timestamp || '';
                      let useDate = '';
                      if (useTimestamp) {
                        useDate = moment.unix(useTimestamp).format("D/MMM/YYYY HH:mm:ss");
                      }
                      const useAsset = row.asset || '';
                      const amount = row.amount || '';
                      const assetDec = row.assetDec || '';
                      let useAmount = '';
                      if (amount && assetDec) {
                        useAmount = formatUnits(amount.toString(), assetDec);
                      }
                      const minted = row.minted || '';
                      let useMinted = '';
                      if (minted) {
                        useMinted = formatEther(minted.toString());
                      }
                      const totalCollateralValue = row.totalCollateralValue;
                      let useTotalCollateralValue = '';
                      if (totalCollateralValue) {
                        useTotalCollateralValue = Number(formatEther(totalCollateralValue)).toFixed(2);
                      }
                      const txHash = row.txHash || '';

                      return (
                        <tr
                          key={index}
                        >
                          <td className="capitalize" width="120">
                            {useType.toLowerCase() || ''}
                          </td>
                          <td>
                            {useDate || ''}
                          </td>
                          <td>
                            {useAsset || ''}
                          </td>
                          <td>
                            {useAmount.toString()}
                          </td>
                          <td>
                            {useMinted.toString()}
                          </td>
                          <td>
                            {useTotalCollateralValue.toString()}
                          </td>
                          <td className="text-right">
                            <Button
                              onClick={() => handleEtherscanLink(txHash)}
                              color="ghost"
                              disabled={!txHash}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      )}
                    )}
                  </>
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
          <div className="card-actions pt-4 justify-between items-center">
            {rows && rows.length ? (
              <Pagination
                totalItems={totalRows || 0}
                perPage={itemsPerPage || 0}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                mode="server"
              />
            ) : (
              <div>&nbsp;</div>
            ) }
          </div>
        </div>
       
      </Card>
    </div>
  )
};

export default VaultHistory;
