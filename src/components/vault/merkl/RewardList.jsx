import { useState } from "react";

import {
  useReadContracts,
  useWatchBlockNumber,
} from "wagmi";

import {
  QueueListIcon,
} from '@heroicons/react/24/outline';

import {
  Tooltip,
} from 'react-daisyui';

import {
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useErc20AbiStore,
  useVaultAddressStore,
  useGuestShowcaseStore,
  useMerklTSTStakeStage,
} from "../../../store/Store";

import Button from "../../ui/Button";
import CenterLoader from "../../ui/CenterLoader";
import Typography from "../../ui/Typography";
import TokenActions from "./TokenActions";
import RewardItem from "./RewardItem";
import ClaimModal from "./ClaimModal";

import TSTModal from "./TSTStake/TSTModal";

const RewardList = ({
  merklRewards,
  merklRewardsLoading,
  vaultType,
}) => {
  const {
    useShowcase,
    getMerklRewardsData,
  } = useGuestShowcaseStore();
  const { erc20Abi } = useErc20AbiStore();
  const { vaultAddress } = useVaultAddressStore();
  const { setMerklTSTStakeStage } = useMerklTSTStakeStage();

  const [claimAllOpen, setClaimAllOpen] = useState(false);
  const [stakeTSTOpen, setStakeTSTOpen] = useState(false);
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

  const handleCloseTSTStake = () => {
    setStakeTSTOpen(false);
    setMerklTSTStakeStage('CLAIM');
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

  let balanceOfContracts = [];
  if (merklRewards && merklRewards.length) {
    balanceOfContracts = merklRewards.map((item) =>({
      address: item?.tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [vaultAddress],
    }))
  }

  const {
    data: merklBalances,
    isLoading: merklBalancesLoading,
    refetch: refetchBalances,
  } = useReadContracts({
    contracts: balanceOfContracts
  })

  useWatchBlockNumber({
    onBlockNumber() {
      refetchBalances();
    },
  })

  console.log(123123, merklBalances)

  let merklData = [];
  if (merklRewards && merklRewards.length) {
    merklData = merklRewards.map((item, index) => {
      let useBalance = 0n;
      if (merklBalances) {
        if (merklBalances[index]) {
          if (merklBalances[index].result) {
            useBalance = merklBalances[index].result;
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
  }

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
              <th>
                Asset
              </th>
              <th>
                Current Balance
                <Tooltip
                  className="flex-col justify-center items-center cursor-pointer before:max-w-[20rem] whitespace-normal"
                  position="top"
                  message="Your current total claimed balance. Also includes any tokens you have stored as vault collateral."
                >
                  <QuestionMarkCircleIcon
                    className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                  />
                </Tooltip>
              </th>
              <th className="hidden md:table-cell">
                Lifetime Accumulated
                <Tooltip
                  className="flex-col justify-center items-center cursor-pointer before:max-w-[20rem] whitespace-normal"
                  position="top"
                  message="Your total earned tokens over the lifetime of your position. This includes unclaimed tokens and previously withdrawn tokens."
                >
                  <QuestionMarkCircleIcon
                    className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                  />
                </Tooltip>
              </th>
              <th className="table-cell md:hidden">&nbsp;</th>
              <th>
                Unclaimed
                <Tooltip
                  className="flex-col justify-center items-center cursor-pointer before:max-w-[20rem] whitespace-normal"
                  position="top"
                  message="Your current unclaimed rewards"
                >
                  <QuestionMarkCircleIcon
                    className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                  />
                </Tooltip>
              </th>
              <th>
                &nbsp;
              </th>
            </tr>
          </thead>
          {merklRewardsLoading || merklBalancesLoading ? (null) : (
            <tbody>
              {merklData && merklData.length ? (
                <>
                  {merklData.map(function(asset, index) {
                    const handleClick = (type, asset) => {
                      setUseAsset(asset);
                      if (asset && (asset.symbol === 'TST')) {
                        setStakeTSTOpen(true);
                      } else {
                        setActionType(type);
                      }
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
                    <td colSpan="5">
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

        {/* <div className="pt-4 flex flex-row justify-end">
          <Button
            className="w-full lg:w-64"
            variant="outline"
            disabled={useShowcase || !hasClaims || merklRewardsLoading || merklBalancesLoading}
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
        </div> */}
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
      <TSTModal
        open={stakeTSTOpen}
        closeModal={() => handleCloseTSTStake()}       
        useAssets={merklData}
        vaultType={vaultType}
        parentLoading={merklRewardsLoading || merklBalancesLoading}
        merklData={merklData} 
        getMerklRewardsData={getMerklRewardsData}
      />
    </>
  );
};

export default RewardList;