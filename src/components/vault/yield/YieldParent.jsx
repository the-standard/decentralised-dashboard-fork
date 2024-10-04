import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReadContract,
} from "wagmi";
import axios from "axios";

import {
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useSmartVaultABIStore,
} from "../../../store/Store";

import YieldList from "./YieldList";
// import YieldRatio from "./YieldRatio";

import Card from "../../ui/Card";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";

const Vault = (props) => {
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

  const { data: yieldData, refetch, isPending } = useReadContract({
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

      // TEMP
      const demoResponse = {
        "0x50169F0A798A1A91c46ba9307Ef47f3c8902555E": {
          "owner": "0x50169F0A798A1A91c46ba9307Ef47f3c8902555E",
          "gammaStaked": 0,
          "gammaStakedUSD": 0,
          "gammaDeposited": 0,
          "pendingGammaEarned": 0,
          "pendingGammaEarnedUSD": 0,
          "totalGammaEarned": 0,
          "totalGammaEarnedUSD": 0,
          "gammaStakedShare": 0,
          "xgammaAmount": 0,
          "0xc5B84d2f09094f72B79FE906d21c933c2DF27448": {
            "shares": 35386086757339710,
            "shareOfSupply": 0.00484693711611733,
            "balance0": 181.444335110173,
            "balance1": 0.0104237674832122,
            "balanceUSD": 82.0144024790318,
            "returns": {
              "initialTokenUSD": 97.7435385209756,
              "initialTokenCurrentUSD": 95.1822353477134,
              "currentUSD": 82.0144024790318,
              "netMarketReturnsUSD": 15.7291360419437,
              "netMarketReturnsPercentage": "16.09%",
              "hypervisorReturnsUSD": 13.1678328686816,
              "hypervisorReturnsPercentage": "13.83%"
            }
          },
          "0x5983C0811239ab91fB8dc72D7414257Dd8a27699": {
            "shares": 129691394492204430,
            "shareOfSupply": 0.124671419976011,
            "balance0": 0.00204202560235628,
            "balance1": 0.2442897057922,
            "balanceUSD": 773.959637099317,
            "returns": {
              "initialTokenUSD": 778.953353559473,
              "initialTokenCurrentUSD": 785.626624690344,
              "currentUSD": 773.959637099317,
              "netMarketReturnsUSD": 4.99371646015629,
              "netMarketReturnsPercentage": "0.64%",
              "hypervisorReturnsUSD": 11.6669875910278,
              "hypervisorReturnsPercentage": "1.49%"
            }
          }
        }
      }

      // const useData = response?.data?.[vaultAddress];
      const useData = demoResponse?.[vaultAddress];

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

      // TEMP
      const demoResponse = {
        "0xc5B84d2f09094f72B79FE906d21c933c2DF27448": {
          "symbol": "FOO-BAR",
          "feeApr": 0.1658200334668704,
          "feeApy": 0.18031621185777946,
          "status": "Good"
        },
        "0x5983C0811239ab91fB8dc72D7414257Dd8a27699": {
          "symbol": "APPLE-PAIR",
          "feeApr": 1.3866484788383229,
          "feeApy": 2.9909175485935875,
          "status": "Good"
        },
      }

      // const useResponse = response?.data;
      const useResponse = demoResponse;

      const hypervisorReturns = [];

      hypervisorAddresses && hypervisorAddresses.length && hypervisorAddresses.forEach((hyperaddress) => {
        const useReturns = useResponse?.[hyperaddress];
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

      // TEMP
      const demoResponse = {
        "0x5983C0811239ab91fB8dc72D7414257Dd8a27699": {
          "createDate": "20 Dec, 2022",
          "poolAddress": "0x149e36e72726e0bcea5c59d40df2c43f60f5a22d",
          "name": "WBTC-WETH-3000",
          "token0": "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
          "token1": "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
          "decimals0": 8,
          "decimals1": 18,
          "depositCap0": 1.157920892373162e+69,
          "depositCap1": 1.157920892373162e+59,
          "grossFeesClaimed0": 0.0924528,
          "grossFeesClaimed1": 1.57674980080721,
          "grossFeesClaimedUSD": "5841.75266530969",
          "feesReinvested0": 0.0924528,
          "feesReinvested1": 1.57674980080721,
          "feesReinvestedUSD": "5841.75266530969",
          "tvl0": 0.01545647,
          "tvl1": 1.98200532695643,
          "tvlUSD": "6185.248359917946",
          "totalSupply": 1.0402656400092275e+18,
          "maxTotalSupply": 0,
          "capacityUsed": "No cap",
          "sqrtPrice": "39192805575408189937665258499682753",
          "tick": 0,
          "baseLower": 261780,
          "baseUpper": 262560,
          "inRange": false,
          "observationIndex": "0",
          "poolTvlUSD": "0",
          "poolFeesUSD": "0"
        },
        "0xc5B84d2f09094f72B79FE906d21c933c2DF27448": {
          "createDate": "01 Jan, 1970",
          "poolAddress": "0x13398e27a21be1218b6900cbedf677571df42a48",
          "name": "USDT-USDC-500",
          "token0": "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
          "token1": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
          "decimals0": 6,
          "decimals1": 6,
          "depositCap0": 1.157920892373162e+71,
          "depositCap1": 1.157920892373162e+71,
          "grossFeesClaimed0": 3.702289,
          "grossFeesClaimed1": 3.655352,
          "grossFeesClaimedUSD": "7.357972930022355",
          "feesReinvested0": 3.702289,
          "feesReinvested1": 3.655352,
          "feesReinvestedUSD": "7.357972930022355",
          "tvl0": 4.813559,
          "tvl1": 2.126904,
          "tvlUSD": "6.941281655422388",
          "totalSupply": 2086629,
          "maxTotalSupply": 0,
          "capacityUsed": "No cap",
          "sqrtPrice": "79234899505265000754438768445",
          "tick": 0,
          "baseLower": -10,
          "baseUpper": 30,
          "inRange": true,
          "observationIndex": "0",
          "poolTvlUSD": "0",
          "poolFeesUSD": "0"
        },
      }

      // const useResponse = response?.data;
      const useResponse = demoResponse;

      const hypervisorStats = [];
      hypervisorAddresses.forEach((hyperaddress) => {
        const useStats = useResponse?.[hyperaddress];
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
    };
    hypervisorAddresses && hypervisorAddresses.length && hypervisorAddresses.forEach((hyperaddress) => {
      const userHypervisor = gammaUser?.[hyperaddress];
      const initialTokenUSD = userHypervisor?.returns?.initialTokenUSD;
      const currentUSD = userHypervisor?.returns?.currentUSD;

      const netMarketReturnsUSD = userHypervisor?.returns?.netMarketReturnsUSD;

      totalUSD.initialTokenUSD = totalUSD.initialTokenUSD + initialTokenUSD;
      totalUSD.currentUSD = totalUSD.currentUSD + currentUSD;
      totalUSD.netMarketReturnsUSD = totalUSD.netMarketReturnsUSD + netMarketReturnsUSD;

      allUSD.push({
        hypervisor: hyperaddress,
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
                      Total Yield Earned:
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-right"
                    >
                      {userSummary?.totalUSD?.netMarketReturnsUSD ? (
                        <>
                          {userSummary?.totalUSD?.netMarketReturnsUSD < 0 ? (
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
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography
                      variant="p"
                    >
                      Total Balance:
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-right"
                    >
                      ${userSummary?.totalUSD?.currentUSD?.toFixed(2) || ''}
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

export default Vault;