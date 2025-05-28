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
  useTstAddressStore,
  useErc20AbiStore,
  useStakingPoolv3AbiStore,
  useStakingPoolv3AddressStore,
  useGuestShowcaseStore,
} from "../../store/Store";

import { useInactivityControl } from '../../components/InactivityControl';

import StakingIncrease from "../../components/tst-staking-v1/StakingIncrease";
import StakingRewards from "../../components/tst-staking-v1/StakingRewards";

import Card from "../../components/ui/Card";
import CenterLoader from "../../components/ui/CenterLoader";
import Typography from "../../components/ui/Typography";

const TstStaking = (props) => {
  const { stakingPoolv3Abi } = useStakingPoolv3AbiStore();
  const { erc20Abi } = useErc20AbiStore();
  const { isActive } = useInactivityControl();

  const {
    arbitrumSepoliaStakingPoolv3Address,
    arbitrumStakingPoolv3Address,
  } = useStakingPoolv3AddressStore();
  
  const {
    arbitrumTstAddress,
    arbitrumSepoliaTstAddress,
  } = useTstAddressStore();

  const navigate = useNavigate();
  // const { address } = useAccount();
  const {
    useWallet,
    useShowcase,
  } = useGuestShowcaseStore();
  const accountAddress = useWallet;

  const chainId = useChainId();

  const tstAddress = chainId === arbitrumSepolia.id ?
  arbitrumSepoliaTstAddress :
  arbitrumTstAddress;

  const stakingPoolv3Address =
  chainId === arbitrumSepolia.id
    ? arbitrumSepoliaStakingPoolv3Address
    : arbitrumStakingPoolv3Address;

  const { data: poolPositions, refetch: refetchPositions } = useReadContract({
    address: stakingPoolv3Address,
    abi: stakingPoolv3Abi,
    functionName: "positions",
    args: [accountAddress],
    enabled: isActive,
  });

  const { data: poolRewards, isLoading: poolRewardsLoading, refetch: refetchRewards } = useReadContract({
    address: stakingPoolv3Address,
    abi: stakingPoolv3Abi,
    functionName: "projectedEarnings",
    args: [accountAddress],
    enabled: isActive,
  });

  const { data: dailyYield, isLoading, dailyYieldLoading, refetch: refetchDailyReward } = useReadContract({
    address: stakingPoolv3Address,
    abi: stakingPoolv3Abi,
    functionName: "dailyYield",
    args: [],
    enabled: isActive,
  });

  const { data: tstGlobalBalance, isLoading: tstGlobalBalanceLoading, refetch: refetchTstGlobalBalance } = useReadContract({
    address: tstAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [stakingPoolv3Address],
    enabled: isActive,
  });

  useWatchBlockNumber({
    enabled: isActive,
    onBlockNumber() {
      refetchPositions();
      refetchRewards();
      refetchDailyReward();
      refetchTstGlobalBalance();
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
      <main className="grid gap-4 grid-cols-1">
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
                tstGlobalBalance={tstGlobalBalance}
                tstGlobalBalanceLoading={tstGlobalBalanceLoading}
              />
            </>
          )}

        </div>
      </main>
    </>
  );
};

export default TstStaking;