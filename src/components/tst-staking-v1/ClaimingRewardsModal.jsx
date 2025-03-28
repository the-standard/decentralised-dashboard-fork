import { useState, useEffect, useRef } from "react";
import {
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { toast } from 'react-toastify';

import {
  useStakingPoolv3AddressStore,
  useStakingPoolv3AbiStore
} from "../../store/Store";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Typography from "../ui/Typography";
import CenterLoader from "../ui/CenterLoader";

const ClaimingRewardsModal = ({
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
  const chainId = useChainId();

  const stakingPoolv3Address = chainId === arbitrumSepolia.id ? arbitrumSepoliaStakingPoolv3Address :
  arbitrumStakingPoolv3Address;

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleApproveClaim = async () => {
    try {
      writeContract({
        abi: stakingPoolv3Abi,
        address: stakingPoolv3Address,
        functionName: "claim",
        args: [],
      });
    } catch (error) {
      let errorMessage = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was an error');
    }
  };

  useEffect(() => {
    if (isPending) {
      setClaimLoading(true);
    } else if (isSuccess) {
      toast.success('Success!');
      setClaimLoading(false);
      handleCloseModal();
    } else if (isError) {
      setShowError(true)
      setClaimLoading(false);
    }
  }, [
    isPending,
    isSuccess,
    isError,
    error,
  ]);

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
          <>
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
                    Reward Claim Unsuccessful
                  </Typography>
                  <Typography variant="p">
                    There was a problem processing your reward claim request.
                  </Typography>
                </div>

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
              </>
            )}
          </>
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
                Claiming Your Rewards
              </Typography>
              <CenterLoader />
            </>
          ) : (
            <>
              <div>
                <Typography variant="h2" className="card-title">
                  Claim Your Rewards
                </Typography>
                <Typography variant="p" className="mb-2">
                  Claiming your rewards will end your current staking period and restart a new one.
                </Typography>
              </div>
              <Button
                color="primary"
                onClick={handleApproveClaim}
              >
                Claim Rewards
              </Button>
              <Button
                color="ghost"
                onClick={handleCloseModal}
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

export default ClaimingRewardsModal;