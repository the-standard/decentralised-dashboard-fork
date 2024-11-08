import { useState } from "react";
import {
  useReadContracts,
} from "wagmi";

import {
  useErc20AbiStore,
} from "../../store/Store";

import Card from "../ui/Card";
import CenterLoader from "../ui/CenterLoader";

import StakingSummary from "./StakingSummary";
import StakingRewardsList from "./StakingRewardsList";

const StakingRewards = ({
  positions,
  poolRewardsLoading,
  dailyYieldLoading,
  rewards,
  collaterals,
  stakedSince,
  rawStakedSince,
  collatDaily,
  priceData,
  priceDataLoading,
}) => {
  const { erc20Abi } = useErc20AbiStore();

  if (poolRewardsLoading || dailyYieldLoading || priceDataLoading) {
    return (
      <>
        <Card className="card-compact mb-4">
          <div className="card-body">
            <CenterLoader />
          </div>
        </Card>
        <Card className="card-compact">
          <div className="card-body">
            <CenterLoader />
          </div>
        </Card>
      </>
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

  const handleDailyPrices = () => {
    const prices = {};
    for (const [token, tokenData] of Object.entries(priceData)) {
      if (tokenData.prices && tokenData.prices.length > 0) {
        const latestPrice = tokenData.prices[tokenData.prices.length - 1].price;
        // Convert price to USD considering decimals
        prices[token] = parseFloat(latestPrice) / 1000000;
      }
    }
    return prices;
  }

  const latestPrices = handleDailyPrices();

  return (
    <div className="grid gap-4 grid-cols-1">
      <StakingSummary
        positions={positions}
        poolRewardsLoading={poolRewardsLoading}
        dailyYieldLoading={dailyYieldLoading}
        rewards={rewards}
        rewardsData={rewardData}
        collaterals={collaterals}
        stakedSince={stakedSince}
        rawStakedSince={rawStakedSince}
        collatDaily={collatDaily}
        latestPrices={latestPrices}
      />
      <StakingRewardsList
        positions={positions}
        poolRewardsLoading={poolRewardsLoading}
        dailyYieldLoading={dailyYieldLoading}
        rewardData={rewardData}
        latestPrices={latestPrices}
      />
    </div>
  )
};

export default StakingRewards;
