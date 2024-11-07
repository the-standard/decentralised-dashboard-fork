import Typography from "../../ui/Typography";

import {
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

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

const YieldSummary = ({
  gammaUserLoading,
  userSummary
}) => {


  let positions = [];

  if (userSummary && userSummary.hypervisors && userSummary.hypervisors.length) {
    positions = userSummary.hypervisors;
  }

  const calculateMetrics = (positions) => {
    let totalBalance = 0;
    let totalYieldEarned = 0;
    let totalMarketYield = 0;
    let weightedYieldSum = 0;
    let weightedMarketYieldSum = 0;

    // First pass - calculate totals
    positions.forEach(position => {
      totalBalance += position.currentUSD;
      totalYieldEarned += position.hypervisorReturnsUSD;
      totalMarketYield += position.netMarketReturnsUSD;
    });

    // Second pass - calculate weighted percentages
    positions.forEach(position => {
      const weight = position.currentUSD / totalBalance;
      weightedYieldSum += (parseFloat(position.hypervisorReturnsPercentage) * weight);
      weightedMarketYieldSum += (parseFloat(position.netMarketReturnsPercentage) * weight);
    });

    return {
      totalBalance,
      totalYieldEarned,
      totalMarketYield,
      weightedAverageYieldAPY: weightedYieldSum,
      weightedAverageMarketAPY: weightedMarketYieldSum
    };
  };

  const getPerformanceMessage = (yieldEarned, marketYield) => {
    if (yieldEarned > 0 && yieldEarned > marketYield) {
      return "Your assets are earning additional yield through TheStandard's smart pools! 🎉";
    } else if (yieldEarned > 0) {
      return "Steadily earning yields while protecting your assets 📈";
    } else if (yieldEarned > marketYield) {
      return "TheStandard's yield pools are helping protect your assets during market movement";
    } else {
      return "Building trading fees to optimize your returns 🔄";
    }
  };

  const getAnalysisMessage = (metrics) => {
    const {
      totalYieldEarned,
      totalMarketYield,
      weightedAverageYieldAPY,
      weightedAverageMarketAPY,
      totalBalance
    } = metrics;

    // Market is up, strategy outperforming
    if (totalMarketYield > 0 && totalYieldEarned > totalMarketYield) {
      return (
        <span>
          Your {formatUSD(totalBalance)} position has gained {formatUSD(totalMarketYield)} ({formatPercentage(weightedAverageMarketAPY)}) from market movement, plus an additional {formatUSD(totalYieldEarned - totalMarketYield)} through TheStandard's yield generation, bringing your total gains to {formatUSD(totalYieldEarned)} ({formatPercentage(weightedAverageYieldAPY)}).
        </span>
      );
    }
    
    // Market is up, strategy underperforming but positive
    if (totalMarketYield > 0 && totalYieldEarned > 0) {
      return (
        <span>
          While the market has moved up {formatUSD(totalMarketYield)} ({formatPercentage(weightedAverageMarketAPY)}), your position has generated {formatUSD(totalYieldEarned)} ({formatPercentage(weightedAverageYieldAPY)}) in yields as TheStandard's pools continue accumulating trading fees. This difference typically balances out over time as more fees are collected.
        </span>
      );
    }
    
    // Market is down, strategy positive
    if (totalMarketYield < 0 && totalYieldEarned > 0) {
      return (
        <span>
          Despite a market decline that would have resulted in a {formatUSD(totalMarketYield)} loss ({formatPercentage(weightedAverageMarketAPY)}), TheStandard's yield strategy has generated {formatUSD(totalYieldEarned)} ({formatPercentage(weightedAverageYieldAPY)}) in positive returns through effective fee collection, helping protect your {formatUSD(totalBalance)} position.
        </span>
      );
    }
    
    // Market is down, strategy down but outperforming
    if (totalMarketYield < 0 && totalYieldEarned > totalMarketYield) {
      return (
        <span>
          During this market downturn that would have resulted in a {formatUSD(totalMarketYield)} loss ({formatPercentage(weightedAverageMarketAPY)}), TheStandard's yield pools have significantly reduced the impact to just {formatUSD(totalYieldEarned)} ({formatPercentage(weightedAverageYieldAPY)}) through active fee generation, protecting your {formatUSD(totalBalance)} position from {formatUSD(totalMarketYield - totalYieldEarned)} in additional losses.
        </span>
      );
    }
    
    // Market is neutral/down, strategy building
    return (
      <span>
        Your {formatUSD(totalBalance)} position is actively accumulating trading fees in TheStandard's yield pools. While the market impact is {formatUSD(totalMarketYield)} ({formatPercentage(weightedAverageMarketAPY)}), the strategy is building reserves through trading fees, currently at {formatUSD(totalYieldEarned)} ({formatPercentage(weightedAverageYieldAPY)}). This approach typically shows its strength over longer holding periods as fees accumulate.
      </span>
    );
  };

  const getYieldColor = (value) => value > 0 ? 'text-green-500' : 'text-amber-500';

  const metrics = calculateMetrics(positions);

  return (
    <>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <Typography variant="h2" className="card-title flex gap-0">
            <PresentationChartLineIcon
              className="mr-2 h-6 w-6 inline-block"
            />
            Yield Pool Summary
          </Typography>
          <Typography variant="p">
            {getPerformanceMessage(metrics.totalYieldEarned, metrics.totalMarketYield)}
          </Typography>
        </div>
        <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
          <div className="w-full">
            <Typography variant="p">
              Market Movement
            </Typography>
            <Typography variant="p" className="opacity-40">
              If held without yield pools
            </Typography>
          </div>
          <div className="w-full">
            {gammaUserLoading ? (
              <>
                <span class="loading loading-bars loading-md"></span>
              </>
            ) : (
              <>
                <Typography
                  variant="p"
                  className={`text-end ${metrics.totalMarketYield >= 0 ? 'text-green-500' : 'text-red-400'}`}
                >
                  {formatUSD(metrics.totalMarketYield)}
                </Typography>
                <Typography
                  variant="p"
                  className={`text-end ${metrics.totalMarketYield >= 0 ? 'text-green-500' : 'text-red-400'}`}
                >
                  {formatPercentage(metrics.weightedAverageMarketAPY)}
                </Typography>
              </>
            )}
          </div>
        </div>
        <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
          <Typography variant="p">
            Yield Generated
          </Typography>
          <div>
            {gammaUserLoading ? (
              <>
                <span class="loading loading-bars loading-md"></span>
              </>
            ) : (
              <>
                <Typography
                  variant="p"
                  className={`text-end ${getYieldColor(metrics.totalYieldEarned)}`}
                >
                  {formatUSD(metrics.totalYieldEarned)}
                </Typography>
                <Typography
                  variant="p"
                  className={`text-end ${getYieldColor(metrics.weightedAverageYieldAPY)}`}
                >
                  {formatPercentage(metrics.weightedAverageYieldAPY)} APY
                </Typography>
              </>
            )}
          </div>
        </div>
        <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
          <Typography variant="p">
            Assets in Yield Pools
          </Typography>
          {gammaUserLoading ? (
            <>
              <span class="loading loading-bars loading-md"></span>
            </>
          ) : (
            <>
              <Typography variant="p" className="text-end">
                {formatUSD(metrics.totalBalance)}
              </Typography>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="bg-info/20 p-4 rounded-lg w-full">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <span className="text-blue-500 text-xl">💡</span>
            </div>
            <div className="text-sm">
              <span className="font-medium"><b>Position Analysis:</b> </span>
              {getAnalysisMessage(metrics)}
            </div>
          </div>
        </div>
      </div>

    </>
  )
};

export default YieldSummary;