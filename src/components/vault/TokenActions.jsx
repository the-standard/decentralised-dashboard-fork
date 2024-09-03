import React from "react";
import { ethers } from "ethers";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import SwapModal from "./SwapModal";
import YieldModal from "./YieldModal";

const TokenActions = ({
  actionType,
  useAsset,
  closeModal,
  assets,
  vaultType,
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
              collateralValue={collateralValue}
              vaultType={vaultType}
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
              vaultType={vaultType}
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
              vaultType={vaultType}
            />
          </>
        );
        break;
      case 'YIELD':
        content = (
          <>
            <YieldModal
              open={actionType}
              closeModal={closeModal}          
              symbol={symbol}
              tokenAddress={tokenAddress}
              decimals={decimals}
              token={token}
              collateralValue={collateralValue}
              assets={assets}
              tokenTotal={amount}
              vaultType={vaultType}
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
