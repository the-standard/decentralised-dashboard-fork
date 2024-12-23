import { useState } from "react";
import moment from 'moment';

import { ethers } from "ethers";

import {
  Progress,
  Tooltip,
} from 'react-daisyui';

import {
  QuestionMarkCircleIcon,
  ShareIcon,
  TrophyIcon,
  ShieldCheckIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

import {
  useGuestShowcaseStore,
} from "../../store/Store";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Typography from "../ui/Typography";
import CenterLoader from "../ui/CenterLoader";

import StakingDecreaseModal from "./StakingDecreaseModal";
import StakingShareModal from "./StakingShareModal";

const tierIconClass = 'h-6 w-6';

const STATUS_TIERS = [
  {
    tier: 1,
    name: 'Protocol Hero',
    minAmount: 5000000,
    icon: <TrophyIcon className={`${tierIconClass} text-purple-600`}/>,
    gradient: 'from-rose-100 via-purple-100 to-indigo-100',
    description: 'Legendary protocol champion',
    iconColor: 'text-purple-600'
  },
  {
    tier: 2,
    name: 'Protocol Guardian',
    minAmount: 1000000,
    icon: <ShieldCheckIcon className={`${tierIconClass} text-violet-600`}/>,
    gradient: 'from-violet-50 to-purple-50',
    description: 'Elite guardian of protocol stability',
    iconColor: 'text-violet-600'
  },
  {
    tier: 3,
    name: 'Protocol Sentinel',
    minAmount: 500000,
    icon: <ShieldCheckIcon className={`${tierIconClass} text-indigo-600`}/>,
    gradient: 'from-indigo-50 to-violet-50',
    description: 'Sentinel of protocol security',
    iconColor: 'text-indigo-600'
  },
  {
    tier: 4,
    name: 'Protocol Custodian',
    minAmount: 250000,
    icon: <BookOpenIcon className={`${tierIconClass} text-blue-600`}/>,
    gradient: 'from-blue-50 to-indigo-50',
    description: 'Custodian of protocol growth',
    iconColor: 'text-blue-600'
  },
  {
    tier: 5,
    name: 'Master Staker',
    minAmount: 100000,
    icon: <ShieldCheckIcon className={`${tierIconClass} text-cyan-600`}/>,
    gradient: 'from-cyan-50 to-blue-50',
    description: 'Master of protocol operations',
    iconColor: 'text-cyan-600'
  },
  {
    tier: 6,
    name: 'Expert Staker',
    minAmount: 50000,
    icon: <ShieldCheckIcon className={`${tierIconClass} text-teal-600`}/>,
    gradient: 'from-teal-50 to-cyan-50',
    description: 'Expert protocol participant',
    iconColor: 'text-teal-600'
  },
  {
    tier: 7,
    name: 'Advanced Staker',
    minAmount: 25000,
    icon: <ShieldCheckIcon className={`${tierIconClass} text-emerald-600`}/>,
    gradient: 'from-emerald-50 to-teal-50',
    description: 'Advanced protocol supporter',
    iconColor: 'text-emerald-600'
  },
  {
    tier: 8,
    name: 'Seasoned Staker',
    minAmount: 10000,
    icon: <ShieldCheckIcon className={`${tierIconClass} text-green-600`}/>,
    gradient: 'from-green-50 to-emerald-50',
    description: 'Seasoned protocol backer',
    iconColor: 'text-green-600'
  },
  {
    tier: 9,
    name: 'Active Staker',
    minAmount: 5000,
    icon: <ShieldCheckIcon className={`${tierIconClass} text-lime-600`}/>,
    gradient: 'from-lime-50 to-green-50',
    description: 'Active protocol supporter',
    iconColor: 'text-lime-600'
  },
  {
    tier: 10,
    name: 'Protocol Supporter',
    minAmount: 1000,
    icon: <ShieldCheckIcon className={`${tierIconClass} text-yellow-600`}/>,
    gradient: 'from-yellow-50 to-lime-50',
    description: 'Dedicated protocol supporter',
    iconColor: 'text-yellow-600'
  },
  {
    tier: 11,
    name: 'Protocol Participant',
    minAmount: 0,
    icon: <ShieldCheckIcon className={`${tierIconClass} text-gray-600`}/>,
    gradient: 'from-gray-50 to-yellow-50',
    description: 'Protocol participant',
    iconColor: 'text-gray-600'
  }
];

const formatNumber = (number, decimals = 2) => {
  if (typeof number === 'string') number = parseFloat(number);
  return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
  }).format(number);
}

const formatUSD = (value) => {
  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
  });
  if (value >= 0) {
    return USDollar.format(Math.abs(value));  
  }
};

