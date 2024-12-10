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
import YieldItem from "./YieldItem";

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

  const [ gammaReturns, setGammaReturns ] = useState([]);
  const [ gammaReturnsLoading, setGammaReturnsLoading ] = useState(false);
  const [ gammaReturnsErr, setGammaReturnsErr ] = useState(false);

  const [ userPositions, setUserPositions ] = useState([])
  const [ userReturns, setUserReturns ] = useState([])

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
      getGammaUserPositionsData();
      getGammaHypervisorsData();
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

  const getUserPositions = async () => {  
    const userAdd = gammaUserPositions?.map(item => item.hypervisor);
    const userHyper = gammaHypervisors.filter(item => 
      userAdd.includes(item.address)
     );
    setUserPositions(userHyper);
  };

  return (
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
                <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
                  <span className="loading loading-bars loading-xl"></span>
                </div>
              </>
            ) : (
              <>
                {userPositions?.length && userPositions.map(function(item, index) {
                  return (
                    <YieldItem
                      key={index}
                      yieldData={yieldData}
                      hypervisor={item}
                      gammaUser={gammaUser}
                    />
                  )
                })}
              </>
            )}
          </div>
        </div>
      </Card>
    </>
  )
};

export default YieldParent;