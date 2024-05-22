import React from "react";
import { ethers } from "ethers";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import SwapModal from "./SwapModal";

const TokenActions = ({
  actionType,
  useAsset,
  closeModal,
  assets,
}) => {
  let content;

  if (useAsset) {
    const symbol = ethers.decodeBytes32String(useAsset.token.symbol);
    const tokenAddress = useAsset.token.addr;
    const decimals = useAsset.token.dec;
    const token = useAsset.token;
    const amount = useAsset?.amount.toString();
    const collateralValue = ethers.formatUnits(amount, decimals);

    switch (actionType) {
      case 'DEPOSIT':
        content = (
          <>
            <DepositModal
              open={actionType}
              closeModal={closeModal}
              symbol={symbol}
              tokenAddress={tokenAddress}
              decimals={decimals}
              token={token}
            />
          </>
        );
        break;
      case 'WITHDRAW':
        content = (
          <>
            <WithdrawModal
              open={actionType}
              closeModal={closeModal}          
              symbol={symbol}
              tokenAddress={tokenAddress}
              decimals={decimals}
              token={token}
              collateralValue={collateralValue}
            />
          </>
        );
        break;
      case 'SWAP':
        content = (
          <>
            <SwapModal
              open={actionType}
              closeModal={closeModal}          
              symbol={symbol}
              tokenAddress={tokenAddress}
              decimals={decimals}
              token={token}
              collateralValue={collateralValue}
              assets={assets}
              tokenTotal={amount}
            />
          </>
        );
        break;
      default:
        content = <></>;
        break;
    }
  
    return <>{content}</>;  
  }

  return <></>;  
};

export default TokenActions;
