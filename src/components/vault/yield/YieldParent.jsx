import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReadContract,
  useWatchBlockNumber
} from "wagmi";
import axios from "axios";

import {
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useSmartVaultABIStore,
} from "../../../store/Store";

import YieldList from "./YieldList";
import YieldSummary from "./YieldSummary";

import Card from "../../ui/Card";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";

const YieldParent = (props) => {
  const { yieldEnabled } = props;
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();
  const [ gammaUser, setGammaUser ] = useState({});
  const [ gammaUserLoading, setGammaUserLoading ] = useState(false);
  const [ gammaUserErr, setGammaUserErr ] = useState(false);
  const [ gammaReturns, setGammaReturns ] = useState([]);
  const [ gammaReturnsLoading, setGammaReturnsLoading ] = useState(false);
  const [ gammaReturnsErr, setGammaReturnsErr ] = useState(false);
  const [ gammaStats, setGammaStats ] = useState([]);
  const [ gammaStatsLoading, setGammaStatsLoading ] = useState(false);
  const [ gammaStatsErr, setGammaStatsErr ] = useState(false);
  const [ merklRewards, setMerklRewards ] = useState([]);
  const [ merklRewardsLoading, setMerklRewardsLoading ] = useState(true);
  const [ merklRewardsErr, setMerklRewardsErr ] = useState(false);

  const [ userSummary, setUserSummary ] = useState([]);

  const navigate = useNavigate();

  const { data: yieldData, refetch: refetchYield, isPending } = useReadContract({
    abi: smartVaultABI,
    address: vaultAddress,
    functionName: "yieldAssets",
    args: [],
  });

  let hypervisorAddresses = [];
  if (yieldData && yieldData.length) {
    hypervisorAddresses = yieldData.map((item) => {
      return (item.hypervisor)
    })
  }

  useWatchBlockNumber({
    onBlockNumber() {
      refetchYield();
    },
  })

  useEffect(() => {
    if (yieldData && !isPending) {
      getGammaUserData();
      getGammaReturns();
      getGammaStats();
    }
  }, [yieldData, isPending]);

  useEffect(() => {
    getMerklRewardsData();
  }, [vaultAddress]);

  const getMerklRewardsData = async () => {  
    try {
      setMerklRewardsLoading(true);
      const response = await axios.get(
        `https://api.merkl.xyz/v3/userRewards?chainId=42161&proof=true&user=${vaultAddress}`
      );

      const useData = response?.data;

      const rewardsArray = [];

      Object.keys(useData).forEach(key => {
        const value = useData[key];
        const rewardItem = {
          tokenAddress: key,
          ... value
        }
        rewardsArray.push(rewardItem);
      });

      setMerklRewards(rewardsArray);
      setMerklRewardsLoading(false);
      setMerklRewardsErr(false);
    } catch (error) {
      setMerklRewardsLoading(false);
      setMerklRewardsErr(true);
      console.log(error);
    }
  };

  const getGammaUserData = async () => {  
    try {
      setGammaUserLoading(true);
      const response = await axios.get(
        `https://wire2.gamma.xyz/arbitrum/user/${vaultAddress}`
      );

      const useData = response?.data?.[vaultAddress.toLowerCase()];

      setGammaUser(useData);
      setGammaUserLoading(false);
      setGammaUserErr(false);
    } catch (error) {
      setGammaUserLoading(false);
      setGammaUserErr(true);
      console.log(error);
    }
  };

  const getGammaReturns = async () => {  
    try {
      setGammaReturnsLoading(true);
      const response = await axios.get(
        `https://wire2.gamma.xyz/arbitrum/hypervisors/feeReturns/daily`
      );

      const useResponse = response?.data;

      const hypervisorReturns = [];

      hypervisorAddresses && hypervisorAddresses.length && hypervisorAddresses.forEach((hyperaddress) => {
        const useReturns = useResponse?.[hyperaddress.toLowerCase()];
        hypervisorReturns.push({
          hypervisor: hyperaddress,
          ... useReturns,
        });
      });

      setGammaReturns(hypervisorReturns);
      setGammaReturnsLoading(false);
      setGammaReturnsErr(false);
    } catch (error) {
      setGammaReturnsLoading(false);
      setGammaReturnsErr(true);
      console.log(error);
    }
  };


  const getGammaStats = async () => {  
    try {
      setGammaStatsLoading(true);
      const response = await axios.get(
        `https://wire2.gamma.xyz/arbitrum/hypervisors/basicStats`
      );

      const useResponse = response?.data;

      const hypervisorStats = [];
      hypervisorAddresses.forEach((hyperaddress) => {
        const useStats = useResponse?.[hyperaddress.toLowerCase()];
        hypervisorStats.push({
          hypervisor: hyperaddress,
          ... useStats,
        });
      });

      setGammaStats(hypervisorStats);
      setGammaStatsLoading(false);
      setGammaStatsErr(false);
    } catch (error) {
      setGammaStatsLoading(false);
      setGammaStatsErr(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (yieldData && !isPending) {
      getUserHypervisorUSD();
    }
  }, [gammaUser]);

  const getUserHypervisorUSD = async () => {  
    const allUSD = [];
    const totalUSD = {
      initialTokenUSD: 0,
      currentUSD: 0,
      netMarketReturnsUSD: 0,
      netMarketReturnsPercentage: "0%",
      hypervisorReturnsUSD: 0,
      hypervisorReturnsPercentage: "0%",
    };

    hypervisorAddresses && hypervisorAddresses.length && hypervisorAddresses.forEach((hyperaddress) => {
      const useAddress = hyperaddress.toLowerCase();

      const userHypervisor = gammaUser?.[useAddress];

      const initialTokenUSD = userHypervisor?.returns?.initialTokenUSD;
      const currentUSD = userHypervisor?.returns?.currentUSD;

      const netMarketReturnsUSD = userHypervisor?.returns?.netMarketReturnsUSD;
      const hypervisorReturnsUSD = userHypervisor?.returns?.hypervisorReturnsUSD;

      const hypervisorReturnsPercentage = userHypervisor?.returns?.hypervisorReturnsPercentage;
      const netMarketReturnsPercentage = userHypervisor?.returns?.netMarketReturnsPercentage;

      totalUSD.initialTokenUSD = totalUSD.initialTokenUSD + initialTokenUSD;
      totalUSD.currentUSD = totalUSD.currentUSD + currentUSD;
      totalUSD.netMarketReturnsUSD = totalUSD.netMarketReturnsUSD + netMarketReturnsUSD;
      totalUSD.hypervisorReturnsUSD = totalUSD.hypervisorReturnsUSD + hypervisorReturnsUSD;

      allUSD.push({
        hypervisor: useAddress,
        initialTokenUSD: initialTokenUSD,
        currentUSD: currentUSD,
        netMarketReturnsUSD: netMarketReturnsUSD,
        hypervisorReturnsUSD: hypervisorReturnsUSD,
        hypervisorReturnsPercentage: hypervisorReturnsPercentage,
        netMarketReturnsPercentage: netMarketReturnsPercentage,
      });
    });

    setUserSummary({
      hypervisors: allUSD,
      totalUSD: totalUSD,
    })
  };

  const gammaUnavailableMsg = () => {
    return (
      <>
        <div className="bg-amber-600/40 p-4 rounded-lg w-full flex flex-col">
          <Typography variant="p">
            <b>3rd Party API Not Responding</b>
          </Typography>
          <Typography variant="p">
            This may prevent us from displaying some blockchain data.
          </Typography>
        </div>
      </>
    )
  }

  return (
    <div className="flex-1 grow-[3]">
      {yieldEnabled ? (
        <>
          {yieldData && yieldData.length ? (
            <>
              <Card className="card-compact mb-4">
                <div className="card-body">
                  <YieldList
                    yieldData={yieldData}
                    yieldIsPending={isPending}
                    gammaUser={gammaUser}
                    gammaReturns={gammaReturns}
                    gammaStats={gammaStats}
                    gammaUserLoading={gammaUserLoading}
                    gammaReturnsLoading={gammaReturnsLoading}
                    gammaStatsLoading={gammaStatsLoading}
                    gammaUserErr={gammaUserErr}
                    gammaReturnsErr={gammaReturnsErr}
                    gammaStatsErr={gammaStatsErr}
                    gammaUnavailableMsg={gammaUnavailableMsg}
                  />
                </div>
              </Card>
              <Card className="card-compact">
                <div className="card-body">
                  <YieldSummary
                    gammaUser={gammaUser}
                    gammaUserLoading={gammaUserLoading}
                    userSummary={userSummary}
                    merklRewards={merklRewards}
                    merklRewardsLoading={merklRewardsLoading}
                    gammaUserErr={gammaUserErr}
                    merklRewardsErr={merklRewardsErr}
                    gammaUnavailableMsg={gammaUnavailableMsg}
                  />
                </div>
              </Card>
            </>
          ) : (
            <Card className="card-compact">
              <div className="card-body">
                <Typography variant="h2" className="card-title flex gap-0">
                    <AdjustmentsHorizontalIcon
                      className="mr-2 h-6 w-6 inline-block"
                    />
                  Yield Pools
                </Typography>
                <Typography
                  variant="p"
                  className="mb-2"
                >
                  Start earning tokens through a mix of volatile collateral and correlated stable asset yield strategies.
                </Typography>
                <Typography
                  variant="p"
                  className="mb-2"
                >
                  Get started by placing some of your Collateral tokens into a yield pool now!
                </Typography>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card className="card-compact">
          <div className="card-body">
            <Typography variant="h2" className="card-title flex gap-0">
              <AdjustmentsHorizontalIcon className="mr-2 h-6 w-6 inline-block"/>
              Yield Pools
            </Typography>
            <Typography
              variant="p"
              className="mb-2"
            >
              Start earning token yields through a mix of volatile collateral and correlated stable asset yield strategies.
            </Typography>
            <Typography
              variant="p"
              className="mb-2"
            >
              Currently only available on V4 USDs vaults.
            </Typography>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="pl-2"
            >
              View My Vaults
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
};

export default YieldParent;