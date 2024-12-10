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
  useVaultAddressStore,
} from "../../../store/Store";

import {
  ArbitrumVaults,
  SepoliaVaults,
} from "./YieldGammaVaults";

import YieldViewModal from "./YieldViewModalNew";
import YieldClaimModal from "./YieldClaimModalNew";

import Typography from "../../ui/Typography";
import TokenIcon from "../../ui/TokenIcon";
import Button from "../../ui/Button";

const YieldItem = (props) => {
  const { hypervisor, gammaUser, yieldData } = props;

  const [ open, setOpen ] = useState('');
  const [ yieldPair, setYieldPair ] = useState([]);
  const [ yieldQuantities, setYieldQuantities ] = useState([]);
  const [ yieldHypervisor, setYieldHypervisor ] = useState('');
  const chainId = useChainId();

  const [ hypervisorData, setHypervisorData ] = useState({});
  const [ hypervisorDataLoading, setHypervisorDataLoading ] = useState(false);
  const [ hypervisorDataErr, setHypervisorDataErr ] = useState(false);

  const { vaultAddress } = useVaultAddressStore();

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  const handleCloseModal = () => {
    // setYieldPair([]);
    // setYieldQuantities([]);
    // setYieldHypervisor('');
    setOpen('');
  };

  const handleOpenModal = (type) => {
    // setYieldPair(pair);
    // setYieldQuantities(quantities);
    // setYieldHypervisor(hypervisor);
    setOpen(type);
  }

  const dataPeriod = 14;

  const useYieldData = yieldData.find(item => item?.hypervisor.toLowerCase() === hypervisor?.address.toLowerCase());

  const userData = gammaUser?.[hypervisor?.address.toLowerCase()];

  const balanceUSD = userData?.balanceUSD;

  useEffect(() => {
    if (hypervisor) {
      getHypervisorData();
    }
  }, [hypervisor]);

  const getHypervisorData = async () => {  
    const hyperAddress = hypervisor?.address;

    try {
      setHypervisorDataLoading(true);
      const response = await axios.get(
        `https://wire3.gamma.xyz/frontend/analytics/returns/chart?hypervisor_address=${hyperAddress}&chain=arbitrum&period=${dataPeriod}`
      );

      const useData = response?.data;

      setHypervisorData(useData);
      setHypervisorDataLoading(false);
      setHypervisorDataErr(false);
    } catch (error) {
      setHypervisorDataLoading(false);
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

  if (latestData?.symbol) {
    [tokenA, tokenB] = latestData?.symbol.split("-").map((token, i) => 
      i === 0 ? token.slice(1) : token.slice(0, -1)
    );
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
  const apyReward = hypervisor?.rewardApr * 100;
  const apyTotal = Number(apyBase) + Number(apyReward);

  const showBalance = '$'+balanceUSD?.toFixed(2) || '';

  const isPositive = (value) => value >= 0;

  const getYieldColor = (value) => isPositive(value) ? 'text-green-500' : 'text-amber-500';

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
          <div>
            <Typography variant="p" className="opacity-40 text-sm">
              Fee APR
            </Typography>
            <Typography variant="p" className="text-sm">
              {apyBase.toFixed(2)}%
            </Typography>
          </div>
          <div>
            <Typography variant="p" className="opacity-40 text-sm">
              Reward APR
            </Typography>
            <Typography variant="p" className="text-sm">
              {apyReward.toFixed(2)}%
            </Typography>
          </div>
          <div>
            <Typography variant="p" className="opacity-40 text-sm">
              Total APR (24h)
            </Typography>
            <Typography variant="p" className="text-sm">
              {apyTotal.toFixed(2)}%
            </Typography>
          </div>

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
            <Typography variant="p" className={`text-sm ${getYieldColor(gammaPosition)}`}>
              {isPositive(gammaPosition) ? ('+') : null}
              {Math.abs(gammaPosition) >= 0 ? (`${gammaPosition.toFixed(3)}%`) : ('')}
            </Typography>
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
            <Typography variant="p" className={`text-sm ${getYieldColor(holdA)}`}>
              {isPositive(holdA) ? ('+') : null}
              {Math.abs(holdA) >= 0 ? (`${holdA.toFixed(3)}%`) : ('')}
            </Typography>
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
            <Typography variant="p" className={`text-sm ${getYieldColor(holdB)}`}>
              {isPositive(holdB) ? ('+') : null}
              {Math.abs(holdB) >= 0 ? (`${holdB.toFixed(3)}%`) : ('')}
            </Typography>
          </div>

          <div>
            <Typography variant="p" className="opacity-40">
              Your Balance
            </Typography>
            <Typography variant="p" className="">
              {showBalance}
            </Typography>
          </div>
          <div>
          </div>
          <div className="flex justify-end items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenModal('VIEW')}
            >
              View
            </Button>
          </div>
        </div>
      </div>

      <YieldClaimModal
        handleCloseModal={() => handleCloseModal()}
        isOpen={open === 'CLAIM'}
        yieldPair={[tokenA, tokenB]}
        yieldQuantities={quantities}
        positionUser={userData}
      />

      <YieldViewModal
        handleCloseModal={() => handleCloseModal()}
        isOpen={open === 'VIEW'}
        openClaim={() => handleOpenModal('CLAIM')}

        yieldPair={[tokenA, tokenB]}
        hypervisor={hypervisor}
        gammaUser={gammaUser}
        hypervisorData={hypervisorData}
        hypervisorDataLoading={hypervisorDataLoading}

        getYieldColor={getYieldColor}
        isPositive={isPositive}
        gammaPosition={gammaPosition}
        holdA={holdA}
        holdB={holdB}
        dataPeriod={dataPeriod}
        apyBase={apyBase}
        apyReward={apyReward}
        apyTotal={apyTotal}
        showBalance={showBalance}
      />
    </>
  )
};

export default YieldItem;