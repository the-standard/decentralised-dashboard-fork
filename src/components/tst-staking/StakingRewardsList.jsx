import { useState, useEffect } from "react";
import { ethers } from "ethers";
import moment from 'moment';

import {
  useGuestShowcaseStore,
} from "../../store/Store";

import { formatNumber, formatCurrency } from '../ui/NumberUtils';

import TokenNormalise from "../ui/TokenNormalise";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Typography from "../ui/Typography";
import CenterLoader from "../ui/CenterLoader";

import ClaimingRewardsModal from "./ClaimingRewardsModal";

const StakingRewardsList = ({
  stakedSince,
  rawStakedSince,
  poolRewardsLoading,
  rewardData,
  latestPrices,
}) => {
  const {
    useShowcase,
  } = useGuestShowcaseStore();
  const [open, setOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isRewardReady, setIsRewardReady] = useState(false);

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
    const useRate = ethers.formatUnits(reward.dailyReward, reward.decimals);
    const price = latestPrices[reward.asset] || 1; // Default to 1 for stablecoins
    const usdValue = parseFloat(useAmount) * price;
    const usdRate = parseFloat(useRate) * price;
    return {
      ...reward,
      usdValue: usdValue,
      usdRate: usdRate,
      price: price
    };
  })
  const rows = rewardsWithPrices || [];

  let noRewards = true;
  if (rows.some(e => e.amount > 0)) {
    noRewards = false;
  }

  const calculateNextRewardTime = (rawStakedSince) => {
    const now = moment();
    const stakingStart = moment.unix((Number(rawStakedSince)));
    
    const hoursSinceStaking = now.diff(stakingStart, 'hours');
    const completedPeriods = Math.floor(hoursSinceStaking / 24);
    
    const nextRewardTime = stakingStart.clone().add((completedPeriods + 1) * 24, 'hours');
    
    return nextRewardTime;
  };

  const formatCountdown = (duration) => {
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const updateCountdown = () => {
    const nextRewardTime = calculateNextRewardTime(rawStakedSince);
    const now = moment();
    const duration = moment.duration(nextRewardTime.diff(now));
    
    if (duration.asMilliseconds() <= 0) {
      setIsRewardReady(true);
      setTimeRemaining(formatCountdown(moment.duration(24, 'hours')));
    } else {
      setIsRewardReady(false);
      setTimeRemaining(formatCountdown(duration));
    }
  };

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [rawStakedSince]);

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
          {timeRemaining ? (
            <Typography variant="p">
              Next Reward In:
              <b> {timeRemaining}</b>
            </Typography>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Amount</th>
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
                  const rate = asset?.usdRate || 0;

                  return(
                    <tr key={index}>
                      <td>
                        {TokenNormalise(symbol)}
                      </td>
                      <td>
                        {formatNumber(ethers.formatUnits(amount, decimals), decimals)}
                        <br/>
                        <span className="opacity-50">
                          {formatCurrency('$', value, 8)}
                        </span>
                      </td>
                      <td>
                        {formatNumber(ethers.formatUnits(dailyReward, decimals), decimals)}
                        <br/>
                        <span className="opacity-50">
                          {formatCurrency('$', rate, 8)}
                        </span>
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
            disabled={useShowcase || noRewards}
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
