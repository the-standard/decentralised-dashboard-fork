import { useEffect, useState, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useReadContract,
  useChainId,
  useWatchBlockNumber,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import moment from 'moment';
import axios from "axios";

import {
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useContractAddressStore,
  useVaultManagerAbiStore,
} from "../../store/Store";

import CenterLoader from "../../components/ui/CenterLoader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Typography from "../../components/ui/Typography";

const VaultSavings = () => {
  const chainId = useChainId();
  const { arbitrumSepoliaContractAddress, arbitrumContractAddress } = useContractAddressStore();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const { vaultType, vaultId } = useParams();
  const navigate = useNavigate();

  const [savingsLoading, setSavingsLoading] = useState(true);
  const [savingsData, setSavingsData] = useState(undefined);
  const [vaultsLoading, setVaultsLoading] = useState(true);

  const [subRow, setSubRow] = useState('0sub');

  const toggleSubRow = (index) => {
    const useRow = index + 'sub';

    if (subRow === useRow) {
      setSubRow('');
    } else {
      setSubRow(useRow);
    }
  }

  useEffect(() => {
    // fixes flashing "no vault found" on first load
    setVaultsLoading(true);
    setTimeout(() => {
      setVaultsLoading(false);
    }, 1000);
  }, []);

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

  useWatchBlockNumber({
    onBlockNumber() {
      refetch();
    },
  })

  const vaultManagerAddress = chainId === arbitrumSepolia.id ?
  arbitrumSepoliaContractAddress :
  arbitrumContractAddress;

  const { data: vaultData, refetch } = useReadContract({
    address: vaultManagerAddress,
    abi: vaultManagerAbi,
    functionName: "vaultData",
    args: [vaultId],
  });

  const currentVault = vaultData;

  useEffect(() => {
    if (currentVault && !vaultsLoading) {
      getSavingsData();
    }
  }, [currentVault, vaultsLoading]);

  if (vaultsLoading) {
    return (
      <div>
        <Card className="card-compact">
          <div className="card-body">
            {vaultNav()}
            <CenterLoader />
          </div>
        </Card>
        <Card className="card-compact mt-4">
          <div className="card-body">
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

  const getSavingsData = async () => {
    try {
      setSavingsLoading(true);
      const response = await axios.get(
        `https://smart-vault-api.thestandard.io/redemptions/${vaultAddress}`
      );
      const data = response.data;
      setSavingsData(data);
      setSavingsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (savingsLoading) {
    return (
      <div>
        <Card className="card-compact">
          <div className="card-body">
            {vaultNav()}
            <CenterLoader />
          </div>
        </Card>
        <Card className="card-compact mt-4">
          <div className="card-body">
            <Typography variant="h2" className="card-title">
              <BanknotesIcon className="mr-2 h-6 w-6 inline-block"/>
              Automatic Savings Summary
            </Typography>
            <CenterLoader />
          </div>
        </Card>
      </div>
    )
  }

  const totalSaved = savingsData?.reduce((sum, item) => {
    const itemSaved = Number(item.debtRepaid) - Number(item.amountUSD);
    return sum + itemSaved;
  }, 0);

  const numberOfSavings = savingsData?.length;

  return (
    <div>
      <Card className="card-compact">
        <div className="card-body">
          {vaultNav()}
          <div className="bg-emerald-400/20 p-4 rounded-lg w-full flex flex-col">
            <Typography variant="h2" className="card-title flex gap-0">
              <BanknotesIcon
                className="mr-2 h-6 w-6 inline-block"
              />
              Your Smart Vault Has Saved You ${totalSaved} Total!
            </Typography>
            <Typography variant="p" className="sm:mr-[100px]">
              {numberOfSavings} automatic savings events have been captured
            </Typography>
          </div>
        </div>
      </Card>
      <Card className="card-compact mt-4">
        <div className="card-body">
          <Typography variant="h2" className="card-title">
            <BanknotesIcon className="mr-2 h-6 w-6 inline-block"/>
            Automatic Savings Summary
          </Typography>
          {savingsData && savingsData.length ? (
            <>
              {savingsData.map(function(item, index) {
                const momentTs = moment.unix((Number(item.ts)));
                const showDate = momentTs.format('DD/MMM/YYYY, LTS') || '';
                const tokenSold = item.collateral;
                const amountSold = item.amount;
                const amountSoldUSD = item.amountUSD;
                const debtRepaid = item.debtRepaid;
                const amountSaved = Number(debtRepaid) - Number(amountSoldUSD);
                const showSaved = Number(amountSaved).toFixed(2);
                return (
                  <Fragment key={index}>
                    <div className="mt-4 rounded-lg w-full flex flex-col overflow-hidden">
                      <div
                        onClick={() => toggleSubRow(index)}
                        className="bg-base-300/40 cursor-pointer transition hover:brightness-125"
                      >
                        <div className="flex items-center justify-between p-4 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <CurrencyDollarIcon className="mr-2 h-6 w-6 inline-block"/>
                            <div>
                              <p className="font-medium">Saved ${showSaved || ''}</p>
                              <p className="text-sm opacity-50">{showDate || ''}</p>
                            </div>
                          </div>
                          <Button
                            shape="circle"
                            color="ghost"
                            onClick={() => toggleSubRow(index)}
                          >
                            {subRow === index + 'sub' ? (
                              <ChevronUpIcon className="w-6 h-6"/>
                            ) : (
                              <ChevronDownIcon className="w-6 h-6"/>
                            )}
                          </Button>
                        </div>
                      </div>
                      <div
                        className={subRow === index + 'sub' ? (
                          'glass-alt-bg w-full p-4 h-auto'
                        ) : (
                          'glass-alt-bg w-full hidden h-0'
                        )}
                      >
                        <div className="grid grid-cols-1 gap-4 mb-2">
                          <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center justify-between">
                            <div className="overflow-x-hidden text-wrap">
                              <p className="text-sm opacity-50">Debt Reduced By</p>
                              <p className="text-lg font-semibold truncate text-ellipsis text-wrap">{debtRepaid || ''} USDs</p>
                            </div>
                            <ArrowDownCircleIcon className="h-6 w-6 text-green-500"/>
                            <div className="overflow-x-hidden text-wrap text-end">
                              <p className="text-sm opacity-50">You Only Paid</p>
                              <p className="text-lg font-semibold t runcate text-ellipsis text-wrap">${Number(amountSoldUSD).toFixed(2) || ''}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                          <div className="bg-emerald-400/20 p-4 rounded-lg w-full flex items-center order-1">
                            <div className="overflow-x-hidden text-wrap">
                              <p className="text-sm opacity-80">Money Saved</p>
                              <p className="text-lg font-semibold truncate text-ellipsis text-wrap">{debtRepaid || ''} USDs</p>
                            </div>
                          </div>
                          <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center order-3 sm:order-2 col-span-2 sm:col-span-1">
                            <div className="overflow-x-hidden text-wrap">
                              <p className="text-sm opacity-80">Asset Sold</p>
                              <p className="text-lg font-semibold truncate text-ellipsis text-wrap">{amountSold || ''} {tokenSold || ''}</p>
                            </div>
                          </div>
                          <div className="bg-emerald-400/20 p-4 rounded-lg w-full flex items-center order-2 sm:order-3">
                            <div className="overflow-x-hidden text-wrap">
                              <p className="text-sm opacity-80">Discount Rate</p>
                              <p className="text-lg font-semibold truncate text-ellipsis text-wrap">{debtRepaid || ''} USDs</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                )}
              )}
            </>
          ) : (
            <>
              <div className="mt-4 rounded-lg w-full flex flex-col overflow-hidden">
                <div className="bg-base-300/20">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">No Savings Events Have Been Triggered</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    
    </div>
  )
};

export default VaultSavings;
