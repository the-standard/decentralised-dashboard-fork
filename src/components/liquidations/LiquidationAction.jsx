import { useState, useEffect, useRef } from "react";
import {
  useReadContract,
} from "wagmi";

import {
  useSmartVaultV4ABIStore,
} from "../../store/Store";

import Button from "../ui/Button";

const LiquidationAction = ( props ) => {
  const { vaultData, hasFunds } = props;
  const { smartVaultV4ABI } = useSmartVaultV4ABIStore();

  const vaultAddress = vaultData?.status?.vaultAddress;

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
  
  return (
    <Button
      color="primary"
      loading={isLoading}
      disabled={isLoading || !undercollateralisedData || !hasFunds}
      className="min-w-[160px]"
      // onClick={handleLetsStake}
    >
      {!isLoading ? (
        <>
          {!undercollateralisedData ? (
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