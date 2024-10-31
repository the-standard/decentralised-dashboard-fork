import { useState } from "react";

import LiquidationPools from '../liquidation-pools/LiquidationPools';
import StakingPool from '../staking-pool/StakingPool';

import Card from "../../components/ui/Card";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";

const LegacyPools = (props) => {
  const [ showPool, setShowPool ] = useState('STAKE-EUROSTST');

  return (
    <div>

      <Card className="card-compact mb-4">
        <div className="card-body overflow-x-scroll">
          <Typography variant="h2" className="card-title flex gap-0">
            Legacy Pools
          </Typography>

          <Typography variant="p">
            These pools have been depreciated and will no longer be generating new rewards.
          </Typography>

          <Typography variant="p">
            We recommend collecting any outstanding rewards and withdrawing your staked tokens.
          </Typography>

          <div className="flex flex-wrap mt-4 gap-4">
            <Button
              onClick={() => setShowPool('STAKE-EUROSTST')}
              variant="outline"
              active
            >
              EUROs & TST Staking
            </Button>
            <Button
              onClick={() => setShowPool('LIQUIDITY-POOL')}
              variant="outline"
            >
              Liquidity Pool
            </Button>
          </div>


        </div>
      </Card>

      <div>
        {showPool === 'STAKE-EUROSTST' ? (
          <StakingPool />
        ) : (null)}
        {showPool === 'LIQUIDITY-POOL' ? (
          <LiquidationPools />
        ) : (null)}
      </div>

    </div>
  );
};

export default LegacyPools;