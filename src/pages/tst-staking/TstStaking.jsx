import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import axios from "axios";
import {
  useReadContract,
  useAccount,
  useChainId,
  useWatchBlockNumber
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import {
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';

import {
  useStakingPoolv3AbiStore,
  useStakingPoolv3AddressStore,
} from "../../store/Store";

import StakingIncrease from "../../components/tst-staking/StakingIncrease";
import StakingRewards from "../../components/tst-staking/StakingRewards";

import Card from "../../components/ui/Card";
import CenterLoader from "../../components/ui/CenterLoader";
import Typography from "../../components/ui/Typography";

const TstStaking = (props) => {
  const { stakingPoolv3Abi } = useStakingPoolv3AbiStore();
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

  const { data: dailyYield, isLoading, dailyYieldLoading, refetch: refetchDailyReward } = useReadContract({
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
      <main className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
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

          <StakingIncrease />
        </div>

        <div>
          {poolRewardsLoading || dailyYieldLoading || priceDataLoading ? (
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
          ) : (
            <>
              <StakingRewards
                positions={positions}
                poolRewardsLoading={poolRewardsLoading}
                dailyYieldLoading={dailyYieldLoading}
                rewards={rewards}
                collaterals={collaterals}
                stakedSince={useStakedSince}
                rawStakedSince={stakedSince}
                collatDaily={collatDaily}
                priceData={priceData}
                priceDataLoading={priceDataLoading}
              />
            </>
          )}

        </div>
      </main>
    </>
  );
};

export default TstStaking;