import { useState, useEffect, useRef } from "react";
import {
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { ethers } from "ethers";
import { toast } from 'react-toastify';

import {
  useLiquidationPoolStore,
  useLiquidationPoolAbiStore
} from "../../store/Store";

import CenterLoader from "../ui/CenterLoader";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Typography from "../ui/Typography";
import Input from "../ui/Input";

const WithdrawModal = ({
  tstAmount,
  eurosAmount,
  pending,
  isOpen,
  handleCloseModal,
  wide,
}) => {
  const {
    arbitrumSepoliaLiquidationPoolAddress,
    arbitrumLiquidationPoolAddress,
  } = useLiquidationPoolStore();
  const { liquidationPoolAbi } = useLiquidationPoolAbiStore();
  const [claimLoading, setClaimLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [tstWithdrawAmount, setTstWithdrawAmount] = useState(0);
  const [eurosWithdrawAmount, setEurosWithdrawAmount] = useState(0);
  const chainId = useChainId();

  const tstInputRef = useRef(null);
  const eurosInputRef = useRef(null);

  const tstStakedAmount = tstAmount || 0n;
  const eurosStakedAmount = eurosAmount || 0n;

  const tstPending = pending['TST'] || 0n;
  const eurosPending = pending['EUROs'] || 0n;

  const tstAvailable = BigInt(tstStakedAmount) - BigInt(tstPending);
  const eurosAvailable = BigInt(eurosStakedAmount) - BigInt(eurosPending);

  const showTstPending = ethers.formatEther(tstPending.toString());
  const showEurosPending = ethers.formatEther(eurosPending.toString());

  const showTstAvailable = ethers.formatEther(tstAvailable.toString());
  const showEurosAvailable = ethers.formatEther(eurosAvailable.toString());

  const hasPending = (tstPending > 0) || (eurosPending > 0);

  const liquidationPoolAddress = chainId === arbitrumSepolia.id ? arbitrumSepoliaLiquidationPoolAddress :
  arbitrumLiquidationPoolAddress;

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleApproveWithdraw = async () => {
    try {
      writeContract({
        abi: liquidationPoolAbi,
        address: liquidationPoolAddress,
        functionName: "decreasePosition",
        args: [
          ethers.parseEther(tstWithdrawAmount.toString()),
          ethers.parseEther(eurosWithdrawAmount.toString()),
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
      toast.success("Success!");
      setClaimLoading(false);
      setTstWithdrawAmount(0);
      setEurosWithdrawAmount(0);
      handleCloseModal();
    } else if (isError) {
      toast.error('There was a problem');
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
    const formatBalance = ethers.formatEther(tstAvailable);
    tstInputRef.current.value = formatBalance;

    handleTstAmount({target: {value: formatBalance}});
  }

  const handleEurosAmount = (e) => {
    if (Number(e.target.value) < 10n ** 21n) {
      setEurosWithdrawAmount(Number(e.target.value));
    }
  };

  const handleEurosInputMax = () => {
    const formatBalance = ethers.formatEther(eurosAvailable);
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
          {claimLoading ? (
            <>
              <Typography variant="h2" className="card-title">Withdrawing Your Tokens</Typography>
              <CenterLoader />
            </>
          ) : (
            <>
              <Typography variant="h2" className="card-title">Withdraw Unsuccessful</Typography>
              <Typography variant="p">
                There was a problem processing your withdraw request.
              </Typography>
              <Typography variant="p" className="mb-4">
                It is possible that your withdraw request exceeds the amount of tokens you have staked, or some of your tokens are still being held for their initial 24 hour maturity period.
              </Typography>

              <Button
                onClick={() => setShowError(false)}
                color="ghost"
              >
                Return
              </Button>
              <Button
                onClick={() => {
                  setShowError(false);
                  handleCloseModal();
                }}
                color="ghost"
              >
                Cancel
              </Button>
            </>
          )}
        </Modal>
      </>
    )
  }

  return (
    <>
      <Modal
        open={isOpen}
        closeModal={handleCloseModal}
        wide={wide}
      >
        <>
          {claimLoading ? (
            <>
              <Typography variant="h2" className="card-title">Withdrawing Your Tokens</Typography>
              <CenterLoader />
            </>
          ) : (
            <>
              <Typography variant="h2" className="card-title"> Withdraw Your Tokens</Typography>

              {hasPending ? (
                <>
                  <div>
                    <Typography variant="p">
                      Parts of your position are still being held for a 24hour maturity period.
                    </Typography>
                  </div>
                  <div
                    className="flex justify-between align-center"
                  >
                    <Typography variant="p">
                      Pending TST:
                    </Typography>
                    <Typography variant="p">
                      {showTstPending || '0'}
                    </Typography>
                  </div>
                  <div
                    className="flex justify-between align-center"
                  >
                    <Typography variant="p">
                      Pending EUROs:
                    </Typography>
                    <Typography variant="p">
                      {showEurosPending || '0'}
                    </Typography>
                  </div>

                  <hr className="my-2" />
                </>
              ) : null}

              <div
                className="flex justify-between align-center"
              >
                <Typography variant="p">
                  Available TST:
                </Typography>
                <Typography variant="p">
                  {showTstAvailable || '0'}
                </Typography>
              </div>
              <div
                className="flex justify-between align-center"
              >
                <Typography variant="p">
                  Available EUROs:
                </Typography>
                <Typography variant="p">
                  {showEurosAvailable || '0'}
                </Typography>
              </div>

              <hr className="my-2"/>

              <div>
              <Typography variant="p" className="pb-2">
                TST Withdraw Amount:
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
                  variant="outline"
                  onClick={() => handleTstInputMax()}
                >
                  Max
                </Button>
              </div>

              <Typography variant="p" className="pb-2">
                EUROs Withdraw Amount:
              </Typography>
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
                  variant="outline"
                  onClick={() => handleEurosInputMax()}
                >
                  Max
                </Button>
              </div>

              </div>
              <Button
                onClick={handleApproveWithdraw}
                color="primary"
                disabled={!(tstWithdrawAmount > 0) && !(eurosWithdrawAmount > 0)}
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

export default WithdrawModal;