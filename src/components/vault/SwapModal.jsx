import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { useWriteContract } from "wagmi";
import { toast } from 'react-toastify';
import {
  Button,
  Card,
} from 'react-daisyui';
import {
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultStore,
  useVaultAddressStore,
  useSmartVaultABIStore,
} from "../../store/Store";

import Typography from "../ui/Typography";
import Select from "../ui/Select";
import Modal from "../ui/Modal.jsx";

const SwapModal = ({
  open,
  closeModal,

  assets,
  symbol,
  decimals,
  collateralValue,
}) => {
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapAssets, setSwapAssets] = useState();
  const [amount, setAmount] = useState(0);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [receiveAsset, setReceiveAsset] = useState('');
  const [receiveDecimals, setReceiveDecimals] = useState();
  const { vaultStore } = useVaultStore();
  const inputRef = useRef(null);
  const inputReceiveRef = useRef(null);
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();
  
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
    try {
      writeContract({
        abi: smartVaultABI,
        address: vaultAddress,
        functionName: "swap",
        args: [
          ethers.encodeBytes32String(symbol),
          ethers.encodeBytes32String(receiveAsset),
          amount,
          receiveAmount,
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
      setReceiveAsset('');
    } else if (isError) {
      toast.error('There was a problem');
      setSwapLoading(false);
      inputRef.current.value = "";
      setAmount(0);
      setReceiveAmount(0);
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

  if (open) {
    if (vaultStore.status.version !== 1 && vaultStore.status.version !== 2) {
      return (
        <>
          <Modal
            open={open}
            closeModal={closeModal}
          >
            <>
              <Card.Title tag="h2">
                <ArrowPathIcon className="h-6 w-6 inline-block"/>
                Swap {symbol}
              </Card.Title>

              <div>
                <div>
                  <Typography
                    variant="p"
                    className="mb-2"
                  >
                    Swap Amount:
                  </Typography>
                  <div
                    className="join w-full mb-4"
                  >
                    <input
                      className="input input-bordered join-item w-full"
                      ref={inputRef}
                      type="number"
                      onChange={handleAmount}
                      placeholder={ symbol ? (
                        `Amount of ${symbol} to Swap`
                      ) : (
                        `Amount to Swap`
                      )}
                      disabled={swapLoading}
                    />
                    {symbol !== "ETH" && symbol !== "AGOR" && (
                      <Button
                        className="join-item"
                        onClick={handleMaxBalance}
                        disabled={swapLoading}
                      >
                        Max
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Typography
                    variant="p"
                    className="mb-2"
                  >
                    Swap For:
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
                    Min. Return:
                  </Typography>
                  <input
                    className="input input-bordered w-full"
                    ref={inputReceiveRef}
                    type="number"
                    onChange={handleMinReturn}
                    placeholder="Amount"
                    disabled={swapLoading || !amount || !receiveAsset}
                  />
                </div>
              </div>

              <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
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
              </Card.Actions>
            </>
          </Modal>
        </>
      );  
    }

    return (
      <Modal
        open={open}
        closeModal={closeModal}
      >
        <>
          <Card.Title tag="h2">
            <ArrowPathIcon className="h-6 w-6 inline-block"/>
            Swap {symbol}
          </Card.Title>

          <div>
            <Typography
              variant="h3"
              className="mb-2"
            >
              {vaultStore.status.version ? (
                <>
                  {vaultStore.status.version == 2 ? (
                    <>
                      Asset Swapping Is No Longer Available in V2 Vaults.
                    </>
                  ) : (
                    <>
                      Asset Swapping Is Not Available in V{vaultStore.status.version} Vaults.
                    </>
                  )}
                </>
              ) : (
                'Asset Swapping Is Not Available'
              )}
            </Typography>
            <Typography
              variant="p"
              className="mb-2"
            >
              {vaultStore.status.version == 2 ? (
                <>
                  Asset swapping will return soon with the upcoming introduction of V3 vaults.
                </>
              ) : (
                <>
                  Asset swapping is coming soon with the upcoming introduction of V3 vaults.
                </>
              )}
            </Typography>
          </div>


          <Card.Actions className="pt-4 flex justify-end">
            <Button
              color="ghost"
              onClick={closeModal}
              disabled={isPending}
            >
              Close
            </Button>
          </Card.Actions>
        </>
      </Modal>
    );  
  }

  return (
    <>{null}</>
  )

};

export default SwapModal;