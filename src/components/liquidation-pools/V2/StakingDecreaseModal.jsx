import { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';

import {
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { formatEther, parseEther } from "viem";

import {
  useStakingPoolv2AddressStore,
  useStakingPoolv2AbiStore
} from "../../../store/Store";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Typography from "../../ui/Typography";
import Input from "../../ui/Input";
import CenterLoader from "../../ui/CenterLoader";

const StakingDecreaseModal = ({
  stakedPositions,
  isOpen,
  handleCloseModal,
}) => {
  const {
    arbitrumSepoliaStakingPoolv2Address,
    arbitrumStakingPoolv2Address,
  } = useStakingPoolv2AddressStore();
  const { stakingPoolv2Abi } = useStakingPoolv2AbiStore();
  const [claimLoading, setClaimLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [tstWithdrawAmount, setTstWithdrawAmount] = useState(0);
  const [eurosWithdrawAmount, setEurosWithdrawAmount] = useState(0);
  const chainId = useChainId();

  const tstInputRef = useRef(null);
  const eurosInputRef = useRef(null);

  const tstPosition = stakedPositions?.find((item) => item.asset === 'TST');
  const eurosPosition = stakedPositions?.find((item) => item.asset === 'EUROs');

  const tstStakedAmount = tstPosition?.amount;
  const eurosStakedAmount = eurosPosition?.amount;

  const useTstStakedAmount = formatEther(tstStakedAmount.toString());
  const useEurosStakedAmount = formatEther(eurosStakedAmount.toString());

  const stakingPoolv2Address = chainId === arbitrumSepolia.id ? arbitrumSepoliaStakingPoolv2Address :
  arbitrumStakingPoolv2Address;

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleApproveWithdraw = async () => {
    try {
      writeContract({
        abi: stakingPoolv2Abi,
        address: stakingPoolv2Address,
        functionName: "decreaseStake",
        args: [
          parseEther(tstWithdrawAmount.toString()),
          parseEther(eurosWithdrawAmount.toString()),
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
      setEurosWithdrawAmount(0);
      handleCloseModal();
    } else if (isError) {
      setShowError(true)
      setClaimLoading(false);
      setTstWithdrawAmount(0);
      setEurosWithdrawAmount(0);
    }
  }, [
    isPending,
    isSuccess,
    isError,
    error,
  ]);

  const handleTstAmount = (e) => {
    if (Number(e.target.value) < 10n ** 21n) {
      setTstWithdrawAmount(Number(e.target.value));
    }
  };

  const handleTstInputMax = () => {
    const formatBalance = formatEther(tstStakedAmount);
    tstInputRef.current.value = formatBalance;
    handleTstAmount({target: {value: formatBalance}});
  }

  const handleEurosAmount = (e) => {
    if (Number(e.target.value) < 10n ** 21n) {
      setEurosWithdrawAmount(Number(e.target.value));
    }
  };

  const handleEurosInputMax = () => {
    const formatBalance = formatEther(eurosStakedAmount);
    eurosInputRef.current.value = formatBalance;
    handleEurosAmount({target: {value: formatBalance}});
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

                <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
                  <Button
                    onClick={() => setShowError(false)}
                  >
                    Return
                  </Button>
                  <Button
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
        <div>
          {claimLoading ? (
            <>
              <Typography variant="h2" className="card-title">
                Claiming Your Rewards
              </Typography>
              <CenterLoader />
            </>
          ) : (
            <>
              <div>
                <Typography variant="h2" className="card-title">
                  Withdraw Your Tokens
                </Typography>
                <Typography variant="p" className="mb-2">
                  Here you can reduce your position by withdrawing your tokens.
                </Typography>
                <Typography variant="p" className="mb-2">
                  Any withdrawals will automatically claim your existing rewards, ending your current staking period and restarting a new one.
                </Typography>
                <hr className="my-2" />
              </div>

              <div
                className="flex flex-row mb-2 items-center justify-start"
              >
                <Typography variant="p">
                  Available TST:
                </Typography>
                <Typography variant="p">
                  {useTstStakedAmount || '0'}
                </Typography>
              </div>
              <div
                className="flex flex-row mb-2 items-center justify-start"
              >
                <Typography variant="p">
                  Available EUROs:
                </Typography>
                <Typography variant="p">
                  {useEurosStakedAmount || '0'}
                </Typography>
              </div>

              <hr className="my-2" />

              <Typography variant="p" className="mb-2">
                Withdraw Amounts:
              </Typography>
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
                  onClick={() => handleTstInputMax()}
                >
                  Max
                </Button>
              </div>
              <div
                className="join w-full mb-4"
              >
                <Input
                  className="join-item w-full"
                  placeholder="EUROs Amount"
                  type="number"
                  onChange={handleEurosAmount}
                  useRef={eurosInputRef}
                />
                <Button
                  className="join-item"
                  onClick={() => handleEurosInputMax()}
                >
                  Max
                </Button>
              </div>
              <div className="card-actions flex flex-row justify-end">
                <Button
                  className="w-full"
                  onClick={handleApproveWithdraw}
                  disabled={!(tstWithdrawAmount > 0) && !(eurosWithdrawAmount > 0)}
                >
                  Withdraw
                </Button>
                <Button
                  className="w-full"
                  wide
                  onClick={handleCloseModal}
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
};

export default StakingDecreaseModal;
