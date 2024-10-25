import React from "react";
import { ethers } from "ethers";
import WithdrawModal from "./WithdrawModal";
import ClaimModal from "./ClaimModal";

const TokenActions = ({
  actionType,
  useAsset,
  closeModal,
  vaultType,
}) => {
  let content;

  if (useAsset) {
    const symbol = useAsset?.symbol;
    const decimals = useAsset?.decimals;
    const balanceRaw = useAsset?.balanceOf;
    const claimedRaw = useAsset?.accumulated;
    const unclaimedRaw = useAsset?.unclaimed;
    const tokenAddress = useAsset?.tokenAddress;

    const balance = ethers.formatUnits(balanceRaw, decimals);
    const claimed = ethers.formatUnits(claimedRaw, decimals);
    const unclaimed = ethers.formatUnits(unclaimedRaw, decimals);

    switch (actionType) {
      case 'WITHDRAW':
        content = (
          <>
            <WithdrawModal
              open={actionType}
              closeModal={closeModal}          
              symbol={symbol}
              decimals={decimals}
              balance={balance}
              tokenAddress={tokenAddress}
              vaultType={vaultType}
            />
          </>
        );
        break;
      case 'CLAIM':
        content = (
          <>
            <ClaimModal
              open={actionType}
              closeModal={closeModal}          
              useAssets={[useAsset]}
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
