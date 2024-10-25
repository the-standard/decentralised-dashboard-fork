import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReadContract,
  useWatchBlockNumber
} from "wagmi";
import axios from "axios";

import {
  AdjustmentsHorizontalIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

import {
  Tooltip,
} from 'react-daisyui';

import {
  useVaultAddressStore,
  useSmartVaultABIStore,
} from "../../../store/Store";

import YieldList from "./YieldList";

import Card from "../../ui/Card";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";

const YieldParent = (props) => {
  const { yieldEnabled } = props;
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();
  const [ gammaUser, setGammaUser ] = useState({});
  const [ gammaUserLoading, setGammaUserLoading ] = useState(false);
  const [ gammaReturns, setGammaReturns ] = useState([]);
  const [ gammaReturnsLoading, setGammaReturnsLoading ] = useState(false);
  const [ gammaStats, setGammaStats ] = useState([]);
  const [ gammaStatsLoading, setGammaStatsLoading ] = useState(false);

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

  const getGammaUserData = async () => {  
    try {
      setGammaUserLoading(true);
      const response = await axios.get(
        `https://wire2.gamma.xyz/arbitrum/user/${vaultAddress}`
      );

      const useData = response?.data?.[vaultAddress.toLowerCase()];

      setGammaUser(useData);
      setGammaUserLoading(false);
    } catch (error) {
      setGammaUserLoading(false);
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
    } catch (error) {
      setGammaReturnsLoading(false);
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
    } catch (error) {
      setGammaStatsLoading(false);
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

      totalUSD.initialTokenUSD = totalUSD.initialTokenUSD + initialTokenUSD;
      totalUSD.currentUSD = totalUSD.currentUSD + currentUSD;
      totalUSD.netMarketReturnsUSD = totalUSD.netMarketReturnsUSD + netMarketReturnsUSD;
      totalUSD.hypervisorReturnsUSD = totalUSD.hypervisorReturnsUSD + hypervisorReturnsUSD;

      allUSD.push({
        hypervisor: useAddress,
        initialTokenUSD: initialTokenUSD,
        currentUSD: currentUSD,
      });
    });

    setUserSummary({
      hypervisors: allUSD,
      totalUSD: totalUSD,
    })
  };

  return (
    <div className="flex-1 grow-[3]">
      {yieldEnabled ? (
        <>
          {yieldData && yieldData.length ? (
            <Card className="card-compact">
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
                />
                {/* <YieldRatio /> */}

                <div>

                  <div className="flex justify-between">
                    <Typography
                      variant="p"
                    >
                      Total Yield Earned
                      <Tooltip
                        className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                        position="top"
                        message={'Your total yield earned, based on the price of your tokens at deposit.'}
                      >
                        <QuestionMarkCircleIcon
                          className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                        />
                      </Tooltip>
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-right"
                    >
                      {gammaUserLoading ? (
                        <>
                          <span class="loading loading-bars loading-xs"></span>
                        </>
                      ) : (
                        <>
                          {userSummary?.totalUSD?.hypervisorReturnsUSD ? (
                            <>
                              {userSummary?.totalUSD?.hypervisorReturnsUSD.toFixed(2) < 0 ? (
                                '-$'
                              ) : (
                                '$'
                              )}
                              {
                                Math.abs(
                                  userSummary?.totalUSD?.hypervisorReturnsUSD
                                )?.toFixed(2) || ''
                              }
                            </>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography
                      variant="p"
                    >
                      <span className="opacity-60">Total Yield Earned (Market)</span>
                      <Tooltip
                        className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                        position="top"
                        message={'Your total yield earned, based on the current market rate of your deposited tokens.'}
                      >
                        <QuestionMarkCircleIcon
                          className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                        />
                      </Tooltip>
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-right"
                    >
                      {gammaUserLoading ? (
                        <>
                          <span class="loading loading-bars loading-xs"></span>
                        </>
                      ) : (
                        <span className="opacity-60 mb-4 block">
                          {userSummary?.totalUSD?.netMarketReturnsUSD ? (
                            <>
                              {userSummary?.totalUSD?.netMarketReturnsUSD.toFixed(2) < 0 ? (
                                '-$'
                              ) : (
                                '$'
                              )}
                              {
                                Math.abs(
                                  userSummary?.totalUSD?.netMarketReturnsUSD
                                )?.toFixed(2) || ''
                              }
                            </>
                          ) : (
                            ''
                          )}
                        </span>
                      )}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography
                      variant="p"
                    >
                      Total Balance
                      <Tooltip
                        className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                        position="top"
                        message={'The current value of all your yield pair tokens together.'}
                      >
                        <QuestionMarkCircleIcon
                          className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                        />
                      </Tooltip>
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-right"
                    >
                      {gammaUserLoading ? (
                        <>
                          <span class="loading loading-bars loading-xs"></span>
                        </>
                      ) : (
                        <>
                          ${userSummary?.totalUSD?.currentUSD?.toFixed(2) || ''}
                        </>
                      )}
                    </Typography>
                  </div>

                </div>
              </div>
            </Card>
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