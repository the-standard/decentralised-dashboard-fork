import moment from 'moment';
import {
  useReadContract,
  useAccount,
  useChainId,
  useWatchBlockNumber
} from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";

import {
  useStakingPoolv2AbiStore,
  useStakingPoolv2AddressStore,
} from "../../../store/Store";

import StakingIncrease from "./StakingIncrease";
import StakingAssets from "./StakingAssets";
import StakingRewards from "./StakingRewards";

import Select from "../../ui/Select";
import Card from "../../ui/Card";
import Typography from "../../ui/Typography";
import CenterLoader from "../../ui/CenterLoader";

const PoolV2 = (props) => {
  const { setActiveView, activeView } = props;
  const { stakingPoolv2Abi } = useStakingPoolv2AbiStore();

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
    <main className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div>
        <StakingIncrease />
      </div>

      <div className="order-first md:order-[unset]">
        <Card className="card-compact">
          <div className="card-body">
            <Typography variant="h2" className="card-title">
              Liquidity Pool Version
            </Typography>
            <Typography
              variant="p"
              className="mb-4"
            >
              Here you can select the pool version you want. Our latest versions contain the most up to date features to help you compound your rewards & more.
            </Typography>
            <Select
              value={activeView || ''}
              label="Pool Version"
              handleChange={setActiveView}
              optName="name"
              optValue="value"
              options={[
                {
                  name: 'Version 2',
                  value: 'V2',
                },
                {
                  name: 'Version 1',
                  value: 'V1',
                },
              ]}
              className="w-full mb-4"
            >
            </Select>
          </div>
        </Card>
      </div>

      <div>
        <StakingAssets positions={positions}/>
      </div>

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
    </main>
  );
};

export default PoolV2;