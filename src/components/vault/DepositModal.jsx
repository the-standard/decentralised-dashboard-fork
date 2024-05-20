import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
  useBalance,
  useWatchBlockNumber
} from "wagmi";
import { sendTransaction } from "@wagmi/core";
import {
  ArrowUpCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useErc20AbiStore,
} from "../../store/Store";

import wagmiConfig from "../../WagmiConfig";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import Input from "../ui/Input";

const DepositModal = (props) => {
  const {
    open,
    closeModal,
    symbol,
    tokenAddress,
    decimals,
  } = props;

  const [amount, setAmount] = useState(0);
  const [maxBal, setMaxBal] = useState(0);

  const { vaultAddress } = useVaultAddressStore();
  const { erc20Abi } = useErc20AbiStore();
  const [txdata, setTxdata] = useState(null);

  const { address } = useAccount();

  const balanceReqData = {
    address: address,
  };

  if (tokenAddress !== ethers.ZeroAddress) {
    balanceReqData.token = tokenAddress;
  }
  const { data: balanceData, refetch } = useBalance(balanceReqData);

  useWatchBlockNumber({
    onBlockNumber() {
      refetch();
    },
  })

  const walletBalance = balanceData?.value;

  const inputRef = useRef(null);

  useEffect(() => {
    getMaxBalance();
  }, [walletBalance]);

  const handleAmount = (e) => {
    if (Number(e.target.value) < 10n ** 21n) {
      setAmount(ethers.parseUnits(e.target.value.toString(), decimals))
    }
  };
  
  const { writeContract, isError, isPending, isSuccess } = useWriteContract();

  const handleDepositToken = async () => {
    try {
      writeContract({
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "transfer",
        args: [vaultAddress, amount],
      });
    } catch (error) {
      let errorMessage;
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was a problem');
    }
  };

  const getMaxBalance = async () => {
    const formatted = ethers.formatUnits((walletBalance || 0).toString(), decimals);
    setMaxBal(Number(formatted));
  };

  const handleMaxBalance = async () => {
    const formatted = ethers.formatUnits((walletBalance || 0).toString(), decimals);
    inputRef.current.value = formatted;
    handleAmount({ target: { value: formatted } });
  };

  const depositEther = async () => {
    try {
      const txAmount = amount;
      const toAddress = vaultAddress;
      const hash = await sendTransaction(wagmiConfig, {
        account: address,
        to: toAddress,
        value: txAmount,
      })
      setTxdata(hash);
      inputRef.current.value = "";
      inputRef.current.focus();
    } catch (error) {
      console.log(error);
      let errorMessage;
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was a problem');
    }
  };

  const depositViaMetamask = async () => {
    if (symbol === "ETH" || symbol === "AGOR") {
      try {
        depositEther();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        handleDepositToken();
      } catch (error) {
        console.log(error);
        let errorMessage;
        if (error && error.shortMessage) {
          errorMessage = error.shortMessage;
        }
        toast.error(errorMessage || 'There was a problem');  
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }
  };

  const {
    data: txRcptData,
  } = useWaitForTransactionReceipt({
    hash: txdata,
  });

  useEffect(() => {
    if (isPending) {
      // 
    } else if (isSuccess) {
      inputRef.current.value = "";
      inputRef.current.focus();
      toast.success("Deposit Successful");
      setTxdata(txRcptData);
    } else if (isError) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [
    isPending,
    isSuccess,
    isError,
  ]);
    
  return (
    <>
      <Modal
        open={open}
        closeModal={closeModal}
      >
        <Typography variant="h2" className="card-title">
          <ArrowUpCircleIcon className="mr-2 h-6 w-6 inline-block"/>
          Deposit {symbol}
        </Typography>

        <div role="alert" className="alert alert-warning bg-yellow-400/20 mb-2">
          <span>
            <b>Only send coins on Arbitrum</b>.
            <br/>
            Deposits from other chains will be lost.
          </span>
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
          {symbol !== "ETH" && symbol !== "AGOR" && (
            <Button
              className="join-item"
              onClick={handleMaxBalance}
              disabled={isPending}
            >
              Max
            </Button>
          )}
        </div>
        <div>
          Available Balance: {maxBal || '0'} {symbol || ''}
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
            onClick={depositViaMetamask}
            loading={isPending}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DepositModal;