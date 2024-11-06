import { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';

import {
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { formatEther, parseEther } from "viem";

import {
  useStakingPoolv3AddressStore,
  useStakingPoolv3AbiStore
} from "../../store/Store";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Typography from "../ui/Typography";
import Input from "../ui/Input";
import CenterLoader from "../ui/CenterLoader";

const StakingDecreaseModal = ({
  stakedPositions,
  isOpen,
  handleCloseModal,
}) => {
  const {
    arbitrumSepoliaStakingPoolv3Address,
    arbitrumStakingPoolv3Address,
  } = useStakingPoolv3AddressStore();
  const { stakingPoolv3Abi } = useStakingPoolv3AbiStore();
  const [claimLoading, setClaimLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [tstWithdrawAmount, setTstWithdrawAmount] = useState(0);
  const chainId = useChainId();

  const tstInputRef = useRef(null);

  const tstPosition = stakedPositions?.find((item) => item.asset === 'TST');

  const tstStakedAmount = tstPosition?.amount;

  const useTstStakedAmount = formatEther(tstStakedAmount.toString());

  const stakingPoolv3Address = chainId === arbitrumSepolia.id ? arbitrumSepoliaStakingPoolv3Address :
  arbitrumStakingPoolv3Address;

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleApproveWithdraw = async () => {
    try {
      writeContract({
        abi: stakingPoolv3Abi,
        address: stakingPoolv3Address,
        functionName: "decreaseStake",
        args: [
          tstWithdrawAmount,
        ],
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
      setClaimLoading(true);
    } else if (isSuccess) {
      toast.success('Success!');
      setClaimLoading(false);
      setTstWithdrawAmount(0);
      handleCloseModal();
    } else if (isError) {
      setShowError(true)
      setClaimLoading(false);
      setTstWithdrawAmount(0);
    }
  }, [
    isPending,
    isSuccess,
    isError,
    error,
  ]);

  const handleTstAmount = (e) => {
    if (Number(e.target.value) < 10n ** 21n) {
      setTstWithdrawAmount(parseEther(e.target.value.toString()));
    }
  };

  const handleTstInputMax = () => {
    const formatBalance = formatEther(tstStakedAmount);
    tstInputRef.current.value = formatBalance;
    handleTstAmount({target: {value: formatBalance}});
  }

  if (showError) {
    return (
      <>
        <Modal
          open={isOpen}
          closeModal={() => {
            setShowError(false);
            handleCloseModal();
          }}
        >
          <div>
            {claimLoading ? (
                <>
                <Typography variant="h2" className="card-title">
                  Withdrawing Your Tokens
                </Typography>
                <CenterLoader />
              </>
            ) : (
              <>
                <div>
                  <Typography variant="h2" className="card-title">
                    Withdraw Unsuccessful
                  </Typography>
                  <Typography variant="p" className="mb-2">
                    There was a problem processing your withdraw request.
                  </Typography>
                  <Typography variant="p" className="mb-2">
                    It is possible that your withdraw request exceeds the amount of tokens you have staked.
                  </Typography>
                </div>

                <div className="card-actions flex flex-row justify-end">
                  <Button
                    color="primary"
                    onClick={() => setShowError(false)}
                  >
                    Return
                  </Button>
                  <Button
                    color="ghost"
                    onClick={() => {
                      setShowError(false);
                      handleCloseModal();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      </>
    )
  }

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          handleCloseModal();
        }}
      >
        <>
          {claimLoading ? (
            <>
              <Typography variant="h2" className="card-title">
                Withdrawing & Claiming Your Rewards
              </Typography>
              <CenterLoader />
            </>
          ) : (
            <>
              <div>
                <Typography variant="h2" className="card-title">
                  Withdraw Your Staked TST
                </Typography>
                <Typography variant="p" className="mb-2">
                  Here you can reduce your position by withdrawing your TST.
                </Typography>
                <Typography variant="p" className="mb-2">
                  Any withdrawals will automatically claim your existing rewards, ending your current staking period and restarting a new one.
                </Typography>
              </div>

              <div className="flex justify-between">
                <Typography
                  variant="p"
                  className="pb-2"
                >
                  TST Withdraw Amount
                </Typography>
                <Typography
                  variant="p"
                  className="text-right"
                >
                  Available: {useTstStakedAmount || '0'}
                </Typography>
              </div>

              <div
                className="join w-full mb-4"
              >
                <Input
                  className="join-item w-full"
                  placeholder="TST Amount"
                  type="number"
                  onChange={handleTstAmount}
                  useRef={tstInputRef}
                />
                <Button
                  className="join-item"
                  variant="outline"
                  onClick={() => handleTstInputMax()}
                >
                  Max
                </Button>
              </div>
              <Button
                onClick={handleApproveWithdraw}
                color="primary"
                disabled={!(tstWithdrawAmount > 0)}
              >
                Withdraw
              </Button>
              <Button
                onClick={handleCloseModal}
                color="ghost"
              >
                Cancel
              </Button>
            </>
          )}
        </>
      </Modal>
    </>
  )
};

export default StakingDecreaseModal;
