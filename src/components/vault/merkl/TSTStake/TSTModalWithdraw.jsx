import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useSmartVaultABIStore,
  useMerklTSTStakeStage,
} from "../../../../store/Store";

import Modal from "../../../ui/Modal";
import Button from "../../../ui/Button";
import Typography from "../../../ui/Typography";
import CenterLoader from "../../../ui/CenterLoader";
import Input from "../../../ui/Input";

const TSTModalWithdraw = (props) => {
  const {
    open,
    closeModal,
    tokenAddress,
    balanceRaw,
  } = props;

  const isFirstMount = useRef(true);

  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();
  const {
    merklTSTStakeStage,
    setMerklTSTStakeStage,
  } = useMerklTSTStakeStage();

  const { address } = useAccount();

  const {
    writeContract,
    data: txHash,
    isError,
    isPending,
    isSuccess,
    error,
  } = useWriteContract();

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 4,
  });

  const handleWithdrawToken = async () => {
    console.log('handle')
    try {
      writeContract({
        abi: smartVaultABI,
        address: vaultAddress,
        functionName: "removeAsset",
        args: [
          tokenAddress,
          balanceRaw,
          address,
        ],
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
    // if (isFirstMount.current) {
    //   isFirstMount.current = false;
    //   return;
    // }
    handleWithdrawToken();
  }, []);

  useEffect(() => {
    if (isPending) {
      // 
    } else if (isSuccess) {
      // toast.success("Tokens Withdrawn Successfully");
      // setMerklTSTStakeStage('STAKE');
    } else if (isError) {
      console.log(error)
      toast.error('There was a problem');
      setMerklTSTStakeStage('WITHDRAW_ERROR');
    }
  }, [
    isPending,
    isSuccess,
    isError,
    error,
  ]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Tokens Withdrawn Successfully");
      setMerklTSTStakeStage('STAKE')
    }
  }, [
    isConfirming,
    isConfirmed,
  ]);

  let withdrawStage = '';

  if (isPending && !isConfirming) {
    withdrawStage = 'Attempting withdrawal';
  }
  if (isConfirming) {
    withdrawStage = 'Confirming withdrawal transaction';
  }

  console.log({isPending}, {isConfirming}, {isSuccess}, {isError}, {error}, {isFirstMount})

  return (
    <>
      <Typography variant="h2" className="card-title">
        <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
        Withdrawing TST 2/3
      </Typography>
      <CenterLoader
        label={withdrawStage}
      />
    </>
  );
};

export default TSTModalWithdraw;