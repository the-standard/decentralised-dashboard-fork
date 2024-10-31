import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  useStakingPoolv3AbiStore,
  useStakingPoolv3AddressStore,
} from "../../store/Store";

import StakingIncrease from "../../components/tst-staking/StakingIncrease";
import StakingAssets from "../../components/tst-staking/StakingAssets";
import StakingRewards from "../../components/tst-staking/StakingRewards";

import Card from "../../components/ui/Card";
import CenterLoader from "../../components/ui/CenterLoader";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";

const TstStaking = (props) => {
  const { stakingPoolv3Abi } = useStakingPoolv3AbiStore();
  const [showValue, setShowValue] = useState(false);
  const navigate = useNavigate();

  const {
    arbitrumSepoliaStakingPoolv3Address,
    arbitrumStakingPoolv3Address,
  } = useStakingPoolv3AddressStore();

  const { address } = useAccount();
  const chainId = useChainId();

  const stakingPoolv3Address =
  chainId === arbitrumSepolia.id
    ? arbitrumSepoliaStakingPoolv3Address
    : arbitrumStakingPoolv3Address;

  const { data: poolPositions, refetch: refetchPositions } = useReadContract({
    address: stakingPoolv3Address,
    abi: stakingPoolv3Abi,
    functionName: "positions",
    args: [address],
  });

  const { data: poolRewards, isLoading: poolRewardsLoading, refetch: refetchRewards } = useReadContract({
    address: stakingPoolv3Address,
    abi: stakingPoolv3Abi,
    functionName: "projectedEarnings",
    args: [address],
  });

  const { data: dailyYield, refetch: refetchDailyReward } = useReadContract({
    address: stakingPoolv3Address,
    abi: stakingPoolv3Abi,
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

  let collaterals = [];

  if (rewards) {
    collaterals = rewards || [];
  }

  let collatDaily = [];

  if (dailyRewards) {
    collatDaily = dailyRewards || [];
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
            Stake TST to earn USDs & more tokens daily.
          </Typography>

          <Typography variant="p">
            If you're looking for our previous staking pools, <span className="underline cursor-pointer" onClick={() => navigate("/legacy-pools")}>they can be found here</span>.
          </Typography>

        </div>
      </Card>

      <main className="grid gap-4 grid-cols-1 md:grid-cols-2">

        <div>
          <StakingIncrease />
          <div className="mt-4">
            <StakingAssets positions={positions}/>
          </div>
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
              collaterals={collaterals}
              stakedSince={useStakedSince}
              collatDaily={collatDaily}
            />
          )}

        </div>

      </main>

    </>
  );
};

export default TstStaking;