import { useState, useEffect, useRef, Fragment } from "react";
import { ethers } from "ethers";
import {
  useReadContract,
  useChainId,
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
} from "../../store/Store";

import { useInactivityControl } from '../InactivityControl';

import Typography from "../ui/Typography";

import seurologo from "../../assets/EUROs.svg";
import susdlogo from "../../assets/USDs.svg";

import LiquidationAction from "./LiquidationAction";
import ListItemLoader from "./ListItemLoader";

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
  const { isActive } = useInactivityControl();

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
    error: errorsUSD,
    refetch: refetchsUSD,
  } = useReadContract({
    abi: vaultManagerAbi,
    address: sUSDVaultManagerAddress,
    functionName: "vaultData",
    args: [vaultId],
    enabled: isActive,
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
      <ListItemLoader index={index} />
    );
  }
  
  if (isErrorsUSD) {
    return <></>;
  }

  const vault = vaultDatasUSD;
  
  let totalCollateralValue = 0n;
  if (vault?.status?.totalCollateralValue) {
    totalCollateralValue = vault?.status?.totalCollateralValue;
  }
  let minted = 0n;
  if (vault?.status?.minted) {
    minted = vault?.status?.minted;
  }
  let vaultType = '';
  if (vault?.status?.vaultType) {
    vaultType = ethers.decodeBytes32String(vault?.status?.vaultType);
  }
  let vaultHealth = 100;
  if (vault?.status) {
    vaultHealth = computeProgressBar(
      minted,
      totalCollateralValue,
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

  if (USDsBalance && minted) {
    hasFunds = USDsBalance > minted;
  }

  const claimableValue = totalCollateralValue - minted;

  const isLiquidated = vault?.status?.liquidated;

  return (
    <Fragment key={index}>
      <tr className="border-b-0 md:border-b-[1px]">
        <td
          className="hidden md:table-cell"
        >
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
                className={`${isLiquidated ? 'opacity-50' : ''}`}
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
                className={`${isLiquidated ? 'opacity-50' : ''}`}
              />
            ) : null}
          </Tooltip>
        </td>
        <td
          className={`hidden md:table-cell ${isLiquidated ? 'opacity-50' : ''}`}
        >
          {vault?.status?.version ? (
            `V${vault?.status?.version}-`
          ) : ('')}
          {BigInt(vault?.tokenId).toString()}
        </td>
        <td
          className={`${isLiquidated ? 'opacity-50' : ''}`}
        >
          {/* {currencySymbol} */}
          {truncateToTwoDecimals(
            ethers.formatEther(
              totalCollateralValue.toString()
            )
          )}
        </td>
        <td
          className={`${isLiquidated ? 'opacity-50' : ''}`}
        >
          {truncateToTwoDecimals(
            ethers.formatEther(
              minted.toString()
            )
          )}
          {/* &nbsp;
          {vaultType.toString()} */}
        </td>
        <td
          className={`${isLiquidated ? 'opacity-50' : ''}`}
        >
          ≈&nbsp;
          {/* {currencySymbol} */}
          {truncateToTwoDecimals(
            ethers.formatEther(
              claimableValue.toString()
            )
          )}
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
        <td className="text-right hidden md:table-cell">
          <LiquidationAction 
            vaultData={vault}
            hasFunds={hasFunds}
          />
        </td>
      </tr>
      <tr className="table-row md:hidden">
        <td colSpan="5">
          <LiquidationAction 
            vaultData={vault}
            hasFunds={hasFunds}
            className="w-full"
            refetchsUSD={refetchsUSD}
          />
        </td>
      </tr>
    </Fragment>
  );
};

export default LiquidationItem;