import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { useWriteContract } from "wagmi";
import { toast } from 'react-toastify';
import axios from "axios";
import {
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useSmartVaultSwapV4ABIStore,
} from "../../store/Store";

import Button from "../ui/Button";
import Typography from "../ui/Typography";
import Select from "../ui/Select";
import Modal from "../ui/Modal";
import Input from "../ui/Input";

const SwapModalV4 = ({
  open,
  closeModal,
  assets,
  symbol,
  decimals,
  collateralValue,
  tokenTotal,
}) => {
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapAssets, setSwapAssets] = useState();
  const [amount, setAmount] = useState(0);
  const [swapFee, setSwapFee] = useState(3000);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [receiveQuote, setReceiveQuote] = useState(undefined);
  const [receiveAsset, setReceiveAsset] = useState('');
  const [receiveDecimals, setReceiveDecimals] = useState();
  const inputRef = useRef(null);
  const inputReceiveRef = useRef(null);
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultSwapV4ABI } = useSmartVaultSwapV4ABIStore();
  
  const handlereceiveAsset = (e) => {
    setReceiveAsset(e.target.value);
    const useToken = swapAssets?.find((item) => item.symbol === e.target.value);
    setReceiveDecimals(useToken?.dec)
  };

  const handleAmount = (e) => {
    setAmount(ethers.parseUnits(e.target.value.toString(), decimals))
  };

  const handleMinReturn = (e) => {
    setReceiveAmount(ethers.parseUnits(e.target.value.toString(), receiveDecimals))
  };

  const getSwapConversion = async () => {
    try {
      setSwapLoading(true);
      const swapIn = symbol;
      const swapOut = receiveAsset;
      const swapAmount = amount.toString();
      const response = await axios.get(
        `https://smart-vault-api.thestandard.io/estimate_swap?in=${swapIn}&out=${swapOut}&amount=${swapAmount}`
      );
      const data = response.data;
      const useReceive = BigInt(data) * BigInt(95) / BigInt(100);
      setReceiveAmount(useReceive);
      setReceiveQuote(useReceive);
      inputReceiveRef.current.value = ethers.formatUnits(Number(useReceive).toString(), receiveDecimals);
      setSwapLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (amount && receiveAsset && symbol) {
      getSwapConversion();
    }
  }, [amount, receiveAsset]);

  useEffect(() => {
    if (symbol && receiveAsset) {
      const swapPair = [symbol, receiveAsset];

      let useFee = 3000;
      if (
        ((swapPair.includes('ETH') || swapPair.includes('WETH')) && swapPair.includes('WBTC')) ||
        ((swapPair.includes('ETH') || swapPair.includes('WETH')) && swapPair.includes('ARB'))
      ) {
        useFee = 500;
      }
      if (
        ((swapPair.includes('ETH') || swapPair.includes('WETH')) && swapPair.includes('GMX'))
      ) {
        useFee = 10000;
      }

      setSwapFee(useFee);
    }
  }, [symbol, receiveAsset]);

  useEffect(() => {
    const useAssets = [];
    assets.map((asset) => {
      const token = asset.token;
      const symbol = ethers.decodeBytes32String(token?.symbol);
      const obj = {
        addr: token?.addr,
        clAddr: token?.clAddr,
        clDec: token?.clDec,
        dec: token?.dec,
        symbol: symbol,
      }
      return (
        useAssets.push(obj)
      );
    });
    setSwapAssets(useAssets)
  }, []);

  const availableAssets = swapAssets?.filter((item) => item.symbol !== symbol);

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleSwapTokens = async () => {
    const now = Math.floor(Date.now() / 1000);
    const deadline = now + 60;

    try {
      writeContract({
        abi: smartVaultSwapV4ABI,
        address: vaultAddress,
        functionName: "swap",
        args: [
          ethers.encodeBytes32String(symbol),
          ethers.encodeBytes32String(receiveAsset),
          amount,
          receiveAmount,
          swapFee,
          deadline
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
      setSwapLoading(true);
    } else if (isSuccess) {
      toast.success("Swap Successful");
      setSwapLoading(false);
      inputRef.current.value = "";
      setAmount(0);
      setReceiveAmount(0);
      setReceiveQuote(undefined);
      setReceiveAsset('');
    } else if (isError) {
      console.error(error)
      toast.error('There was a problem');
      setSwapLoading(false);
      inputRef.current.value = "";
      setAmount(0);
      setReceiveAmount(0);
      setReceiveQuote(undefined);
      setReceiveAsset('');
    }
  }, [
    isPending,
    isSuccess,
    isError,
    error
  ]);

  const handleMaxBalance = async () => {
    const formatted = collateralValue;
    inputRef.current.value = formatted;
    handleAmount({ target: { value: formatted } });
  };

  const total = ethers.formatUnits(tokenTotal, decimals);

  const showSwapFee = Number(swapFee / 10000);

  if (open) {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
        >
          <>
            <Typography variant="h2" className="card-title">
              <ArrowPathIcon className="mr-2 h-6 w-6 inline-block"/>
              Swap {symbol}
            </Typography>

            <div>
              {receiveQuote <= 0 ? (
                <div role="alert" className="alert alert-warning bg-yellow-400/20 mb-2">
                  <span>
                    <b>No direct trade available</b>.
                    <br/>
                    Please swap to ETH or WETH first to get this trade to work.
                  </span>
                </div>
              ) : (
                null
              )}
              <div>
                <div className="flex justify-between">
                  <Typography
                    variant="p"
                    className="mb-2"
                  >
                    Swap Amount
                  </Typography>
                  <Typography
                    variant="p"
                    className="mb-2 text-right"
                  >
                    Available: {total || ''}
                  </Typography>
                </div>
                <div
                  className="join w-full mb-4"
                >
                  <Input
                    className="join-item w-full"
                    useRef={inputRef}
                    type="number"
                    onChange={handleAmount}
                    placeholder={ symbol ? (
                      `Amount of ${symbol} to Swap`
                    ) : (
                      `Amount to Swap`
                    )}
                    disabled={swapLoading}
                  />
                  <Button
                    className="join-item"
                    variant="outline"
                    onClick={handleMaxBalance}
                    disabled={swapLoading}
                  >
                    Max
                  </Button>
                </div>
              </div>

              <div>
                <Typography
                  variant="p"
                  className="mb-2"
                >
                  Swap For
                </Typography>
                <Select
                  id="swap-asset-select"
                  value={receiveAsset}
                  label="Asset"
                  handleChange={handlereceiveAsset}
                  optName="symbol"
                  optValue="symbol"
                  options={availableAssets || []}
                  disabled={!amount}
                  className="w-full mb-4"
                >
                </Select>
              </div>
              <div>
                <Typography
                  variant="p"
                  className="mb-2"
                >
                  Trading Fee:
                </Typography>
                <Typography
                  variant="h4"
                  className="mb-4"
                >
                  {showSwapFee}%
                </Typography>
              </div>
              <div>
                <Typography
                  variant="p"
                  className="mb-2"
                >
                  Min. Return:
                </Typography>
                <Input
                  className="w-full"
                  useRef={inputReceiveRef}
                  type="number"
                  onChange={handleMinReturn}
                  placeholder="Amount"
                  disabled={swapLoading || !amount || !receiveAsset}
                />
              </div>
            </div>

            <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
              <Button
                className="w-full lg:w-auto"
                color="ghost"
                onClick={closeModal}
                disabled={swapLoading}
              >
                Close
              </Button>
              <Button
                className="w-full lg:w-64"
                color="success"
                disabled={
                  !amount||
                  !receiveAsset ||
                  !(receiveAmount >= 0) ||
                  swapLoading
                }
                onClick={handleSwapTokens}
                loading={swapLoading}
              >
                Confirm
              </Button>
            </div>
          </>
        </Modal>
      </>
    );  
  }

  return (
    <>{null}</>
  )

};

export default SwapModalV4;