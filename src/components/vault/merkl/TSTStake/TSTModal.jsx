import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import {
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useMerklTSTStakeStage,
} from "../../../../store/Store";

import Modal from "../../../ui/Modal";
import Button from "../../../ui/Button";
import Typography from "../../../ui/Typography";
import TokenIcon from "../../../ui/TokenIcon";
import CenterLoader from "../../../ui/CenterLoader";

import TSTModalClaim from "./TSTModalClaim";
import TSTModalWithdraw from "./TSTModalWithdraw";
import TSTModalStake from "./TSTModalStake";

const TSTModal = (props) => {
  const {
    open,
    closeModal,
    useAssets,
    merklData,
    merklBalancesLoading,
  } = props;

  const navigate = useNavigate();

  const {
    merklTSTStakeStage,
    setMerklTSTStakeStage,
  } = useMerklTSTStakeStage();

  useEffect(() => {
    setMerklTSTStakeStage('CLAIM');
  }, []);


  let symbol = '';
  let decimals = 0;
  let tokenAddress = '';
  let balanceRaw = 0n;
  let balance = 0n;
  let unclaimed = 0;
  let merklTST;

  if (merklData && merklData.length) {
    merklTST = merklData.find(item => item?.symbol === 'TST');
  }

  if (merklTST) {
    symbol = merklTST?.symbol;
    decimals = merklTST?.decimals;
    balanceRaw = merklTST?.balanceOf;
    tokenAddress = merklTST?.tokenAddress;
    unclaimed = merklTST?.unclaimed;
    balance = ethers.formatUnits(balanceRaw, decimals);  
  }

  switch (merklTSTStakeStage) {
    case 'CLAIM':
      return (
        <Modal
          open={open}
          closeModal={closeModal}
        >
          <TSTModalClaim
            closeModal={closeModal}
            useAssets={merklTST ? [merklTST] : []}
            unclaimed={unclaimed}
            merklBalancesLoading={merklBalancesLoading}
          />
        </Modal>
      );
    case 'WITHDRAW':
      return (
        <Modal
          open={open}
          closeModal={closeModal}
        >
          <TSTModalWithdraw
            closeModal={closeModal}
            balanceRaw={balanceRaw}
            tokenAddress={tokenAddress}
          />
        </Modal>
      );
    case 'STAKE':
      return (
        <Modal
          open={open}
          closeModal={closeModal}
        >
          <TSTModalStake
            closeModal={closeModal}
            balanceRaw={balanceRaw}
          />
        </Modal>
      );
    case 'SUCCESS':
      return (
        <Modal
          open={open}
          closeModal={closeModal}
        >
            <>
              <Typography variant="h2" className="card-title">
                <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
                TST Staked Successfully
              </Typography>
    
              <Typography
                variant="p"
              >
                Your Merkl reward TST has been successfully deposited into the staking pool.
              </Typography>
      
              <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
                <Button
                  className="w-full lg:w-auto"
                  color="ghost"
                  onClick={closeModal}
                >
                  Close
                </Button>
                <Button
                  className="w-full lg:w-auto"
                  color="ghost"
                  onClick={() => navigate("/staking-pool")}
                >
                  View Staking Pool
                </Button>
              </div>
            </>
        </Modal>
      );
    case 'CLAIM_ERROR':
      return (
        <Modal
          open={open}
          closeModal={closeModal}
        >
            <>
              <Typography variant="h2" className="card-title">
                <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
                Stake Your TST
              </Typography>
    
              <Typography
                variant="p"
              >
                Unfortunately there was a problem while claiming your TST tokens.
              </Typography>
      
              <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
                <Button
                  className="w-full lg:w-auto"
                  color="ghost"
                  onClick={closeModal}
                >
                  Close
                </Button>
              </div>
            </>
        </Modal>
      );  
    case 'WITHDRAW_ERROR':
      return (
        <Modal
          open={open}
          closeModal={closeModal}
        >
            <>
              <Typography variant="h2" className="card-title">
                <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
                Stake Your TST
              </Typography>
    
              <Typography
                variant="p"
              >
                Unfortunately there was a problem with withdrawing your TST tokens to be staked.
              </Typography>

              <Typography
                variant="p"
              >
                You can attempt to stake them again.
              </Typography>
      
              <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
                <Button
                  className="w-full lg:w-auto"
                  color="ghost"
                  onClick={closeModal}
                >
                  Close
                </Button>
              </div>
            </>
        </Modal>
      );  
    case 'STAKE_ERROR':
      return (
        <Modal
          open={open}
          closeModal={closeModal}
        >
            <>
              <Typography variant="h2" className="card-title">
                <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
                Stake Your TST
              </Typography>
    
              <Typography
                variant="p"
              >
                Unfortunately there was a problem with staking your TST.
              </Typography>

              <Typography
                variant="p"
              >
                Your tokens may now be in your wallet. If so, you can continue staking them at the staking pool.
              </Typography>
      
              <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
                <Button
                  className="w-full lg:w-auto"
                  color="ghost"
                  onClick={closeModal}
                >
                  Close
                </Button>
                <Button
                  className="w-full lg:w-64"
                  color="success"
                  onClick={closeModal}
                  wide
                >
                  Staking Pool
                </Button>
              </div>
            </>
        </Modal>
      );    
    default:
      return (
        <>
          <Modal
            open={open}
            closeModal={closeModal}
          >
            <>
              <Typography variant="h2" className="card-title">
                <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
                Stake Your TST
              </Typography>
    
              <Typography
                variant="p"
              >
                Unfortunately there was a problem staking your TST tokens.
              </Typography>
      
              <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
                <Button
                  className="w-full lg:w-auto"
                  color="ghost"
                  onClick={closeModal}
                >
                  Close
                </Button>
              </div>
            </>
          </Modal>
        </>
      );
  }
};

export default TSTModal;