import { useState } from "react";
import { ethers } from "ethers";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Typography from "../ui/Typography";
import CenterLoader from "../ui/CenterLoader";

import ClaimingRewardsModal from "./ClaimingRewardsModal";

const formatUSD = (value) => {
  if (value >= 0) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(value));  
  }
};

const StakingRewardsList = ({
  stakedSince,
  poolRewardsLoading,
  rewardData,
  latestPrices,
}) => {
  const [open, setOpen] = useState(false);

  if (poolRewardsLoading) {
    return (
      <Card className="card-compact">
        <div className="card-body">
          <CenterLoader />
        </div>
      </Card>
    )
  }

  const handleCloseModal = () => {
    setOpen(false)
  };

  const rewardsWithPrices = rewardData.map(reward => {
    const useAmount = ethers.formatUnits(reward.amount, reward.decimals);
    const price = latestPrices[reward.asset] || 1; // Default to 1 for stablecoins
    const usdValue = parseFloat(useAmount) * price;
    return {
      ...reward,
      usdValue: usdValue,
      price: price
    };
  })

  const rows = rewardsWithPrices || [];

  let noRewards = true;
  if (rows.some(e => e.amount > 0)) {
    noRewards = false;
  }


  return (
    <Card className="card-compact w-full">
      <div className="card-body">
        <Typography variant="h2" className="card-title justify-between">
          Your Claimable Staking Rewards
        </Typography>
        <div>
          <Typography variant="p" className="mb-2">
            You can earn rewards every 24 hours after your staking period begins.
          </Typography>
          <Typography variant="p" className="mb-2">
            Your reward rates are based on a the number of tokens you have staked.
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
                <th>Value (USD)</th>
                <th>Daily Rate Per TST</th>
              </tr>
            </thead>
            {poolRewardsLoading ? (null) : (
              <tbody>
                {rows.map(function(asset, index) {
                  const amount = asset?.amount || 0n;
                  const decimals = asset?.decimals;
                  const symbol = asset?.asset;
                  const dailyReward = asset?.dailyReward || 0n;
                  const value = asset?.usdValue || 0;

                  return(
                    <tr key={index}>
                      <td>
                        {symbol}
                      </td>
                      <td>
                        {ethers.formatUnits(amount, decimals)}
                      </td>
                      <td>
                        {formatUSD(value)}
                      </td>
                      <td className="whitespace-nowrap">
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

        <div className="card-actions pt-2 flex flex-row justify-end">
          <Button
            color="primary"
            onClick={() => setOpen(true)}
            disabled={noRewards}
            className="w-full lg:w-1/2"
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

export default StakingRewardsList;