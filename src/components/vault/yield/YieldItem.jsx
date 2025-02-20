import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import axios from "axios";

import {
  Tooltip,
} from 'react-daisyui';

import {
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

import {
  useSelectedYieldPoolStore,
} from "../../../store/Store";

import {
  ArbitrumVaults,
  SepoliaVaults,
  ArbitrumGammaVaults,
  SepoliaGammaVaults,
} from "./YieldGammaVaults";

import YieldViewModal from "./YieldViewModalNew";
import YieldClaimModal from "./YieldClaimModalNew";

import Typography from "../../ui/Typography";
import TokenIcon from "../../ui/TokenIcon";
import Button from "../../ui/Button";

const YieldItem = (props) => {
  const {
    hypervisor,
    gammaUser,
    yieldData,
    merklPools,

    modalDataObj,
    setModalDataObj,
    handleCloseModal,
    handleOpenModal,
    isPositive,
    getYieldColor,
    yieldRange
  } = props;

  const {
    selectedYieldPool,
    setSelectedYieldPool,
    selectedYieldPoolData,
    setSelectedYieldPoolData,
    selectedYieldPoolDataLoading,
    setSelectedYieldPoolDataLoading,
  } = useSelectedYieldPoolStore();

  const [ open, setOpen ] = useState('');
  const chainId = useChainId();

  const [ hypervisorData, setHypervisorData ] = useState({});
  const [ hypervisorDataLoading, setHypervisorDataLoading ] = useState(false);
  const [ hypervisorDataErr, setHypervisorDataErr ] = useState(false);

  const [ modalData, setModalData ] = useState({});

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  const gammaVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaGammaVaults
  : ArbitrumGammaVaults;

  const dataPeriod = yieldRange;

  const hypervisorAddress = hypervisor?.address.toLowerCase();

  const gammaVaultInfo = gammaVaultsInfo.find(item => item?.address.toLowerCase() === hypervisorAddress);

  const useYieldData = yieldData.find(item => item?.hypervisor.toLowerCase() === hypervisorAddress);

  const userData = gammaUser?.[hypervisorAddress];

  const balanceUSD = userData?.balanceUSD || 0;

  const merklPoolData = merklPools?.pools?.[gammaVaultInfo?.pool];

  const merklAprSelector = `Gamma ${gammaVaultInfo?.address}`;

  const merklPoolReward = merklPoolData?.aprs?.[merklAprSelector] || 0;

  useEffect(() => {
    if (hypervisor) {
      getHypervisorData();
    }
  }, [hypervisor, dataPeriod]);

  useEffect(() => {
    if (hypervisorData) {
      const dataObj = {
        yieldPair: [tokenA, tokenB],
        hypervisor: hypervisor,
        gammaUser: gammaUser,
        hypervisorData: hypervisorData,
        hypervisorDataLoading: hypervisorDataLoading,
        gammaPosition: gammaPosition,
        holdA: holdA,
        holdB: holdB,
        dataPeriod: dataPeriod,
        apyBase: apyBase,
        apyReward: apyReward,
        apyTotal: apyTotal,
        showBalance: showBalance,
        yieldQuantities: quantities,
        positionUser: userData,
      };

      setModalData(dataObj);

      if (selectedYieldPool === usePair) {
        setSelectedYieldPoolData(dataObj)
      }
    }
  }, [hypervisorData, dataPeriod]);

  const getHypervisorData = async () => {  
    const hyperAddress = hypervisor?.address;

    try {
      setHypervisorDataLoading(true);
      setSelectedYieldPoolDataLoading(true);
      const response = await axios.get(
        `https://wire3.gamma.xyz/frontend/analytics/returns/chart?hypervisor_address=${hyperAddress}&chain=arbitrum&period=${dataPeriod}`
      );

      const useData = response?.data;

      setHypervisorData(useData);
      setHypervisorDataLoading(false);
      setSelectedYieldPoolDataLoading(false);
      setHypervisorDataErr(false);
    } catch (error) {
      setHypervisorDataLoading(false);
      setSelectedYieldPoolDataLoading(false);
      setHypervisorDataErr(true);
      console.log(error);
    }
  };

  const latestData = hypervisorData?.[hypervisorData.length - 1];

  const gammaPosition = latestData?.period_gamma_netApr * 100;
  const holdA = latestData?.period_hodl_token0 * 100;
  const holdB = latestData?.period_hodl_token1 * 100;

  let tokenA;
  let tokenB;

  if (gammaVaultInfo?.pair) {
    tokenA = gammaVaultInfo.pair[0];
    tokenB = gammaVaultInfo.pair[1];
  }

  let amountA = 0n;
  let amountB = 0n;

  if (useYieldData) {
    amountA = useYieldData?.amount0;
    amountB = useYieldData?.amount1;  
  }

  const tokenAdetails = yieldVaultsInfo.find(item => item?.asset.toLowerCase() === tokenA?.toLowerCase());
  const tokenBdetails = yieldVaultsInfo.find(item => item?.asset.toLowerCase() === tokenB?.toLowerCase());

  let decA = 18;
  let decB = 18;
  if (tokenAdetails?.dec) {
    decA = Number(tokenAdetails.dec);
  }
  if (tokenBdetails?.dec) {
    decB = Number(tokenBdetails.dec);
  }
  const quantities = [
    ethers.formatUnits(amountA, decA),
    ethers.formatUnits(amountB, decB),
  ];

  const apyBase = hypervisor?.feeApr * 100;
  // const apyReward = hypervisor?.rewardApr * 100;
  const apyReward = Number(merklPoolReward);
  const apyTotal = Number(apyBase) + Number(apyReward);

  const showBalance = '$'+balanceUSD?.toFixed(2) || '';

  const usePair = tokenA + tokenB;

  return (
    <>
      <div className="bg-base-300/40 p-4 rounded-lg w-full flex flex-col">
        <div className="w-full flex mb-4">
          <div className="flex items-center w-full">
            <TokenIcon
              symbol={tokenA}
              className="h-8 w-8 p-1 rounded-full bg-base-300/50"
            />
            <TokenIcon
              symbol={tokenB}
              className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
            />
            <div className="ml-2 flex w-full justify-between">
              <div>
                <Typography variant="p">
                  {tokenA}/{tokenB}
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <>
            <div>
              <Typography variant="p" className="opacity-40 text-sm">
                Fee APY
              </Typography>
              <Typography variant="p" className="text-sm">
                {apyBase.toFixed(2)}%
              </Typography>
            </div>
            <div>
              <Typography variant="p" className="opacity-40 text-sm">
                Reward APY
              </Typography>
              <Typography variant="p" className="text-sm">
                {apyReward.toFixed(2)}%
              </Typography>
            </div>
            <div>
              <Typography variant="p" className="opacity-40 text-sm">
                Total APY (24h)
              </Typography>
              <Typography variant="p" className="text-sm">
                {apyTotal.toFixed(2)}%
              </Typography>
            </div>
          </>

          <>
            <div>
              <Tooltip
                className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                position="top"
                message={`USD return of total fees + liquidity mining rewards accrued for ${dataPeriod}d`}
              >
                <Typography variant="p" className="opacity-40 text-sm">
                  Position
                  <QuestionMarkCircleIcon
                    className="mb-0.5 ml-0.5 h-3 w-3 inline-block"
                  />
                </Typography>
              </Tooltip>
              {hypervisorDataLoading ? (
                <>
                  <span className="block loading loading-bars loading-xs"></span>
                </>
              ) : (
                <>
                  <Typography variant="p" className={`text-sm ${getYieldColor(gammaPosition)}`}>
                    {isPositive(gammaPosition) ? ('+') : null}
                    {Math.abs(gammaPosition) >= 0 ? (`${gammaPosition.toFixed(3)}%`) : ('')}
                  </Typography>
                </>
              )}
            </div>
            <div>
              <Tooltip
                className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                position="top"
                message={`USD return of holding 100% of ${tokenA} ${dataPeriod}d ago`}
              >
                <Typography variant="p" className="opacity-40 text-sm">
                If Held {tokenA}
                  <QuestionMarkCircleIcon
                    className="mb-0.5 ml-0.5 h-3 w-3 inline-block"
                  />
                </Typography>
              </Tooltip>
              {hypervisorDataLoading ? (
                <>
                  <span className="block loading loading-bars loading-xs"></span>
                </>
              ) : (
                <>
                  <Typography variant="p" className={`text-sm ${getYieldColor(holdA)}`}>
                    {isPositive(holdA) ? ('+') : null}
                    {Math.abs(holdA) >= 0 ? (`${holdA.toFixed(3)}%`) : ('')}
                  </Typography>
                </>
              )}
            </div>
            <div>
              <Tooltip
                className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                position="top"
                message={`USD return of holding 100% of ${tokenB} ${dataPeriod}d ago`}
              >
                <Typography variant="p" className="opacity-40 text-sm">
                If Held {tokenB}
                  <QuestionMarkCircleIcon
                    className="mb-0.5 ml-0.5 h-3 w-3 inline-block"
                  />
                </Typography>
              </Tooltip>
              {hypervisorDataLoading ? (
                <>
                  <span className="block loading loading-bars loading-xs"></span>
                </>
              ) : (
                <>
                  <Typography variant="p" className={`text-sm ${getYieldColor(holdB)}`}>
                    {isPositive(holdB) ? ('+') : null}
                    {Math.abs(holdB) >= 0 ? (`${holdB.toFixed(3)}%`) : ('')}
                  </Typography>
                </>
              )}
            </div>
          </>

          <>
            <div>
              <Typography variant="p" className="opacity-40">
                Your Balance
              </Typography>
              <Typography variant="p" className="">
                {showBalance || 0}
              </Typography>
            </div>
            <div>
            </div>
            <div className="flex justify-end items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenModal(usePair, modalData, 'VIEW')}
                disabled={!balanceUSD}
              >
                View
              </Button>
            </div>
          </>
        </div>
      </div>
    </>
  )
};

export default YieldItem;