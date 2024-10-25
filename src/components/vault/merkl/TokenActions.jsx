import React from "react";
import { ethers } from "ethers";
import WithdrawModal from "./WithdrawModal";

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
    const claimedRaw = useAsset?.accumulated;
    const unclaimedRaw = useAsset?.unclaimed;

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
              claimed={claimed}
              unclaimed={unclaimed}
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
