import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useReadContracts, useChainId } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import axios from "axios";

import {
  useChainlinkAbiStore,
  useUSDToEuroAddressStore,
  useWideBorrowModal,
} from "../../store/Store";

import { useInactivityControl } from '../InactivityControl';

import Typography from "../ui/Typography";

const EurosCompare = ({vaultType}) => {
  const [poolData, setPoolData] = useState(undefined);
  const chainId = useChainId();
  const { chainlinkAbi } = useChainlinkAbiStore();
  const { 
    arbitrumOneUSDToEuroAddress,
    arbitrumSepoliaUSDToEuroAddress
  } = useUSDToEuroAddressStore();
  const { setBorrowWide } = useWideBorrowModal();

  const { isActive } = useInactivityControl();

  const chainlinkContract = {
    abi: chainlinkAbi,
    functionName: "latestRoundData",
  };

  // TODO get USD prices
  const eurUsdAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumSepoliaUSDToEuroAddress
      : arbitrumOneUSDToEuroAddress;

  const contracts = [
    {
      address: eurUsdAddress,
      ...chainlinkContract,
    },
  ];

  const { data: priceData, isPending } = useReadContracts({
    contracts,
    enabled: isActive,
  });

  const chainPriceData = priceData?.map((data) => {
    const result = data.result;
    if (result && result[1]) {
      return result[1];
    }
  });

  let chainPrice = '0';
  if (chainPriceData && chainPriceData[0]) {
    chainPrice = formatUnits(chainPriceData[0].toString(), 8);
  }

  const getPoolData = async () => {
    // TODO add USD mainnet address logic
    try {
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/0x643b34980E635719C15a2D4ce69571a258F940E9`
      );
      let data;
      if (response.data.pairs) {
        data = response.data.pairs;
      }
      setPoolData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPoolData();
  }, [])

  const poolEurosData = poolData?.find((item) => item.baseToken?.symbol === 'EUROs');

  const poolPrice = poolEurosData?.priceUsd || '0';
  
  const currentDiscount = (Number(poolPrice) / Number(chainPrice) - 1) * 100;

  const showDiscount = Math.abs(currentDiscount);

  useEffect(() => {
    getPoolData();
    if (currentDiscount <= 0) {
      setBorrowWide(false)
    }
    if (currentDiscount > 0) {
      setBorrowWide(true)
    }
    setBorrowWide(true)

  }, [currentDiscount])

  // if (currentDiscount <= 0 || isPending) {
  //   return (
  //     <></>
  //   );  
  // }

  return (
    <div className="flex flex-col md:flex-row flex-1">
      <div className="flex flex-col md:flex-row">
        <div className="divider md:divider-horizontal" />
        <div>
          <div className="mb-2">
            <Typography
              variant="h2"
              className="mb-1"
            >
              Repay Your Debt for a Discount
            </Typography>
            <Typography
              variant="p"
            >
              Take advantage of market conditions to reduce your EUROs debt.
              <br/>
              When the EUROs Value dips below the FX market price of EUR, you have the opportunity to repay your debt at discount. Act swiftly to lock in your savings and strengthen your financial position.
            </Typography>
          </div>
      
          <div className="mb-2">
            <Typography
              variant="h3"
            >
              Current Savings Opportunity:
            </Typography>
            <div
              className="flex justify-between align-center"
            >
              <Typography
                variant="p"
                className="flex-1"
              >
                EUR FX market price (USD):
              </Typography>
              <Typography
                variant="p"
                className="flex-1"
              >
                ${chainPrice}
              </Typography>
            </div>
    
            <div
              className="flex justify-between align-center"
            >
              <Typography
                variant="p"
                className="flex-1"
              >
                EUROs price (USD):
              </Typography>
              <Typography
                variant="p"
                className="flex-1"
              >
                ${poolPrice}
              </Typography>
            </div>
    
            <div
              className="flex justify-between align-center"
            >
              <Typography
                variant="p"
                className="flex-1"
              >
                Current discount %:
              </Typography>
              <Typography
                variant="p"
                className="flex-1"
              >
                {showDiscount.toFixed(2)}%
              </Typography>
            </div>
    
          </div>
    
          <div>
            <Typography
              variant="h3"
            >
              Act Now: Save {showDiscount.toFixed(2)}% on Repayment
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default EurosCompare;
