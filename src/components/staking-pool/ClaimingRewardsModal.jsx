import { useState, useEffect, useRef } from "react";
import {
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { toast } from 'react-toastify';

import {
  useStakingPoolv2AddressStore,
  useStakingPoolv2AbiStore
} from "../../store/Store";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Typography from "../ui/Typography";
import CenterLoader from "../ui/CenterLoader";
import Checkbox from "../ui/Checkbox";

const ClaimingRewardsModal = ({
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
  const [compound, setCompound] = useState(false);
  const chainId = useChainId();

  const stakingPoolv2Address = chainId === arbitrumSepolia.id ? arbitrumSepoliaStakingPoolv2Address :
  arbitrumStakingPoolv2Address;

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleApproveClaim = async () => {
    try {
      writeContract({
        abi: stakingPoolv2Abi,
        address: stakingPoolv2Address,
        functionName: "claim",
        args: [compound],
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
      toast.success(errorMessage || 'Success!');
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
                <Typography variant="p" className="mb-2">
                  By opting to compound your EUROs rewards, those EUROs will be added to the EUROs in your new stake.
                </Typography>
                <div className="mb-2">
                  <Checkbox
                    checked={compound}
                    onChange={() => setCompound(!compound)}
                    label="I would like to compound my EUROs rewards"
                  />
                </div>
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