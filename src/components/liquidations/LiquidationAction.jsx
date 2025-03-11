import { useState, useEffect, useRef } from "react";
import {
  useReadContract,
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { toast } from 'react-toastify';

import {
  useSmartVaultV4ABIStore,
  useVaultManagerAbiStore,
  usesUSDContractAddressStore
} from "../../store/Store";

import Button from "../ui/Button";

const LiquidationAction = ( props ) => {
  const { vaultData, hasFunds, className, refetchsUSD } = props;
  const { smartVaultV4ABI } = useSmartVaultV4ABIStore();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const {
    arbitrumsUSDSepoliaContractAddress,
    arbitrumsUSDContractAddress,
  } = usesUSDContractAddressStore();
  
  const chainId = useChainId();

  const vaultAddress = vaultData?.status?.vaultAddress;
  const tokenId = vaultData?.tokenId;
  const isLiquidated = vaultData?.status?.liquidated;

  const sUSDVaultManagerAddress =
  chainId === arbitrumSepolia.id
    ? arbitrumsUSDSepoliaContractAddress
    : arbitrumsUSDContractAddress;

  const {
    data: undercollateralisedData,
    isLoading,
    isError,
    error
  } = useReadContract({
    abi: smartVaultV4ABI,
    address: vaultAddress,
    functionName: "undercollateralised",
    args: [],
  });

  const {
    writeContract,
    isError: isErrorLiquidate,
    isPending: isPendingLiquidate,
    isSuccess: isSuccessLiquidate
  } = useWriteContract();

  const handleLiquidate = async () => {
    try {
      writeContract({
        abi: vaultManagerAbi,
        address: sUSDVaultManagerAddress,
        functionName: "liquidateVault",
        args: [tokenId],
      });
    } catch (error) {
      let errorMessage = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was a problem');
    }
  }

  useEffect(() => {
    if (isPendingLiquidate) {
      // 
    } else if (isSuccessLiquidate) {
      toast.success('Vault liquidated successfully');
      refetchsUSD();
    } else if (isErrorLiquidate) {
      toast.error('There was a problem');
    }
  }, [
    isErrorLiquidate,
    isPendingLiquidate,
    isSuccessLiquidate,
  ]);
  
  return (
    <Button
      color="primary"
      loading={isLoading || isPendingLiquidate}
      disabled={
        isLoading ||
        !undercollateralisedData ||
        !hasFunds ||
        isPendingLiquidate ||
        isLiquidated
      }
      className={`min-w-[160px] ${className}`}
      onClick={() => handleLiquidate()}
    >
      {!isLoading ? (
        <>
          {isLiquidated ? (
            'Already Liquidated'
          ) : !undercollateralisedData ? (
            'Not Yet Liquidatable'
          ) : !hasFunds ? (
            'Not Enough Funds'
          ) : (
            'Liquidate'
          )}
        </>
      ) : null}
    </Button>
  );
};

export default LiquidationAction;