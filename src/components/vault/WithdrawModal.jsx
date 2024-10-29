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
} from "../../store/Store";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import Input from "../ui/Input";

const WithdrawModal = (props) => {
  const {
    open,
    closeModal,
    symbol,
    decimals,
    collateralValue,
  } = props;

  const [amount, setAmount] = useState(0n);

  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();

  const [txdata, setTxdata] = useState(null);

  const { address } = useAccount();
  const inputRef = useRef(null);

  const handleAmount = (e) => {
    setAmount(ethers.parseUnits(e.target.value.toString(), decimals))
  };

  const { writeContract, isError, isPending, isSuccess } = useWriteContract();

  const handleWithdrawCollateralNative = async () => {
    try {
      writeContract({
        abi: smartVaultABI,
        address: vaultAddress,
        functionName: "removeCollateralNative",
        args: [
          amount,
          address
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

  const handleWithdrawCollateral = async () => {
    try {
      writeContract({
        abi: smartVaultABI,
        address: vaultAddress,
        functionName: "removeCollateral",
        args: [
          ethers.encodeBytes32String(symbol),
          amount,
          address
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

  const formatPrevTotal = collateralValue;
  const formatAmount = ethers.formatUnits(amount);
  const formatNewTotal = ethers.formatUnits(ethers.parseUnits(formatPrevTotal, decimals) - amount);

  useEffect(() => {
    if (isPending) {
      // 
    } else if (isSuccess) {
      inputRef.current.value = "";
      inputRef.current.focus();
      setTxdata(txRcptData);
      toast.success("Withdraw Successful");
      setAmount(0n);
      closeModal();
      try {
        plausible('CollateralWithdraw', {
          props: {
            CollateralWithdrawToken: symbol,
            CollateralWithdrawAmount: formatAmount,
            CollateralWithdrawPreviousTotal: formatPrevTotal,
            CollateralWithdrawNewTotal: formatNewTotal,
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else if (isError) {
      inputRef.current.value = "";
      inputRef.current.focus();
      toast.error('There was an error');
      setAmount(0n);
    }
  }, [
    isPending,
    isSuccess,
    isError,
  ]);

  const shortenAddress = (address) => {
    const prefix = address?.slice(0, 6);
    const suffix = address?.slice(-8);
    return `${prefix}...${suffix}`;
  };

  const shortenedAddress = shortenAddress(address);

  const {
    data: txRcptData,
  } = useWaitForTransactionReceipt({
    hash: txdata,
  });

  const handleMaxBalance = async () => {
    const formatted = collateralValue;
    inputRef.current.value = formatted;
    handleAmount({ target: { value: formatted } });
  };

  return (
    <>
      <Modal
        open={open}
        closeModal={closeModal}
      >
        <>
          <Typography variant="h2" className="card-title">
            <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
            Withdraw {symbol}
          </Typography>

          <div className="flex justify-between">
            <Typography
              variant="p"
            >
              Withdraw Amount
            </Typography>
            <Typography
              variant="p"
              className="text-right"
            >
              Available: {collateralValue || ''}
            </Typography>
          </div>
          <div
            className="join"
          >
            <Input
              className="join-item w-full"
              useRef={inputRef}
              type="number"
              onChange={handleAmount}
              placeholder="Amount"
              disabled={isPending}
            />
            <Button
              className="join-item"
              variant="outline"
              onClick={handleMaxBalance}
              disabled={isPending}
            >
              Max
            </Button>

          </div>
          <div>
            {symbol} to address "{shortenedAddress}"
          </div>

          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-auto"
              color="ghost"
              onClick={closeModal}
              disabled={isPending}
            >
              Close
            </Button>
            <Button
              className="w-full lg:w-64"
              color="success"
              disabled={!amount || isPending}
              onClick={
                symbol === "ETH" || symbol === "AGOR"
                ? handleWithdrawCollateralNative
                : handleWithdrawCollateral          
              }
              loading={isPending}
              wide
            >
              Confirm
            </Button>
          </div>
        </>
      </Modal>
    </>
  );
};

export default WithdrawModal;