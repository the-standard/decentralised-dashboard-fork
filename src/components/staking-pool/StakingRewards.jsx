import { useState } from "react";
import { ethers } from "ethers";
import {
  useReadContracts,
} from "wagmi";

import {
  useErc20AbiStore,
} from "../../store/Store";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Typography from "../ui/Typography";
import CenterLoader from "../ui/CenterLoader";

import ClaimingRewardsModal from "./ClaimingRewardsModal";

const StakingRewards = ({
  stakedSince,
  rewardRate,
  sEuroAmount,
  collaterals,
  poolRewardsLoading,
  sEuroDaily,
  collatDaily,
}) => {
  const [open, setOpen] = useState(false);
  const { erc20Abi } = useErc20AbiStore();

  if (poolRewardsLoading) {
    return (
      <Card className="card-compact">
        <div className="card-body">
          <CenterLoader />
        </div>
      </Card>
    )
  }

  const { data: rewardDecimals } = useReadContracts({
    contracts:collaterals.map((item) =>({
      address: item.token,
      abi: erc20Abi,
      functionName: "decimals",
      args: [],
    }))
  })

  const { data: rewardSymbols } = useReadContracts({
    contracts:collaterals.map((item) =>({
      address: item.token,
      abi: erc20Abi,
      functionName: "symbol",
      args: [],
    }))
  })

  const rewardData = collaterals?.map((item, index) => {
    const amount = item.amount;
    let decimals = 18;
    if (rewardDecimals) {
      if (rewardDecimals[index]) {
        if (rewardDecimals[index].result) {
          decimals = rewardDecimals[index].result;
        }
      }
    }
    let symbol = 'ETH';
    if (rewardSymbols) {
      if (rewardSymbols[index]) {
        if (rewardSymbols[index].result) {
          symbol = rewardSymbols[index].result;
        }
      }
    }
    let useDailyReward = 0n;

    const rewardItem = collatDaily?.find((reward) => reward.token === item.token);

    if (rewardItem && rewardItem.amount) {
      useDailyReward = rewardItem.amount;
    }

    return {
      key: index,
      asset: symbol,
      amount: amount,
      decimals: decimals,
      dailyReward: useDailyReward,
    }
  });

  const useRows = [
    {
      key: 'EUROs',
      asset: 'EUROs',
      amount: sEuroAmount,
      decimals: 18,
      dailyReward: sEuroDaily,
    },
    ...rewardData
  ]
  
  const handleCloseModal = () => {
    setOpen(false)
  };

  const rows = useRows || [];

  let noRewards = true;
  if (rows.some(e => e.amount > 0)) {
    noRewards = false;
  }

  return (
    <Card className="card-compact w-full">
      <div className="card-body">
        <Typography variant="h2" className="card-title justify-between">
          Projected Rewards
        </Typography>
        <div>
          <Typography variant="p">
            You can earn rewards every 24 hours after your staking period begins.
          </Typography>
          {stakedSince ? (
            <Typography variant="p">
              Staked Since:
              <b> {stakedSince}</b>
            </Typography>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Amount</th>
                <th>Daily Reward</th>
              </tr>
            </thead>
            {poolRewardsLoading ? (null) : (
              <tbody>
                {rows.map(function(asset, index) {
                  const amount = asset?.amount;
                  const decimals = asset?.decimals;
                  const symbol = asset?.asset;
                  const dailyReward = asset?.dailyReward;

                  return(
                    <tr key={index}>
                      <td>
                        {symbol}
                      </td>
                      <td>
                        {ethers.formatUnits(amount, decimals)}
                      </td>
                      <td>
                        {ethers.formatUnits(dailyReward, decimals)}
                      </td>
                    </tr>
                  )}
                )}
              </tbody>
            )}
          </table>
          {poolRewardsLoading ? (
            <CenterLoader slim />
          ) : (null)}
        </div>

        <div className="card-actions flex flex-row justify-end">
          <Button
            color="primary"
            onClick={() => setOpen(true)}
            disabled={noRewards}
          >
            Claim
          </Button>
        </div>
        <ClaimingRewardsModal
          handleCloseModal={handleCloseModal}
          isOpen={open}
        />
      </div>
    </Card>
  )
};

export default StakingRewards;
