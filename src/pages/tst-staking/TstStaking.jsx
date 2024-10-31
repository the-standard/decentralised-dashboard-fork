import { useState } from "react";
import moment from 'moment';
import {
  useReadContract,
  useAccount,
  useChainId,
  useWatchBlockNumber
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';

import {
  useStakingPoolv2AbiStore,
  useStakingPoolv2AddressStore,
} from "../../store/Store";

import StakingIncrease from "../../components/tst-staking/StakingIncrease";
import StakingAssets from "../../components/tst-staking/StakingAssets";
import StakingRewards from "../../components/tst-staking/StakingRewards";

import Card from "../../components/ui/Card";
import CenterLoader from "../../components/ui/CenterLoader";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";

const TstStaking = (props) => {
  const { stakingPoolv2Abi } = useStakingPoolv2AbiStore();
  const [showValue, setShowValue] = useState(false);

  const {
    arbitrumSepoliaStakingPoolv2Address,
    arbitrumStakingPoolv2Address,
  } = useStakingPoolv2AddressStore();

  const { address } = useAccount();
  const chainId = useChainId();

  const stakingPoolv2Address =
  chainId === arbitrumSepolia.id
    ? arbitrumSepoliaStakingPoolv2Address
    : arbitrumStakingPoolv2Address;

  const { data: poolPositions, refetch: refetchPositions } = useReadContract({
    address: stakingPoolv2Address,
    abi: stakingPoolv2Abi,
    functionName: "positions",
    args: [address],
  });

  const { data: poolRewards, isLoading: poolRewardsLoading, refetch: refetchRewards } = useReadContract({
    address: stakingPoolv2Address,
    abi: stakingPoolv2Abi,
    functionName: "projectedEarnings",
    args: [address],
  });

  const { data: dailyYield, refetch: refetchDailyReward } = useReadContract({
    address: stakingPoolv2Address,
    abi: stakingPoolv2Abi,
    functionName: "dailyYield",
    args: [],
  });

  useWatchBlockNumber({
    onBlockNumber() {
      refetchPositions();
      refetchRewards();
      refetchDailyReward();
    },
  })

  const positions = poolPositions;
  const rewards = poolRewards;
  const dailyRewards = dailyYield;


  let sEuroAmount = 0n;
  let collaterals = [];

  if (rewards && rewards[0]) {
    sEuroAmount = rewards[0] || 0n;
  }
  if (rewards && rewards[1]) {
    collaterals = rewards[1] || [];
  }

  let sEuroDaily = 0n;
  let collatDaily = [];

  if (dailyRewards && dailyRewards[0]) {
    sEuroDaily = dailyRewards[0] || 0n;
  }
  if (dailyRewards && dailyRewards[1]) {
    collatDaily = dailyRewards[1] || [];
  }

  let stakedSince = 0;
  if (positions && positions[0]) {
    stakedSince = positions[0] || 0;
  }

  let useStakedSince;
  if (stakedSince) {
    useStakedSince = moment.unix(Number(stakedSince)).format('Do MMM YYYY');
  }

  return (
    <>
      <Card className="card-compact mb-4">
        <div className="card-body overflow-x-scroll">
          <Typography variant="h2" className="card-title flex gap-0">
            <Square3Stack3DIcon className="mr-2 h-6 w-6 inline-block"/>
            Staking Pool
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

      <main className="grid gap-4 grid-cols-1 md:grid-cols-2">

        <div>
          <StakingIncrease />
        </div>

        <div>
          <StakingAssets positions={positions}/>
        </div>

        <div>
          {poolRewardsLoading ? (
            <Card className="card-compact">
              <div className="card-body">
                <CenterLoader />
              </div>
            </Card>
          ) : (
            <StakingRewards
              poolRewardsLoading={poolRewardsLoading}
              rewards={rewards}
              sEuroAmount={sEuroAmount}
              collaterals={collaterals}
              stakedSince={useStakedSince}
              sEuroDaily={sEuroDaily}
              collatDaily={collatDaily}
            />
          )}
        </div>

      </main>

    </>
  );
};

export default TstStaking;