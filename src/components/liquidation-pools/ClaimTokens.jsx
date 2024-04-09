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
} from "../../store/Store";

import {
  Button,
  Card,
} from 'react-daisyui';

import Modal from "../ui/Modal";
import CenterLoader from "../ui/CenterLoader";

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
      <Card
        compact
        className="bg-base-100 shadow-md w-full"
      >
        <Card.Body>
          <Card.Title tag="h2" className="justify-between">
            Claimable Tokens
          </Card.Title>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
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

          <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              onClick={handleClaimRewards}
              disabled={noRewards}
            >
              Claim All Tokens
            </Button>
          </Card.Actions>

        </Card.Body>
      </Card>

      <Modal
        open={isOpen}
        closeModal={() => setIsOpen(false)}
      >
        <Card.Title tag="h2">
          Claiming Your Tokens
        </Card.Title>
        <CenterLoader />
      </Modal>
    </>
  )
};

export default ClaimTokens;
