import { useState } from "react";

import {
  useReadContracts,
} from "wagmi";

import {
  QueueListIcon,
} from '@heroicons/react/24/outline';

import {
  useErc20AbiStore,
  useVaultAddressStore,
} from "../../../store/Store";

import Button from "../../ui/Button";
import CenterLoader from "../../ui/CenterLoader";
import Typography from "../../ui/Typography";
import TokenActions from "./TokenActions";
import RewardItem from "./RewardItem";
import ClaimModal from "./ClaimModal";

const RewardList = ({
  merklRewards,
  merklRewardsLoading,
  vaultType,
}) => {
  const { erc20Abi } = useErc20AbiStore();
  const { vaultAddress } = useVaultAddressStore();

  const [claimAllOpen, setClaimAllOpen] = useState(false);
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

  const { data: merklBalances, isLoading: merklBalancesLoading } = useReadContracts({
    contracts:merklRewards.map((item) =>({
      address: item?.tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [vaultAddress],
    }))
  })

  const merklData = merklRewards.map((item, index) => {
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
      } else {
        return {};
      }
    }
  });

  const hasClaims = merklData.find(item => item?.unclaimed > 0);

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
              {merklData && merklData.length ? (
                <>
                  {merklData.map(function(asset, index) {
                    const handleClick = (type, asset) => {
                      setActionType(type);
                      setUseAsset(asset);
                    };

                    return (
                      <RewardItem
                        key={index}
                        vaultType={vaultType}
                        index={index}
                        asset={asset}
                        handleClick={handleClick}
                        toggleSubRow={toggleSubRow}
                        subRow={subRow}
                      />
                    )}
                  )}
                </>
              ) : (
                <>
                  <tr className="glass-alt-bg w-full p-4 h-auto">
                    <td colSpan="4">
                      <b>No Rewards Earned Yet.</b>
                      <br/>
                      Start earning by placing your tokens into the yield pool.
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          )}
        </table>
        {merklRewardsLoading || merklBalancesLoading ? (
          <CenterLoader />
        ) : (null)}

        <div className="pt-4 flex flex-row justify-end">
          <Button
            className="w-full lg:w-64"
            variant="outline"
            disabled={!hasClaims || merklRewardsLoading || merklBalancesLoading}
            onClick={() => setClaimAllOpen(true)}
            loading={merklRewardsLoading || merklBalancesLoading}
            wide
          >
            {hasClaims ? (
              'Claim All Rewards'
            ) : (
              'No Rewards to Claim'
            )}
          </Button>
        </div>
      </div>
      <TokenActions
        actionType={actionType}
        useAsset={useAsset}
        closeModal={closeAction}
        vaultType={vaultType}     
      />
      <ClaimModal
        open={claimAllOpen}
        closeModal={() => setClaimAllOpen(false)}          
        useAssets={merklData}
        vaultType={vaultType}
        parentLoading={merklRewardsLoading || merklBalancesLoading}  
      />

    </>
  );
};

export default RewardList;