import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Typography from "../../ui/Typography";
import TokenIcon from "../../ui/TokenIcon";

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
    const numValue = parseFloat(value.replace('%', ''));
    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;  
  }
};

const YieldPerformanceModal = ({
  isOpen,
  handleCloseModal,
  yieldPair,
  yieldQuantities,
  yieldHypervisor,
  gammaUser,
  gammaReturns,
  gammaStats,
  openClaim,
  gammaUserLoading,
  gammaReturnsLoading,
  gammaStatsLoading,
}) => {

  const positionUser = gammaUser?.[yieldHypervisor.toLowerCase()] || {};
  const positionStats = gammaStats?.find(item => item.hypervisor.toLowerCase() === yieldHypervisor.toLowerCase());
  const positionReturns = gammaReturns?.find((item) => item.hypervisor.toLowerCase() === yieldHypervisor.toLowerCase());

  const initialUSD = positionUser?.returns?.initialTokenUSD || 0;
  const initialTokenCurrentUSD = positionUser?.returns?.initialTokenCurrentUSD || 0;
  const currentUSD = positionUser?.returns?.currentUSD || 0;
  const hypervisorReturnsUSD = positionUser?.returns?.hypervisorReturnsUSD;
  const hypervisorReturnsPercentage = positionUser?.returns?.hypervisorReturnsPercentage;
  const netMarketReturnsUSD = positionUser?.returns?.netMarketReturnsUSD;
  const netMarketReturnsPercentage = positionUser?.returns?.netMarketReturnsPercentage;
  const tvlUSD = Number(positionStats?.tvlUSD) || 0;

  let showApy = '0';
  if (positionReturns?.feeApy) {
    showApy = Number(positionReturns?.feeApy * 100).toFixed(2);
  }

  const getMarketContext = () => {
    const marketReturn = parseFloat(netMarketReturnsPercentage);
    if (marketReturn > 0) {
      return {
        description: `Market movement has generated ${formatUSD(netMarketReturnsUSD)}`,
        colorClass: "text-green-600",
        message: `(+${Math.abs(marketReturn).toFixed(2)}%) in gains from holding these assets`
      };
    } else {
      return {
        description: `Market movement would have resulted in a ${formatUSD(netMarketReturnsUSD)} loss`,
        colorClass: "text-red-600",
        message: `(${marketReturn.toFixed(2)}%) from simply holding these assets`
      };
    }
  };

  const getStrategyContext = () => {
    const strategyReturn = parseFloat(hypervisorReturnsPercentage);
    if (strategyReturn > 0.5) {
      return {
        title: "Yield Pool Performance",
        colorClass: "text-green-600",
        description: `Generated ${formatUSD(hypervisorReturnsUSD)} in additional value`,
        message: `(+${strategyReturn.toFixed(2)}%) through TheStandard's advanced yield strategies`
      };
    } else if (strategyReturn > 0) {
      return {
        title: "Yield Pool Performance",
        colorClass: "text-green-600",
        description: `Earned ${formatUSD(hypervisorReturnsUSD)} in trading fees`,
        message: `(+${strategyReturn.toFixed(2)}%) through automated yield generation`
      };
    } else {
      return {
        title: "Yield Pool Performance",
        colorClass: "text-amber-600",
        description: `Currently ${formatUSD(hypervisorReturnsUSD)} below market returns`,
        message: `(${strategyReturn.toFixed(2)}%) while building trading fee reserves`
      };
    }
  };
  const getAnalysisMessage = () => {
    const marketReturn = parseFloat(netMarketReturnsPercentage);
    const strategyReturn = parseFloat(hypervisorReturnsPercentage);
    
    if (marketReturn > 0 && strategyReturn > 0) {
      return `Your position has gained ${formatUSD(netMarketReturnsUSD)} (${formatPercentage(netMarketReturnsPercentage)}) from market movement, plus an additional ${formatUSD(hypervisorReturnsUSD)} (${formatPercentage(hypervisorReturnsPercentage)}) through TheStandard's yield generation strategy.`;
    } else if (marketReturn > 0 && strategyReturn <= 0) {
      return `While the market has moved up ${formatUSD(netMarketReturnsUSD)} (${formatPercentage(netMarketReturnsPercentage)}), your position is temporarily ${formatUSD(hypervisorReturnsUSD)} (${formatPercentage(hypervisorReturnsPercentage)}) below holding returns while accumulating trading fees in TheStandard's yield pools.`;
    } else if (marketReturn <= 0 && strategyReturn > 0) {
      return `Despite a market decline of ${formatUSD(netMarketReturnsUSD)} (${formatPercentage(netMarketReturnsPercentage)}), TheStandard's yield strategy has generated ${formatUSD(hypervisorReturnsUSD)} (${formatPercentage(hypervisorReturnsPercentage)}) in additional returns through effective fee collection.`;
    } else {
      return `While the market decline of ${formatUSD(netMarketReturnsUSD)} (${formatPercentage(netMarketReturnsPercentage)}) has impacted overall value, TheStandard's yield pools have limited additional impact to just ${formatUSD(hypervisorReturnsUSD)} (${formatPercentage(hypervisorReturnsPercentage)}) through active fee generation.`;
    }
  };
  const marketContext = getMarketContext();
  const strategyContext = getStrategyContext();

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          handleCloseModal();
        }}
        closeModal={() => {
          handleCloseModal();
        }}
        wide={false}
      >
        <>
          <div>
            <Typography variant="h2" className="card-title">
              <div className="flex items-center">
                <TokenIcon
                  symbol={yieldPair[0] || ''}
                  className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                />
                <TokenIcon
                  symbol={yieldPair[1] || ''}
                  className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                />
              </div>

              {yieldPair[0] || ''}/{yieldPair[1] || ''} Yield Pool
            </Typography>
          </div>
          <div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-base-300/40 p-4 rounded-lg w-full">
                <Typography variant="p">
                  TVL
                </Typography>
                {gammaStatsLoading ? (
                  <>
                    <span className="loading loading-bars loading-md"></span>
                  </>
                ) : (
                  <>
                    <Typography variant="h1" className="font-bold">
                      ${tvlUSD?.toFixed(2) || ''}
                    </Typography>
                  </>
                )}
              </div>
              <div className="bg-base-300/40 p-4 rounded-lg w-full">
                <Typography variant="p">
                  APY
                </Typography>
                {gammaReturnsLoading ? (
                  <>
                    <span className="loading loading-bars loading-md"></span>
                  </>
                ) : (
                  <>
                    <Typography variant="h1" className="font-bold">
                      {showApy || ''}%
                    </Typography>
                  </>
                )}
              </div>
              <div className="bg-base-300/40 p-4 rounded-lg w-full">
                <Typography variant="p">
                  Initial Deposit
                </Typography>
                <Typography variant="h1" className="font-bold">
                  ${initialUSD?.toFixed(2) || ''}
                </Typography>
              </div>
              <div className="bg-base-300/40 p-4 rounded-lg w-full">
                <Typography variant="p">
                  Current Value
                </Typography>
                <Typography variant="h1" className="font-bold flex items-center">
                  <span className="text-sm inline-block font-normal">~</span>${currentUSD?.toFixed(2) || ''}
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="bg-base-300/40 p-4 rounded-lg w-full">
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="p" className="font-bold">
                    Market Impact
                  </Typography>
                  <Typography variant="p" className={`text-end ${marketContext.colorClass}`}>
                    {formatPercentage(netMarketReturnsPercentage)}
                  </Typography>
                </div>
                <Typography variant="p">
                  {marketContext.description}{' '}
                  <span className={`font-medium ${marketContext.colorClass}`}>
                    {marketContext.message}
                  </span>
                </Typography>
              </div>
              <div className="bg-base-300/40 p-4 rounded-lg w-full">
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="p" className="font-bold">
                    {strategyContext.title}
                  </Typography>
                  <Typography variant="p" className={`text-end ${strategyContext.colorClass}`}>
                    {formatPercentage(hypervisorReturnsPercentage)}
                  </Typography>
                </div>
                <Typography variant="p">
                {strategyContext.description}{' '}
                  <span className={`font-medium ${strategyContext.colorClass}`}>
                    {strategyContext.message}
                  </span>
                </Typography>
              </div>
              <div className="bg-info/20 p-4 rounded-lg w-full">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <span className="text-blue-500 text-xl">💡</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium"><b>Position Analysis:</b> </span>
                    {getAnalysisMessage()}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-auto"
              variant="outline"
              onClick={handleCloseModal}
            >
              Return to Vault
            </Button>
            <Button
              className="w-full lg:w-64"
              variant="outline"
              onClick={() => openClaim()}
            >
              Stop Earning Yield
            </Button>
          </div>
        </>
      </Modal>
    </>
  )
};

export default YieldPerformanceModal;