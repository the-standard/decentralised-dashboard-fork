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
  DocumentDuplicateIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';
import QRCode from "react-qr-code";

import {
  useVaultAddressStore,
  useErc20AbiStore,
  useCurrentWagmiConfig
} from "../../store/Store";

// import wagmiConfig from "../../WagmiConfig";
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
    collateralValue
  } = props;
  const [ethPending, setEthPending] = useState(false);
  const [ethSuccess, setEthSuccess] = useState(false);

  const { wagmiConfig } = useCurrentWagmiConfig();

  const [amount, setAmount] = useState(0n);
  const [maxBal, setMaxBal] = useState(0n);
  const [showQr, setShowQr] = useState(false);

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

  const handleDepositSuccess = () => {
    const formatPrevTotal = collateralValue;
    const formatAmount = ethers.formatUnits(amount);
    const formatNewTotal = ethers.formatUnits(ethers.parseUnits(formatPrevTotal, decimals) + amount);
  
    toast.success("Deposit Successful");
    try {
      plausible('CollateralDeposit', {
        props: {
          CollateralDepositToken: symbol,
          CollateralDepositAmount: formatAmount,
          CollateralDepositPreviousTotal: formatPrevTotal,
          CollateralDepositNewTotal: formatNewTotal,
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

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
      setEthSuccess(false);
      setEthPending(true);
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
      setEthPending(false);
      setEthSuccess(true);
      handleDepositSuccess();
    } catch (error) {
      setEthPending(false);
      setEthSuccess(false);
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
      handleDepositSuccess();
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

  const handleCopyText = () => {
    const textElement = vaultAddress;

    if (navigator.clipboard && textElement) {
      const text = textElement;

      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success('Address Copied');
        })
        .catch((error) => {
          toast.error('There was a problem');
        });
    }
  };

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

        {showQr ? (
          <>
            <div
              className="flex flex-col justify-center items-center"
            >
              <div className="bg-white p-2 mb-2 rounded-md">
                <QRCode value={vaultAddress} />
              </div>
              <Typography variant="p">
                Scan QR code to deposit collateral
              </Typography>
              <div
                className="flex flex-row justify-center items-center"
              >
                <Typography variant="p">
                  {vaultAddress}
                </Typography>
                <Button
                  color="ghost"
                  onClick={handleCopyText}
                  size="sm"
                >
                  <DocumentDuplicateIcon className="h-6 w-6"/>
                </Button>
              </div>
            </div>

            <hr className="mb-2"/>
          </>
        ) : (null)}

        <div className="flex justify-between">
          <Typography
            variant="p"
          >
            Deposit Amount
          </Typography>
          <Typography
            variant="p"
            className="text-right"
          >
            Available: {maxBal || '0'}
          </Typography>
        </div>
        <div className="flex flex-row">
          <div
            className="join flex-1"
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
                variant="outline"
                onClick={handleMaxBalance}
                disabled={isPending}
              >
                Max
              </Button>
            )}
          </div>

          <Button
            color="ghost"
            onClick={() => setShowQr(!showQr)}
          >
            <QrCodeIcon className="h-6 w-6"/>
          </Button>
        </div>

        <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
          <Button
            className="w-full lg:w-auto"
            color="ghost"
            onClick={closeModal}
            disabled={isPending || ethPending}
          >
            Close
          </Button>
          <Button
            className="w-full lg:w-64"
            color="success"
            disabled={!amount || isPending || ethPending}
            onClick={depositViaMetamask}
            loading={isPending || ethPending}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DepositModal;