import {
  Box,
  Typography,
  CircularProgress
} from "@mui/material";
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
} from "../../../store/Store.jsx";

import Card from "../../Card";
import LiFiExchange from "../../LiFiExchange";
import StakingIncrease from "./StakingIncrease.jsx";
import StakingAssets from "./StakingAssets.jsx";
import StakingRewards from "./StakingRewards.js";

const StakingStake = () => {
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
    <div>
      <div
        sx={{
          height: "100%",
          width: "100%",
          display: { xs: "flex", md: "grid" },
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "1rem",
          flexDirection: "column",
        }}
      >
        <StakingIncrease />

        <StakingAssets positions={positions}/>

        {poolRewardsLoading ? (
          <Card
            sx={{
              padding: "1.5rem",
            }}
          >
            <div
            sx={{
              minHeight: "250px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
            >
              <CircularProgress size="4rem" />
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
        <Card
          sx={{
            padding: "1.5rem",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              margin: "0",
              marginBottom: "1rem",
              fontSize: {
                xs: "1.2rem",
                md: "1.5rem"
              }
            }}
            variant="h4"
          >
            Need TST or EUROs?
          </Typography>
          <Typography
            sx={{
              marginBottom: "1rem",
              fontSize: {
                xs: "1rem",
                md: "1.2rem",
              },
              opacity: "0.9",
              fontWeight: "300",
            }}
          >
            You can easily buy it here in our cross chain DEX.
          </Typography>
          <LiFiExchange
            toChain={arbitrum.id}
            fromChain={arbitrum.id}
            fromToken="0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
            toToken="0x643b34980e635719c15a2d4ce69571a258f940e9"
          />
        </Card>

      </div>
    </div>
  );
};

export default StakingStake;