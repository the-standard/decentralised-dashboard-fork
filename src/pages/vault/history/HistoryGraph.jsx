import { useEffect, useState } from "react";
import {
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { formatUnits, formatEther } from "viem";
import moment from 'moment';
import axios from "axios";

import {
  useCurrentPageStore,
} from "../../../store/Store";

import CenterLoader from "../../../components/ui/CenterLoader";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Pagination from "../../../components/ui/Pagination";
import Typography from "../../../components/ui/Typography";

import GraphHistoryModal from "../../../components/vault/history/GraphHistoryModal";

const itemsPerPage = 8;

const HistoryGraph = ({
  currentVault,
  vaultsLoading,
  handlePageChange,
  vaultNav
}) => {
  const chainId = useChainId();

  const { setCurrentPage, currentPage } = useCurrentPageStore();

  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyData, setHistoryData] = useState(undefined);
  const [totalRows, setTotalRows] = useState(undefined);

  const [open, setOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState({});

  useEffect(() => {
    if (currentVault && !vaultsLoading) {
      getHistoryData();
    }
  }, [currentPage, currentVault, vaultsLoading]);

  const { vaultAddress } = currentVault.status;

  const handleCloseModal = () => {
    setOpen(false);
    setHistoryItem({});
  };

  const handleOpenModal = (historyItem) => {
    setHistoryItem(historyItem);
    setOpen(true);
  }

  const getHistoryData = async () => {
    try {
      setHistoryLoading(true);
      const limit = itemsPerPage;
      const page = currentPage;
      const response = await axios.get(
        `https://smart-vault-api.thestandard.io/transactions/${vaultAddress}?page=${page}&limit=${limit}`
      );
      const data = response.data.smartVaultActivities;
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

  const formatType = (camelCase) => {
    const withSpaces = camelCase.replace(/([A-Z])/g, ' $1');
    const sentence = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).trim();
    if (sentence.toLowerCase().includes('usds')) {
      return sentence.replace(/usds/i, 'USDs');
    }
    return sentence;
  }

  if (historyLoading) {
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

  const ethTxLink = `https://arbiscan.io/address/${vaultAddress}?amt=0.0001~999999999`;
  const erc20TxLink = `https://arbiscan.io/address/${vaultAddress}#tokentxns`;

  return (
    <div>
      <Card className="card-compact">
        <div className="card-body overflow-x-scroll">
          {vaultNav()}
          <div className="flex flex-col sm:flex-row justify-between">
            <Typography variant="p">
              We are currently unable to show collateral deposit events.<br/> You can view your Smart Vault's&nbsp;
              <a
                href={ethTxLink}
                target="_blank"
                className="font-bold underline"
              >
                ETH transactions here
              </a>
              , and your&nbsp;
              <a
                href={erc20TxLink}
                target="_blank"
                className="font-bold underline"
              >
                ERC20 transactions here
              </a>
              .
            </Typography>
          </div>
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Type</th>
                <th>Time</th>
                <th>Vault Debt (USDs)</th>
                <th>Vault Collateral Value ($)</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            {vaultsLoading ? (null) : (
              <tbody>
                {rows && rows.length ? (
                  <>
                    {rows.map(function(row, index) {
                      const useType = row.detailType || '';
                      let showType = '';
                      if (useType) {
                        showType = formatType(useType);
                      }
                      
                      const useTimestamp = row.blockTimestamp || '';
                      let useDate = '';
                      if (useTimestamp) {
                        useDate = moment.unix(useTimestamp).format("D MMM YYYY HH:mm:ss");
                      }
                      const useAsset = row.asset || '';
                      const amount = row.amount || '';
                      const assetDec = row.assetDec || '';
                      let useAmount = '';
                      if (amount && assetDec) {
                        useAmount = formatUnits(amount.toString(), assetDec);
                      }
                      const debt = row.minted || '';
                      let useDebt = '';
                      if (debt) {
                        useDebt = formatEther(debt.toString());
                      }
                      const totalCollateralValue = row.totalCollateralValue;
                      let useTotalCollateralValue = '';
                      if (totalCollateralValue) {
                        useTotalCollateralValue = Number(formatEther(totalCollateralValue)).toFixed(2);
                      }
                      const txHash = row.transactionHash || '';

                      const useGraphId = row.id || '';

                      const modalData = {
                        useGraphId,
                        useType,
                        showType,
                        useDate,
                        useDebt: useDebt.toString() || '',
                        useTotalCollateralValue: useTotalCollateralValue.toString() || '',
                        txHash,
                      }

                      return (
                        <tr
                          key={index}
                        >
                          <td width="120">
                            {showType || ''}
                          </td>
                          <td>
                            {useDate || ''}
                          </td>
                          <td>
                            {useDebt.toString()}
                          </td>
                          <td>
                            {useTotalCollateralValue.toString()}
                          </td>
                          <td className="text-right">
                            <Button
                              // onClick={() => handleEtherscanLink(txHash)}
                              onClick={() => handleOpenModal(modalData)}
                              color="ghost"
                              disabled={!txHash}
                            >
                              View More
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
      <GraphHistoryModal
        isOpen={open}
        handleCloseModal={() => handleCloseModal()}
        historyItem={historyItem}
        handleEtherscanLink={handleEtherscanLink}
        currentPage={currentPage}
        vaultAddress={vaultAddress}
      />
    </div>
  )
};

export default HistoryGraph;