const StakingSummary = ({
  positions,
  rewardsData,
  stakedSince,
  rawStakedSince,
  latestPrices,
  tstGlobalBalance,
  tstGlobalBalanceLoading,
}) => {
  const {
    useShowcase,
  } = useGuestShowcaseStore();
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (!positions) {
    return (
      <Card className="card-compact">
        <div className="card-body">
          <CenterLoader />
        </div>
      </Card>
    )  
  }

  const tstAmount = positions[1] || 0;

  let noStaked = true;
  if (tstAmount > 0) {
    noStaked = false;
  }

  // formatted amount
  const stakedAmount = ethers.formatUnits(tstAmount.toString(), 18);

  let globalAmount = 0;

  if (tstGlobalBalance) {
    globalAmount = ethers.formatUnits(tstGlobalBalance.toString(), 18);
  }

  const poolShare = Number((stakedAmount / globalAmount) * 100).toFixed(8);

  const handleCloseModal = () => {
    setOpen(false)
  };

  const handleCloseShare = () => {
    setShareOpen(false)
  };


  const getCurrentTier = (stakedAmount) => {
    const currentTier = STATUS_TIERS.filter(function(tier) {
      const currentTier = tier.tier;
      const isLess = stakedAmount >= tier.minAmount;
      const hasLowerTier = STATUS_TIERS.some(lower => (
        (lower.tier > currentTier) && (stakedAmount <= lower.minAmount)
      ))
      return isLess && !hasLowerTier;
    })
    return currentTier[0];
  }

  const getNextTier = (stakedAmount) => {
    const currentTier = getCurrentTier(stakedAmount);
    const nextTier = STATUS_TIERS?.find((tier) => (
      tier.tier === currentTier.tier -1
    ));
    if (nextTier) {
      return nextTier;
    } else {
      return currentTier;
    }
  }

  function getDaysStaked() {
    let start = moment.unix((Number(rawStakedSince)));
    const today = moment();
    if (!rawStakedSince) {
      start = today;
    }
    const since = today.diff(start, 'days');
    return since;
  }

  const rewardsWithPrices = rewardsData.map(reward => {
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

  const totalValueUSD = rewardsWithPrices.reduce((sum, reward) => sum + reward.usdValue, 0) || 0;
  const totalRateUSD = rewardsWithPrices.reduce((sum, reward) => sum + reward.usdRate, 0) || 0;

  const daysStaked = getDaysStaked() || 0;
  let dailyEarnings = 0;
  if (daysStaked >= 1) {
    dailyEarnings = (totalRateUSD / daysStaked) || 0;
  }

  const monthlyProjection = (dailyEarnings * 30) || 0;

  const currentTier = getCurrentTier(stakedAmount);
  const nextTier = getNextTier(stakedAmount);

  let progress = 0;
  if (nextTier?.minAmount) {
    progress = (stakedAmount / nextTier.minAmount) * 100;
  }

  let progressPercentage = `${progress}%`;

  let tierRemaining = '0';
  if (nextTier && nextTier.minAmount) {
    tierRemaining = formatNumber(nextTier.minAmount - stakedAmount);
  }

  const lowestTier = STATUS_TIERS[STATUS_TIERS.length - 1];

  const shareText = `🏆 Yes! I made it to ${currentTier.name} on @TheStandard_io\n\n💫 Staking ${formatNumber(stakedAmount)} TST\n💰 Earning ${formatUSD(dailyEarnings)} daily\n⚡️ Supporting zero-interest borrowing\n\nJoin the future of DeFi!\nthestandard.io`;

  if (!rawStakedSince) {
    return (
      <Card className="card-compact w-full">
        <div className="card-body">
          <Typography variant="h2" className="card-title justify-between">
            TST Staking
          </Typography>
  
          <Typography variant="p">
            Participate in protocol governance
          </Typography>
  
          <div className="grid grid-cols-1 gap-4 mb-2">
            <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
              <div className="w-full">
                <Typography variant="p">
                  Total TST Staked
                </Typography>
                <Typography variant="h2">
                  0 TST
                </Typography>
              </div>
            </div>
            <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
              <div className="w-full">
                <Typography variant="p">
                  Your Pool Share
                  <Tooltip
                    className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                    position="top"
                    message="You receive 0% of all revenue generated by TheStandard protocol"
                  >
                    <QuestionMarkCircleIcon
                      className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                    />
                  </Tooltip>
                </Typography>
                <Typography variant="h2">
                  0%
                </Typography>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 gap-4 mb-2">
            <div className="bg-base-300/40 p-4 rounded-lg w-full">
              <div className="flex justify-between items-center mb-2">
                <Typography variant="p" className="font-bold">
                  Your Daily Earnings
                </Typography>
                <Typography variant="p" className={`text-end text-green-500`}>
                  {formatUSD(0)}
                </Typography>
              </div>
              <Typography variant="p">
                Earning {formatUSD(0)} monthly at current rates
              </Typography>
            </div>
          </div>
  
          <div className="bg-base-300/40 p-4 rounded-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full">
                  <i data-lucide="shield" className="h-6 w-6 text-emerald-500"></i>
                </div>
                <div>
                  <Typography variant="p">
                    Current Status
                  </Typography>
                  <Typography variant="h2">
                    Not Staked
                  </Typography>
                </div>
              </div>
              <div className="text-right">
                <Typography variant="p">
                  Total Value Accrued
                </Typography>
                <Typography variant="h2">
                  {formatUSD(totalValueUSD)}
                </Typography>
              </div>
            </div>
  
            <div>
              <Typography variant="p" className="flex justify-between mb-2">
                <span>Progress to {lowestTier?.name || 'next tier'}</span>
                <span>{progressPercentage}</span>
              </Typography>
              <Progress
                value={progress}
                max="100"
                color="success"
                className="h-2"
              />
              <Typography variant="p" className="mt-2">
                Deposit TST to start earning rewards
              </Typography>
            </div>
          </div>
          </div>
      </Card>
    )
  }

  return (
    <Card className="card-compact w-full">
      <div className="card-body">
        <Typography variant="h2" className="card-title justify-between">
          TST Staking
        </Typography>

        <Typography variant="p">
          Participate in protocol governance
        </Typography>

        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
            <div className="w-full">
              <Typography variant="p">
                Total TST Staked
              </Typography>
              <Tooltip
                className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                position="top"
                message={`${stakedAmount} TST`}
              >
                <Typography variant="h2">
                  {stakedAmount ? (
                    Number.parseFloat(Number(stakedAmount).toFixed(4))
                  ) : ('0')}
                  &nbsp;TST
                </Typography>
              </Tooltip>
            </div>
          </div>
          <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
            <div className="w-full">
              <Typography variant="p">
                Your Pool Share
                <Tooltip
                  className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                  position="top"
                  message={`You receive ${poolShare}% of all revenue generated by TheStandard protocol`}
                >
                  <QuestionMarkCircleIcon
                    className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                  />
                </Tooltip>
              </Typography>
              <Typography variant="h2">
                  {tstGlobalBalanceLoading ? (
                    <span className="loading loading-bars loading-xs"></span>
                  ) : (
                    <>
                      {poolShare || 0}%
                    </>
                  )}
              </Typography>
            </div>
          </div>

        </div>

        {daysStaked >= 1 ? (
          <div className="grid grid-cols-1 gap-2 mb-2">
            <div className="bg-base-300/40 p-4 rounded-lg w-full">
              <div className="flex justify-between items-center mb-2">
                <Typography variant="p" className="font-bold">
                  Your Daily Earnings
                </Typography>
                <Typography variant="p" className={`text-end text-green-500`}>
                  {formatUSD(dailyEarnings)}
                </Typography>
              </div>
              <Typography variant="p">
                Earning {formatUSD(monthlyProjection)} monthly at current rates
              </Typography>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 mb-2">
            <div className="bg-base-300/40 p-4 rounded-lg w-full">
              <div className="flex justify-between items-center mb-2">
                <Typography variant="p" className="font-bold">
                  Your Daily Earnings
                </Typography>
                <Typography variant="p" className={`text-end text-green-500`}>
                  {formatUSD(0)}
                </Typography>
              </div>
              <Typography variant="p">
                Rates will be calculated after the first 24 hours period passes
              </Typography>
            </div>
          </div>
        )}

        <div className="bg-emerald-400/20 p-4 rounded-lg w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-full">
                {currentTier?.icon}
              </div>
              <div>
                <Typography variant="p">
                  Current Status
                </Typography>
                <Typography variant="h2">
                  {currentTier.name || (
                    <span className="loading loading-bars loading-xs"></span>
                  )}
                </Typography>
                <Typography variant="p">
                  Staking since {stakedSince}
                </Typography>
              </div>
            </div>
            <div className="text-right">
              <Typography variant="p">
                Total Value Accrued
              </Typography>
              <Typography variant="h2">
                {formatUSD(totalValueUSD)}
              </Typography>
              <Typography variant="p">
                Current market prices
              </Typography>
            </div>
          </div>

          <div>
            <Typography variant="p" className="flex justify-between mb-2">
              <span>Progress to {nextTier?.name || 'next tier'}</span>
              <span>{progressPercentage}</span>
            </Typography>
            <Progress
              value={progress}
              max="100"
              color="success"
              className="h-2"
            />
            <Typography variant="p" className="mt-2">
              {currentTier?.tier == 1 ? (
                <>
                  You've staked {stakedAmount} TST!
                </>
              ) : (
                <>
                  Stake {tierRemaining} more TST to reach the next tier
                </>
              )}
            </Typography>
          </div>
        </div>

        <div className="card-actions pt-2 flex-col lg:flex-row">
          <Button
            color="success"
            onClick={() => setShareOpen(true)}
            disabled={useShowcase || noStaked}
            className="w-full flex-1"
          >
            <ShareIcon className="-ml-4 h-4 w-4 inline-block"/>
            Share My Status
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            disabled={useShowcase || noStaked}
            className="w-full flex-1"
          >
            Stop Staking TST
          </Button>
        </div>
        <StakingDecreaseModal
          tstAmount={tstAmount}
          handleCloseModal={handleCloseModal}
          isOpen={open}
        />
        <StakingShareModal
          handleCloseModal={handleCloseShare}
          isOpen={shareOpen}
          shareText={shareText}
        />
      </div>
    </Card>
  )
};

export default StakingSummary;
