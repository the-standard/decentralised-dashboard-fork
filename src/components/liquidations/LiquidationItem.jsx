import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { Link, useNavigate } from "react-router-dom";
import {
  useBlockNumber,
  useReadContract,
  useChainId,
  useWatchBlockNumber,
  useAccount,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  Tooltip,
  Progress,
} from 'react-daisyui';

import {
  useContractAddressStore,
  useVaultManagerAbiStore,
  usesUSDContractAddressStore,
  useGuestShowcaseStore,
  useSmartVaultV4ABIStore,
} from "../../store/Store";

import Card from "../ui/Card";
import Pagination from "../ui/Pagination";
import CenterLoader from "../ui/CenterLoader";
import Typography from "../ui/Typography";

import seurologo from "../../assets/EUROs.svg";
import susdlogo from "../../assets/USDs.svg";

import LiquidationAction from "./LiquidationAction";
import BalanceChecker from "./BalanceChecker";

const computeProgressBar = (
  totalDebt,
  totalCollateralValue
) => {
  return totalCollateralValue === 0n
    ? "0.0"
    : (Number((10000n * totalDebt) / totalCollateralValue) / 100).toFixed(2);
};

const truncateToTwoDecimals = (num) => {
  const withTwoDecimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/);
  return withTwoDecimals ? withTwoDecimals[0] : num;
}

const LiquidationItem = ( props ) => {
  const {
    item,
    index,
    onComplete,
    USDsBalance,
  } = props;
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const {
    arbitrumSepoliaContractAddress,
    arbitrumContractAddress
  } = useContractAddressStore();
  const {
    arbitrumsUSDSepoliaContractAddress,
    arbitrumsUSDContractAddress,
  } = usesUSDContractAddressStore();
  const { smartVaultV4ABI } = useSmartVaultV4ABIStore();

  const [isDataReady, setIsDataReady] = useState(false);

  const chainId = useChainId();
  const completedRef = useRef(false);

  // const vaultManagerAddress =
  //   chainId === arbitrumSepolia.id
  //     ? arbitrumSepoliaContractAddress
  //     : arbitrumContractAddress;

  const sUSDVaultManagerAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumsUSDSepoliaContractAddress
      : arbitrumsUSDContractAddress;

  const vaultId = item?.tokenID || '';

  const listType = 'USDs';
  let currencySymbol = '';

  if (listType === 'USDs') {
    currencySymbol = '$';
  } else {
    currencySymbol = '€';
  }

  const {
    data: vaultDatasUSD,
    isLoading: isLoadingsUSD,
    isError: isErrorsUSD,
    error: errorsUSD
  } = useReadContract({
    abi: vaultManagerAbi,
    address: sUSDVaultManagerAddress,
    functionName: "vaultData",
    args: [vaultId],
    enabled: true,
  });

  useEffect(() => {
    if (!completedRef.current && (vaultDatasUSD !== undefined || isErrorsUSD)) {
      setIsDataReady(true);
      completedRef.current = true;
      setTimeout(() => {
        onComplete(index, vaultDatasUSD, isErrorsUSD ? errorsUSD : null);
      }, 200);  
    }
  }, [vaultDatasUSD, isErrorsUSD, errorsUSD, index, onComplete]);

  if (isLoadingsUSD && !isDataReady) {
    return (
      <tr
        key={index}
        className="active animate-pulse"
      >
        <td className="hidden md:table-cell">
          <div className="rounded-full bg-base-content h-[42px] w-[42px] opacity-30"></div>
        </td>
        <td>
          <div className="rounded-lg bg-base-content h-[12px] w-[38px] opacity-30"></div>
        </td>
        <td className="hidden md:table-cell">
          <div className="rounded-lg bg-base-content h-[12px] w-[72px] opacity-30"></div>
        </td>
        <td>
          <div className="rounded-lg bg-base-content h-[12px] w-[92px] opacity-30"></div>
        </td>
        <td className="hidden md:table-cell">
          <div className="rounded-lg bg-base-content h-[12px] w-full opacity-30"></div>
        </td>
        <td className="text-right flex justify-end">
          <div className="rounded-lg bg-base-content h-[38px] w-[160px] opacity-30"></div>
        </td>
      </tr> 
    );
  }
  
  if (isErrorsUSD) {
    return <></>;
  }

  const vault = vaultDatasUSD;

  let vaultType = '';
  if (vault?.status?.vaultType) {
    vaultType = ethers.decodeBytes32String(vault?.status?.vaultType);
  }
  let vaultHealth = 100;
  if (vault?.status) {
    vaultHealth = computeProgressBar(
      vault?.status?.minted,
      vault?.status?.totalCollateralValue
    );
  }
  let healthColour = 'success';
  if (vaultHealth >= 30) {
    healthColour = 'neutral';
  }
  if (vaultHealth >= 50) {
    healthColour = 'warning';
  }
  if (vaultHealth >= 75) {
    healthColour = 'error';
  }

  let hasFunds = false;

  if (USDsBalance && vault?.status?.totalCollateralValue) {
    hasFunds = USDsBalance >= vault?.status?.totalCollateralValue;
  }
  
  return (
    <tr key={index}>
      <td className="hidden md:table-cell">
        <Tooltip
          className="h-full"
          position="top"
          message={(vaultType || '' )}
        >
          {vaultType === 'EUROs' ? (
            <img
              style={{
                display: "block",
                width: "42px",
              }}
              src={seurologo}
              alt="EUROs"
            />
          ) : null}
          {vaultType === 'USDs' ? (
            <img
              style={{
                display: "block",
                width: "42px",
              }}
              src={susdlogo}
              alt="USDs"
            />
          ) : null}
        </Tooltip>
      </td>
      <td>
        {vault?.status?.version ? (
          `V${vault?.status?.version}-`
        ) : ('')}
        {BigInt(vault?.tokenId).toString()}
      </td>
      <td className="hidden md:table-cell">
        {currencySymbol}
        {truncateToTwoDecimals(
          ethers.formatEther(
            BigInt(
              vault.status.totalCollateralValue
            ).toString()
          )
        )}
      </td>
      <td>
        {truncateToTwoDecimals(
          ethers.formatEther(vault.status.minted.toString())
        )}
        &nbsp;
        {vaultType.toString()}
      </td>
      <td className="hidden md:table-cell">
        {vault.status.liquidated ? (
          <Typography variant="p" className="text-error">
            Vault Liquidated
          </Typography>
        ) : (
          <Tooltip
            className="w-full h-full"
            position="top"
            message={(vaultHealth || 0 ) + '%'}
          >
            <Progress
              value={vaultHealth || 0}
              max="100"
              color={healthColour || 'neutral'}
            />
          </Tooltip>
        )}
      </td>
      <td className="text-right">
        <LiquidationAction 
          vaultData={vault}
          hasFunds={hasFunds}
        />
      </td>
    </tr> 
  );
};

export default LiquidationItem;