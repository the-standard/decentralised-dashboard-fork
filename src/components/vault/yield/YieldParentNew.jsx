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

import YieldItem from "./YieldItem";
import YieldViewModal from "./YieldViewModalNew";
import YieldClaimModal from "./YieldClaimModalNew";

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

  const handleCloseModal = () => {
    setOpen('');
    setModalDataObj({})
  };

  const handleOpenModal = (useData, type) => {
    setModalDataObj(useData)
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
    try {
      const response = await axios.get(
        `https://wire3.gamma.xyz/frontend/hypervisors/allDataSummary?chain=arbitrum&protocol=uniswapv3`
      );

      const useData = response?.data;

      setGammaHypervisors(useData);
      setGammaHypervisorsLoading(false);
      setGammaHypervisorsErr(false);
    } catch (error) {
      setGammaHypervisorsLoading(false);
      setGammaHypervisorsErr(true);
      console.log(error);
    }
  };

  const getMerklPools = async () => {  
    try {
      setMerklPoolsLoading(true);
      const response = await axios.get(
        `https://api.angle.money/v2/merkl?chainIds[]=42161`
      );

      const useData = response?.data?.['42161'];

      setMerklPools(useData);
      setMerklPoolsLoading(false);
      setMerklPoolsErr(false);
    } catch (error) {
      setMerklPoolsLoading(false);
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

  return (
    <>
      {yieldEnabled ? (
        <>
          <Card className="card-compact mb-4">
            <div className="card-body">
              <Typography variant="h2" className="card-title flex gap-0">
                <AdjustmentsHorizontalIcon
                  className="mr-2 h-6 w-6 inline-block"
                />
                Yield Pools
              </Typography>
              <div className="grid grid-cols-1 gap-4">
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
                              modalDataObj={modalDataObj}
                              setModalDataObj={setModalDataObj}
                              handleCloseModal={handleCloseModal}
                              handleOpenModal={handleOpenModal}
                              getYieldColor={getYieldColor}
                              isPositive={isPositive}              
                            />
                          )
                        })}
                      </>
                    ) : (
                      <>
                        <div className="bg-base-300/40 p-4 rounded-lg w-full flex flex-col items-center justify-center">
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
            modalDataObj={modalDataObj}
            yieldPair={modalDataObj?.yieldPair}
            yieldHypervisor={modalDataObj?.hypervisor}
            yieldQuantities={modalDataObj?.yieldQuantities}
            positionUser={modalDataObj?.positionUser}
          />

          <YieldViewModal
            handleCloseModal={() => handleCloseModal()}
            isOpen={open === 'VIEW'}
            openClaim={handleOpenModal}
            getYieldColor={getYieldColor}
            isPositive={isPositive}

            modalDataObj={modalDataObj}
            yieldPair={modalDataObj?.yieldPair}
            hypervisor={modalDataObj?.hypervisor}
            gammaUser={modalDataObj?.gammaUser}
            hypervisorData={modalDataObj?.hypervisorData}
            hypervisorDataLoading={modalDataObj?.hypervisorDataLoading}

            gammaPosition={modalDataObj?.gammaPosition}
            holdA={modalDataObj?.holdA}
            holdB={modalDataObj?.holdB}
            dataPeriod={modalDataObj?.dataPeriod}
            apyBase={modalDataObj?.apyBase}
            apyReward={modalDataObj?.apyReward}
            apyTotal={modalDataObj?.apyTotal}
            showBalance={modalDataObj?.showBalance}
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