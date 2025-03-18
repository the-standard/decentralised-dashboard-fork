import { useState, useEffect } from "react";
import {
  useReadContract,
  useWatchBlockNumber,
  useChainId
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import axios from "axios";

import {
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useSmartVaultABIStore,
  useSelectedYieldPoolStore,
  useYieldBalancesStore,
  useGammaHypervisorsAllDataStore,
  useMerklPoolsDataStore,
} from "../../../store/Store";

import {
  ArbitrumGammaVaults,
  SepoliaGammaVaults,
  SepoliaVaults,
  ArbitrumVaults,
} from "./YieldGammaVaults";

import YieldItem from "./YieldItem";
import YieldViewModal from "./YieldViewModalNew";
import YieldClaimModal from "./YieldClaimModalNew";

import Card from "../../ui/Card";
import Typography from "../../ui/Typography";
import TokenIcon from "../../ui/TokenIcon";
import Button from "../../ui/Button";
import Select from "../../ui/Select";

const allYieldRanges = [
  {
    name: '1 Day',
    short: '1d',
    value: '1',
  },
  {
    name: '7 Days',
    short: '7d',
    value: '7',
  },
  {
    name: '14 Days',
    short: '14d',
    value: '14',
  },
  {
    name: '30 Days',
    short: '30d',
    value: '30',
  },
  {
    name: '90 Days',
    short: '90d',
    value: '90',
  },
  {
    name: '180 Days',
    short: '180d',
    value: '180',
  },
  {
    name: '365 Days',
    short: '1y',
    value: '365',
  },
];

const YieldParent = (props) => {
  const { yieldEnabled } = props;
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();

  const {
    gammaHypervisorsAllData,
    gammaHypervisorsAllDataLoading,
    setGammaHypervisorsAllData,
    setGammaHypervisorsAllDataLoading,
  } = useGammaHypervisorsAllDataStore();

  const {
    merklPoolsData,
    merklPoolsDataLoading,
    setMerklPoolsData,
    setMerklPoolsDataLoading,
  } = useMerklPoolsDataStore();

  const {
    selectedYieldPool,
    setSelectedYieldPool,
    selectedYieldPoolData,
    setSelectedYieldPoolData,
  } = useSelectedYieldPoolStore();

  const {
    yieldBalances,
    setYieldBalances,
    yieldBalancesLoading,
    setYieldBalancesLoading,
  } = useYieldBalancesStore();

  const chainId = useChainId();

  const [ gammaUser, setGammaUser ] = useState({});
  const [ gammaUserLoading, setGammaUserLoading ] = useState(false);
  const [ gammaUserErr, setGammaUserErr ] = useState(false);

  const [ gammaUserPositions, setGammaUserPositions ] = useState([])
  const [ gammaUserPositionsLoading, setGammaUserPositionsLoading ] = useState(true);
  const [ gammaUserPositionsErr, setGammaUserPositionsErr ] = useState(false);

  const [ gammaHypervisors, setGammaHypervisors ] = useState([]);
  const [ gammaHypervisorsLoading, setGammaHypervisorsLoading ] = useState(false);
  const [ gammaHypervisorsErr, setGammaHypervisorsErr ] = useState(false);

  const [ merklPools, setMerklPools ] = useState({});
  const [ merklPoolsLoading, setMerklPoolsLoading ] = useState(true);
  const [ merklPoolsErr, setMerklPoolsErr ] = useState(false);

  const [ userPositions, setUserPositions ] = useState([])

  const [ open, setOpen ] = useState('');
  
  const [ modalDataObj, setModalDataObj ] = useState({});

  const [ yieldRange, setYieldRange ] = useState('90');

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  const gammaVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaGammaVaults
  : ArbitrumGammaVaults;

  const handleCloseModal = () => {
    setOpen('');
    // setModalDataObj({})
    setSelectedYieldPool('');
    setSelectedYieldPoolData({});
  };

  const handleOpenModal = (selectedPool, poolData, type) => {
    setSelectedYieldPool(selectedPool);
    setSelectedYieldPoolData(poolData);
    setOpen(type);
  }

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
      getGammaUserPositionsData();
      getGammaHypervisorsData();
      getMerklPools();
    }
  }, [yieldData, isPending]);

  useEffect(() => {
    if (gammaUserPositions?.length && gammaHypervisors?.length) {
      getUserPositions();
    }
  }, [gammaUserPositions, gammaHypervisors]);

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

  const getGammaUserPositionsData = async () => {
    setGammaUserPositionsLoading(true);
    try {
      const response = await axios.get(
        `https://wire3.gamma.xyz/frontend/user/positions?address=${vaultAddress}&chain=arbitrum`
      );
      const useData = response?.data;

      setGammaUserPositions(useData);
      setGammaUserPositionsLoading(false);
      setGammaUserPositionsErr(false);
    } catch (error) {
      setGammaUserPositionsLoading(false);
      setGammaUserPositionsErr(true);
      console.log(error);
    }
  };

  const getGammaHypervisorsData = async () => {
    setGammaHypervisorsLoading(true);
    setGammaHypervisorsAllDataLoading(true);
    try {
      const response = await axios.get(
        `https://wire3.gamma.xyz/frontend/hypervisors/allDataSummary?chain=arbitrum&protocol=uniswapv3`
      );

      const useData = response?.data;

      setGammaHypervisors(useData);
      setGammaHypervisorsAllData(useData);
      setGammaHypervisorsLoading(false);
      setGammaHypervisorsAllDataLoading(false);
      setGammaHypervisorsErr(false);
    } catch (error) {
      setGammaHypervisorsLoading(false);
      setGammaHypervisorsAllDataLoading(false);
      setGammaHypervisorsErr(true);
      console.log(error);
    }
  };

  const getMerklPools = async () => {  
    try {
      setMerklPoolsLoading(true);
      setMerklPoolsDataLoading(true);
      const response = await axios.get(
        `https://api.angle.money/v2/merkl?chainIds[]=42161`
      );

      const useData = response?.data?.['42161'];

      setMerklPools(useData);
      setMerklPoolsData(useData);
      setMerklPoolsLoading(false);
      setMerklPoolsDataLoading(false);
      setMerklPoolsErr(false);
    } catch (error) {
      setMerklPoolsLoading(false);
      setMerklPoolsDataLoading(false);
      setMerklPoolsErr(true);
      console.log(error);
    }
  };

  const getUserPositions = async () => {  
    const userAdd = gammaUserPositions?.map(item => item.hypervisor);
    const userHyper = gammaHypervisors.filter(item => 
      userAdd.includes(item.address)
     );
    setUserPositions(userHyper);
  };

  const isPositive = (value) => value >= 0;

  const getYieldColor = (value) => isPositive(value) ? 'text-green-500' : 'text-amber-500';

  let useBalances = [];
  if (userPositions && userPositions.length && gammaUser) {
    userPositions?.length && userPositions.map(function(hypervisor, index) {    
      const hypervisorAddress = hypervisor?.address.toLowerCase();
      const userData = gammaUser?.[hypervisorAddress];
      const balanceUSD = userData?.balanceUSD || 0;
      const showBalance = Number(balanceUSD).toFixed(2);
      const total0 = userData?.balance0;
      const total1 = userData?.balance1;

      const gammaVaultInfo = gammaVaultsInfo.find(item => item?.address.toLowerCase() === hypervisorAddress);

      let tokenA;
      let tokenB;
    
      if (gammaVaultInfo?.pair) {
        tokenA = gammaVaultInfo.pair[0];
        tokenB = gammaVaultInfo.pair[1];
      }

      useBalances.push({
        pair: `${tokenA}/${tokenB}`,
        balance: showBalance,
        total0,
        total1,
      });
    })
  }

  useEffect(() => {
    if (useBalances) {
      setYieldBalances(useBalances);
    }
  }, [userPositions, gammaUser]);

  useEffect(() => {
    if (!gammaUserPositionsLoading && !gammaUserLoading) {
      setYieldBalancesLoading(false);
    }
  }, [gammaUserPositionsLoading, gammaUserLoading]);

  // USDs Stable Yield

  const usdsTokenYield = yieldVaultsInfo.find(item => item.asset === 'USDs');
  let usdsYieldPair;
  if (usdsTokenYield && usdsTokenYield.pair) {
    usdsYieldPair = usdsTokenYield.pair;
  }

  let usdsGammaVault = {};
  let usdsGammaAddress;
  if (usdsYieldPair) {
    usdsGammaVault = gammaVaultsInfo.find(vault => (
      vault.pair.length === usdsYieldPair.length && 
      usdsYieldPair.every(token => vault.pair.includes(token))
    ))
  }
  if (usdsGammaVault && usdsGammaVault.address) {
    usdsGammaAddress = usdsGammaVault.address;
  }

  let usdsGammaData;
  if (usdsGammaAddress) {
    usdsGammaData = gammaHypervisorsAllData.find(hypervisor => (
      hypervisor.address.toLowerCase() === usdsGammaAddress.toLowerCase()
    ))
  }

  let usdsGammaYield = 0;
  if (usdsGammaData && usdsGammaData.feeApr) {
    usdsGammaYield = Number(usdsGammaData.feeApr * 100).toFixed(2);
  }

  // USDs Merkl Rewards

  const usdsGammaVaultInfo = gammaVaultsInfo.find(item => item?.pair.every(token => ['USDs', 'USDC'].includes(token)));

  const merklPoolData = merklPoolsData?.pools?.[usdsGammaVaultInfo?.pool];

  const merklAprSelector = `Gamma ${usdsGammaVaultInfo?.address}`;

  const merklPoolReward = merklPoolData?.aprs?.[merklAprSelector] || 0;

  const stableYieldTotal = Number(Number(usdsGammaYield) + Number(merklPoolReward)).toFixed(2);

  const GammaStatus = () => {
    if (gammaUserErr || gammaUserPositionsErr) {
      return (
        <div role="alert" className="bg-yellow-400/20 p-2 rounded-lg">
          <span>
            <b>Upstream API Issue</b>
            <br/>
            An upstream API is currently experiencing issues. Yield balances may not display correctly, but your tokens are safe on the blockchain.
          </span>
        </div>
      )  
    };
    return (<></>);
  };

  return (
    <>
      {yieldEnabled ? (
        <>
          <Card className="card-compact mb-4">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <Typography variant="h2" className="flex items-center gap-0 mb-0">
                  <AdjustmentsHorizontalIcon
                    className="mr-2 h-6 w-6 inline-block"
                  />
                  Yield Pools
                </Typography>

                <Select
                  id="yield-range-select"
                  value={yieldRange}
                  label="Asset"
                  handleChange={(e) => setYieldRange(e.target.value)}
                  optName="name"
                  optValue="value"
                  options={allYieldRanges || []}
                  className="select-sm"
                  disabled={gammaUserPositionsLoading}
                >
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {GammaStatus()}
                {gammaUserPositionsLoading ? (
                  <>
                    <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center justify-center min-h-[200px]">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  </>
                ) : (
                  <>
                    {userPositions && userPositions.length ? (
                      <>
                        {userPositions?.length && userPositions.map(function(item, index) {
                          return (
                            <YieldItem
                              key={index}
                              yieldData={yieldData}
                              hypervisor={item}
                              gammaUser={gammaUser}
                              merklPools={merklPools}
                              merklPoolsLoading={merklPoolsLoading}
                              modalDataObj={selectedYieldPoolData}
                              // setModalDataObj={setModalDataObj}
                              handleCloseModal={handleCloseModal}
                              handleOpenModal={handleOpenModal}
                              getYieldColor={getYieldColor}
                              isPositive={isPositive}
                              yieldRange={yieldRange}            
                            />
                          )
                        })}
                      </>
                    ) : (
                      <>
                        <div className="bg-base-300/40 p-4 rounded-lg w-full flex flex-col">

                          <Typography
                            variant="h1"
                            className="mb-2"
                          >
                            <div className="inline-flex items-center">
                              <TokenIcon
                                symbol={'USDs'}
                                className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                              />
                              <TokenIcon
                                symbol={'USDC'}
                                className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                              />
                              &nbsp;Earn
                              {gammaHypervisorsAllDataLoading || merklPoolsDataLoading ? (
                                <span className="loading loading-bars loading-sm mx-2"></span>
                              ) : (
                                <>
                                  &nbsp;{stableYieldTotal}
                                </>
                              )}
                              % Yield
                            </div>
                          </Typography>

                          <Typography
                            variant="p"
                            className="opacity-90"
                          >
                            The USDs/USDC pool offers a stable
                            {gammaHypervisorsAllDataLoading || merklPoolsDataLoading ? (
                              <span className="loading loading-bars loading-xs mx-2"></span>
                            ) : (
                              <>
                                &nbsp;{stableYieldTotal}
                              </>
                            )}
                            % APY. Start earning today! Simply choose to split more into the stable pool after clicking the <b>PLACE IN YIELD POOL</b> button on any of your collateral tokens.
                          </Typography>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>

          <YieldClaimModal
            handleCloseModal={() => handleCloseModal()}
            isOpen={open === 'CLAIM'}
            modalDataObj={selectedYieldPoolData}
            yieldPair={selectedYieldPoolData?.yieldPair}
            yieldHypervisor={selectedYieldPoolData?.hypervisor}
            yieldQuantities={selectedYieldPoolData?.yieldQuantities}
            positionUser={selectedYieldPoolData?.positionUser}
          />

          <YieldViewModal
            isOpen={open === 'VIEW'}
            handleCloseModal={() => handleCloseModal()}
            openClaim={handleOpenModal}
            getYieldColor={getYieldColor}
            isPositive={isPositive}
            yieldRange={yieldRange}
            setYieldRange={setYieldRange}
            allYieldRanges={allYieldRanges}
            modalDataObj={selectedYieldPoolData}
          />
        </>
      ) : (
        <>
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
        </>
      )}
    </>
  )
};

export default YieldParent;