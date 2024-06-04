import { useState, useEffect } from "react";
import { 
  useReadContract,
  useAccount,
  useChainId,
  useWatchBlockNumber
} from "wagmi";
import axios from "axios";
import { arbitrumSepolia } from "wagmi/chains";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

import PoolV1 from "../../components/liquidation-pools/V1/PoolV1";
import PoolV2 from "../../components/liquidation-pools/V2/PoolV2";

import Staking from "../../components/liquidation-pools/Staking";
import StakedAssets from "../../components/liquidation-pools/StakedAssets";
import ClaimTokens from "../../components/liquidation-pools/ClaimTokens";
import VolumeChart from "../../components/liquidation-pools/VolumeChart";
import ValueChart from "../../components/liquidation-pools/ValueChart";
import Card from "../../components/ui/Card";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";

const LiquidationPools = () => {
  const [chartData, setChartData] = useState(undefined);
  const [showValue, setShowValue] = useState(false);
  const { liquidationPoolAbi } = useLiquidationPoolAbiStore();

  const [activeView, setActiveView] = useState(queryView);

  const handleSetActiveView = (e) => {
    setSearchParams(`v=${e.target.value}`);
  };

  useEffect(() => {
    setActiveView(queryView)
  }, [queryView]);

  if (activeView === 'V1') {
    return (
     <PoolV1 setActiveView={handleSetActiveView} activeView={activeView}/>
    )
  }

  const getChartData = async () => {
    try {
      const response = await axios.get(
        `https://smart-vault-api.thestandard.io/liquidation_pools/${address}`
      );
      setChartData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <main className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div>
        <Staking />
      </div>
      <div>
        <StakedAssets
          loading={isLoading}
          positions={positions || {}}
          pending={pending || {}}
        />
      </div>
      <div>
        <Card className="card-compact">
          <div className="card-body">
            <Typography variant="h2" className="card-title flex justify-between">
              {showValue ? (
                'Asset Value'
              ) : (
                'Asset Totals'
              )}
              <Button size="sm" color="ghost" onClick={() => setShowValue(!showValue)}>
                {showValue ? (
                  <>
                    <ArrowTrendingUpIcon className="h-4 w-4 inline-block"/>
                    Show Totals
                  </>
                ) : (
                  <>
                    <BanknotesIcon className="h-4 w-4 inline-block"/>
                    Show Values
                  </>
                )}
              </Button>
            </Typography>
            {showValue ? (
              <>
                <VolumeChart chartData={chartData || []} />
              </>
            ) : (
              <>
                <ValueChart chartData={chartData || []} />
              </>
            )}
          </div>
        </Card>
      </div>
      <div>
        <ClaimTokens
          loading={isLoading}
          rewards={rewards || []}
        />
      </div>
    </main>
  );
};

export default LiquidationPools;