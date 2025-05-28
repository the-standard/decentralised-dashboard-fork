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
  useStakingPoolv2AbiStore,
  useStakingPoolv2AddressStore,
} from "../../store/Store";

import { useInactivityControl } from '../../components/InactivityControl';

import StakingAssets from "../../components/staking-pool/StakingAssets";
import StakingRewards from "../../components/staking-pool/StakingRewards";

import Card from "../../components/ui/Card";
import CenterLoader from "../../components/ui/CenterLoader";

const StakingPool = (props) => {
  const { stakingPoolv2Abi } = useStakingPoolv2AbiStore();
  const [showValue, setShowValue] = useState(false);
  const { isActive } = useInactivityControl();

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
    enabled: isActive,
  });

  const { data: poolRewards, isLoading: poolRewardsLoading, refetch: refetchRewards } = useReadContract({
    address: stakingPoolv2Address,
    abi: stakingPoolv2Abi,
    functionName: "projectedEarnings",
    args: [address],
    enabled: isActive,
  });

  const { data: dailyYield, refetch: refetchDailyReward } = useReadContract({
    address: stakingPoolv2Address,
    abi: stakingPoolv2Abi,
    functionName: "dailyYield",
    args: [],
    enabled: isActive,
  });

  useWatchBlockNumber({
    enabled: isActive,
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
    <main className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
  );
};

export default StakingPool;