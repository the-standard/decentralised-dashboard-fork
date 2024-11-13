import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import {
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useMerklRewardsUSD,
} from "../../../store/Store";

import Typography from "../../ui/Typography";

const formatUSD = (value) => {
  if (value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(value));  
  }
};

const formatPercentage = (value) => {
  if (value) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }
};

const YieldSummaryMerkl = ({
  userSummary,
  merklRewards,
  merklRewardsLoading,
}) => {
  const chainId = useChainId();
  const { merklRewardsUSD, setMerklRewardsUSD } = useMerklRewardsUSD();
  const [priceData, setPriceData] = useState(undefined);
  const [priceDataLoading, setPriceDataLoading] = useState(true);

  const getPriceData = async () => {
    try {
      setPriceDataLoading(true);
      const response = await axios.get(
        "https://smart-vault-api.thestandard.io/asset_prices"
      );
      const chainData =
        chainId === arbitrumSepolia.id
          ? response.data.arbitrum_sepolia
          : response.data.arbitrum;
      setPriceData(chainData);
      setPriceDataLoading(false);
    } catch (error) {
      console.log(error);
      setPriceDataLoading(false);
    }
  };

  useEffect(() => {
    getPriceData();
  }, []);

  const handleDailyPrices = () => {
    const prices = {};
    if (priceData) {
      for (const [token, tokenData] of Object.entries(priceData)) {
        if (tokenData.prices && tokenData.prices.length > 0) {
          const latestPrice = tokenData.prices[tokenData.prices.length - 1].price;
          // convert to dollar value
          prices[token] = parseFloat(latestPrice) / 100000000;
        }
      }  
    }
    return prices;
  }

  const latestPrices = handleDailyPrices();

  const merklWithPrices = merklRewards.map(reward => {
    const useAmount = ethers.formatUnits(reward.accumulated, reward.decimals);
    const price = latestPrices[reward.symbol] || 1; // Default to 1 for stablecoins
    const accumulatedUsd = parseFloat(useAmount) * price;
    return {
      ...reward,
      accumulatedFormatted: useAmount,
      accumulatedUsd: accumulatedUsd,
      price: price
    };
  })

  let totalUSD = 0;

  merklWithPrices.forEach(reward => {
    totalUSD += reward.accumulatedUsd;
  });

  useEffect(() => {
    setMerklRewardsUSD(totalUSD);
  }, [totalUSD]);

  return (
    <>
      <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
        <Typography variant="p">
          Lifetime Merkl Rewards
        </Typography>
        {merklRewardsLoading ? (
          <>
            <span className="loading loading-bars loading-md"></span>
          </>
        ) : (
          <>
            <Typography variant="p" className="text-end">
              {formatUSD(totalUSD)}
            </Typography>
          </>
        )}
      </div>
    </>
  )
};

export default YieldSummaryMerkl;