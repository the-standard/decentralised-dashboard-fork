import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';

import {
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import {
  useLiquidationPoolAbiStore,
  useLiquidationPoolStore,
} from "../../../store/Store";

import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CenterLoader from "../../ui/CenterLoader";
import Typography from "../../ui/Typography";

const ClaimTokens = ({
  loading,
  rewards,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const chainId = useChainId();

  const { liquidationPoolAbi } = useLiquidationPoolAbiStore();
  
  const {
    arbitrumSepoliaLiquidationPoolAddress,
    arbitrumLiquidationPoolAddress,
  } = useLiquidationPoolStore();

  const liquidationPoolAddress =
  chainId === arbitrumSepolia.id
    ? arbitrumSepoliaLiquidationPoolAddress
    : arbitrumLiquidationPoolAddress;

  const { writeContract, isError, isPending, isSuccess } = useWriteContract();

  const handleClaimRewards = async () => {
    setIsOpen(true);
    try {
      writeContract({
        abi: liquidationPoolAbi,
        address: liquidationPoolAddress,
        functionName: "claimRewards",
        args: [],
      });
    } catch (error) {
      let errorMessage = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was a problem');
    }
  };
  
  useEffect(() => {
    if (isPending) {
      // 
    } else if (isSuccess) {
      toast.success('Claimed Tokens Successfully!');
      setIsOpen(false)
    } else if (isError) {
      toast.error('There was a problem');
      setIsOpen(false)
    }
  }, [
    isPending,
    isSuccess,
    isError,
  ]);

  let noRewards = true;
  if (rewards.some(e => e.amount > 0)) {
    noRewards = false;
  }

  const isLoading = loading;

  return (
    <>
      <Card className="card-compact w-full">
        <div className="card-body">
          <Typography variant="h2" className="card-title justify-between">
            Claimable Tokens
          </Typography>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Amount</th>
                </tr>
              </thead>
              {isLoading ? (null) : (
                <tbody>
                  {rewards.map(function(asset, index) {
                    const amount = asset?.amount;
                    const decimals = asset?.dec;
                    const symbol = ethers.decodeBytes32String(asset?.symbol);
                    return(
                      <tr key={index}>
                        <td>
                          {symbol}
                        </td>
                        <td>
                          {ethers.formatUnits(amount, decimals)}
                        </td>
                      </tr>
                    )}
                  )}
                </tbody>
              )}
            </table>
            {isLoading ? (
              <CenterLoader slim />
            ) : (null)}
          </div>

          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              onClick={handleClaimRewards}
              disabled={noRewards}
            >
              Claim All Tokens
            </Button>
          </div>

        </div>
      </Card>

      <Modal
        open={isOpen}
        closeModal={() => setIsOpen(false)}
      >
        <Typography variant="h2" className="card-title justify-between">
          Claiming Your Tokens
        </Typography>
        <CenterLoader />
      </Modal>
    </>
  )
};

export default ClaimTokens;
