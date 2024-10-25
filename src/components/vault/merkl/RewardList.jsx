import { useState, Fragment } from "react";
import { ethers } from "ethers";
import {
  Tooltip,
} from 'react-daisyui';

import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useChainId,
  useWatchBlockNumber,
} from "wagmi";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultStore,
  useErc20AbiStore,
  useVaultAddressStore,
} from "../../../store/Store";

import Button from "../../ui/Button";
import CenterLoader from "../../ui/CenterLoader";
import TokenIcon from "../../ui/TokenIcon";
import Typography from "../../ui/Typography";
import TokenActions from "./TokenActions";
import RewardItem from "./RewardItem";

const RewardList = ({
  merklRewards,
  merklRewardsLoading,
  vaultType,
}) => {
  const { vaultStore } = useVaultStore();
  const { erc20Abi } = useErc20AbiStore();
  const { vaultAddress } = useVaultAddressStore();

  const [actionType, setActionType] = useState();
  const [useAsset, setUseAsset] = useState();
  const [subRow, setSubRow] = useState('0sub');

  let currencySymbol = '';
  if (vaultType === 'EUROs') {
    currencySymbol = '€';
  }
  if (vaultType === 'USDs') {
    currencySymbol = '$';
  }

  const closeAction = () => {
    setActionType('');
  }

  const toggleSubRow = (index) => {
    const useRow = index + 'sub';

    if (subRow === useRow) {
      setSubRow('');
    } else {
      setSubRow(useRow);
    }
  }

  const vaultVersion = vaultStore?.status?.version || '';

  const { data: merklBalances, isLoading: merklBalancesLoading } = useReadContracts({
    contracts:merklRewards && merklRewards.length && merklRewards.map((item) =>({
      address: item.tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [vaultAddress],
    }))
  })

  const merklData = merklRewards && merklRewards.length && merklRewards.map((item, index) => {
    let useBalance = 0n;
    if (merklBalances) {
      if (merklBalances[index]) {
        if (merklBalances[index].result) {
          useBalance = rewardDecimals[index].result;
        }
        return {
          ...merklRewards[index],
          balanceOf: useBalance
        }    
      }
    }
  });

  return (
    <>
      <div>
        <Typography variant="h2" className="card-title flex gap-0">
          <QueueListIcon className="mr-2 h-6 w-6 inline-block"/>
          Merkl Reward Tokens
        </Typography>
        <table className="table table-fixed">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Balance</th>
              <th>Unclaimed</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          {merklRewardsLoading || merklBalancesLoading ? (null) : (
            <tbody>
              {merklData && merklData.length && merklData.map(function(asset, index) {
                const handleClick = (type, asset) => {
                  setActionType(type);
                  setUseAsset(asset);
                };

                return (
                  <RewardItem
                    vaultType={vaultType}
                    index={index}
                    asset={asset}
                    handleClick={handleClick}
                    toggleSubRow={toggleSubRow}
                    subRow={subRow}
                  />
                )}
              )}
            </tbody>
          )}
        </table>
        {merklRewardsLoading || merklBalancesLoading ? (
          <CenterLoader />
        ) : (null)}
      </div>
      <TokenActions
        actionType={actionType}
        useAsset={useAsset}
        closeModal={closeAction}
        vaultType={vaultType}         
      />
    </>
  );
};

export default RewardList;