import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  Button,
  Card,
} from 'react-daisyui';
import {
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useSmartVaultABIStore,
} from "../../store/Store";

import Modal from "../Modal.jsx";

const WithdrawModal = (props) => {
  const {
    open,
    closeModal,
    symbol,
    decimals,
    collateralValue,
  } = props;

  const [amount, setAmount] = useState(0);

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
      toast.error(errorMessage || 'There was an error1');
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
      toast.error(errorMessage || 'There was an error2');
    }
  };

  useEffect(() => {
    if (isPending) {
      // 
    } else if (isSuccess) {
      inputRef.current.value = "";
      inputRef.current.focus();
      setTxdata(txRcptData);
      toast.success("Withdraw Successful");
    } else if (isError) {
      inputRef.current.value = "";
      inputRef.current.focus();
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
          <Card.Title tag="h2">
            <ArrowDownCircleIcon className="h-6 w-6 inline-block"/>
            Withdraw {symbol}
          </Card.Title>

          <div
            className="join"
          >
            <input
              className="input input-bordered join-item w-full"
              ref={inputRef}
              type="number"
              onChange={handleAmount}
              placeholder="Amount"
              disabled={isPending}
            />
            <Button
              className="join-item"
              onClick={handleMaxBalance}
              disabled={isPending}
            >
              Max
            </Button>
            {/* input */}

          </div>
          <div>
            {symbol} to address "{shortenedAddress}"
          </div>

          <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
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
          </Card.Actions>
        </>
      </Modal>
    </>
  );
};

export default WithdrawModal;