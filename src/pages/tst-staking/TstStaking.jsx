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
  BellAlertIcon,
} from '@heroicons/react/24/outline';

import {
  useTstAddressStore,
  useErc20AbiStore,
  useStakingPoolv4AbiStore,
  useStakingPoolv4AddressStore,
  useGuestShowcaseStore,
} from "../../store/Store";

import StakingIncrease from "../../components/tst-staking/StakingIncrease";
import StakingRewards from "../../components/tst-staking/StakingRewards";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import CenterLoader from "../../components/ui/CenterLoader";
import Typography from "../../components/ui/Typography";

const TstStaking = (props) => {
  const { stakingPoolv4Abi } = useStakingPoolv4AbiStore();
  const { erc20Abi } = useErc20AbiStore();

  const {
    arbitrumSepoliaStakingPoolv4Address,
    arbitrumStakingPoolv4Address,
  } = useStakingPoolv4AddressStore();
  
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

  const stakingPoolv4Address =
  chainId === arbitrumSepolia.id
    ? arbitrumSepoliaStakingPoolv4Address
    : arbitrumStakingPoolv4Address;

  const { data: poolPositions, refetch: refetchPositions } = useReadContract({
    address: stakingPoolv4Address,
    abi: stakingPoolv4Abi,
    functionName: "positions",
    args: [accountAddress],
  });

  const { data: poolRewards, isLoading: poolRewardsLoading, refetch: refetchRewards } = useReadContract({
    address: stakingPoolv4Address,
    abi: stakingPoolv4Abi,
    functionName: "projectedEarnings",
    args: [accountAddress],
  });

  const { data: dailyYield, isLoading, dailyYieldLoading, refetch: refetchDailyReward } = useReadContract({
    address: stakingPoolv4Address,
    abi: stakingPoolv4Abi,
    functionName: "dailyYield",
    args: [],
  });

  const { data: tstGlobalBalance, isLoading: tstGlobalBalanceLoading, refetch: refetchTstGlobalBalance } = useReadContract({
    address: tstAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [stakingPoolv4Address],
  });

  useWatchBlockNumber({
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
      <main className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>

          <Card className="warn-card card-compact mb-4">
            <div className="card-body overflow-x-scroll">
              <Typography variant="h2" className="card-title flex gap-0">
                <BellAlertIcon className="mr-2 h-6 w-6 inline-block"/>
                New Staking Pool
              </Typography>

              <Typography variant="p">
                The new TST Staking Pool has been released, and all earnable fees have moved over to it.
              </Typography>

              <Typography variant="p">
                The previous Staking Pool is accessible within <span className="underline cursor-pointer" onClick={() => navigate("/legacy-pools")}>Legacy Pools</span>, so you can withdraw your staked assets & claim any outstanding rewards.
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
                tstGlobalBalance={tstGlobalBalance}
                tstGlobalBalanceLoading={tstGlobalBalanceLoading}
              />
            </>
          )}

          <div className="flex flex-row justify-end">
            <Button
              color="ghost"
              variant="outline"
              onClick={() => navigate("/legacy-pools")}
              disabled={useShowcase}
              className="w-full lg:w-auto mt-4"
            >
              View Legacy Pools
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default TstStaking;