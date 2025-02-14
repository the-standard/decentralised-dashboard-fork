import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import {
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  QueueListIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useLocalThemeModeStore,
} from "../../../store/Store";

import {
  ArbitrumVaults,
  SepoliaVaults,
} from "./YieldGammaVaults";

import smartVaultAbi from "../../../abis/smartVault";

import CenterLoader from "../../ui/CenterLoader";
import TokenIcon from "../../ui/TokenIcon";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import Typography from "../../ui/Typography";

const YieldDepositModal = (props) => {
  const {
    open,
    closeModal,
    symbol,
  } = props;
  const { vaultAddress } = useVaultAddressStore();
  const { localThemeModeStore } = useLocalThemeModeStore();
  const chainId = useChainId();
  const [ yieldStage, setYieldStage ] = useState('');
  const [ stableRatio, setStableRatio ] = useState(20);
  const [ minCollateral, setMinCollateral ] = useState(50);

  const formattedSymbol = ethers.encodeBytes32String(symbol);
  const formattedStableRatio = Number(stableRatio * 1000).toString();
  const formattedMinCollateral = Number(minCollateral * 1000).toString();

  const { writeContract, isError, error, isPending, isSuccess } = useWriteContract();

  const isLight = localThemeModeStore && localThemeModeStore.includes('light');

  const handleDepositYield = async () => {
    const now = Math.floor(Date.now() / 1000);
    const deadline = now + 60;    

    try {
      writeContract({
        abi: smartVaultAbi,
        address: vaultAddress,
        functionName: "depositYield",
        args: [
          formattedSymbol,
          formattedStableRatio,
          formattedMinCollateral,
          deadline
        ],
      });
    } catch (error) {
      let errorMessage;
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was a problem');
    }
  };

  const handleStableRatio = (ratio) => {
    let useRatio = ratio;
    if (ratio < 10) {
      useRatio = '10';
    }
    setStableRatio(useRatio);
  };

  useEffect(() => {
    if (isPending) {
      // 
    } else if (isSuccess) {
      toast.success("Yield Deposit Successful");
      closeModal();
    } else if (isError) {
      //
      console.log(error)
      toast.error('There was a problem');
    }
  }, [
    isPending,
    isSuccess,
    isError,
  ]);

  useEffect(() => {
    if (stableRatio > 0) {
      const useMin = (stableRatio / 5) * 2;
      setMinCollateral(useMin);
    }
  }, [
    stableRatio,
  ]);

  const allowedRatio = stableRatio >= 10 && stableRatio <= 100;

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  const assetYield = yieldVaultsInfo.find(item => item.asset === symbol);

  if (isPending) {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
          wide={false}
        >
          <Typography variant="h2" className="card-title">
            <AdjustmentsHorizontalIcon className="mr-2 h-6 w-6 inline-block"/>
            Setting Up Yield Pool
          </Typography>
  
          <CenterLoader />
  
          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-auto"
              color="ghost"
              disabled
            >
              Back
            </Button>
            <Button
              className="w-full lg:w-64"
              color="success"
              disabled={true}
              loading={true}
            >
              Loading
            </Button>
          </div>
        </Modal>
      </>
    );
  }

  if (yieldStage === 'STABILITY') {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
          wide={false}
        >
          <Typography variant="h2" className="card-title">
            <AdjustmentsHorizontalIcon className="mr-2 h-6 w-6 inline-block"/>
            Choose Your Allocation
          </Typography>
  
          <div className="flex flex-col bg-base-300/40 p-4 rounded-lg">
            <div className="flex flex-row justify-between">
              <Typography
                variant="p"
                className="mb-2"
              >
                {100 - stableRatio}% Risky Volatile Pool
              </Typography>
              <Typography
                variant="p"
                className="mb-2 text-right"
              >
                {stableRatio}% Low Risk Stable Pool
              </Typography>
            </div>
            <div>
              <input
                type="range"
                min={0}
                max="100"
                value={stableRatio}
                className={isLight ? 
                  `range [--range-shdw:unset] [&::-webkit-slider-thumb]:bg-primary` :
                  `range [--range-shdw:unset] [&::-webkit-slider-thumb]:bg-white`
                }
                onChange={(e) => handleStableRatio(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-between text-warning">
              <div className="flex flex-col">
                <Typography
                  variant="p"
                  className="mt-0 opacity-80"
                >
                  {assetYield.pair[0]}/{assetYield.pair[1]}
                </Typography>
                <Typography
                  variant="h2"
                  className="mt-1"
                >
                  ≈{0}% APY
                </Typography>
                <Typography
                  variant="p"
                  className="mt-1 opacity-80"
                >
                  At risk when markets move
                </Typography>
              </div>
              <div className="flex flex-col text-end text-success">
                <Typography
                  variant="p"
                  className="mt-0 opacity-80"
                >
                  USDs/USDC
                </Typography>
                <Typography
                  variant="h2"
                  className="mt-1"
                >
                  ≈{0}% APY
                </Typography>
                <Typography
                  variant="p"
                  className="mt-1 opacity-80"
                >
                  Stable compound growth  
                </Typography>
              </div>
            </div>
          </div>

          <div>
            <Typography
              variant="p"
              className="mt-1"
            >
              📈 Volatile pools offer higher returns but come with impermanent loss 
            </Typography>
            <Typography
              variant="p"
              className="mt-1"
            >
              🛡️ Stable pools provide steady, lower-risk earnings 
            </Typography>
            <Typography
              variant="p"
              className="mt-1"
            >
              ✅ Minimum 10% stable allocation is required
            </Typography>
          </div>
  
          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-auto"
              color="ghost"
              onClick={() => setYieldStage('')}
            >
              Back
            </Button>
            <Button
              className="w-full lg:w-64"
              color="success"
              disabled={!allowedRatio}
              onClick={() => handleDepositYield()}
              // onClick={() => setYieldStage('COLLATERAL')}
            >
              Confirm
            </Button>
          </div>
        </Modal>
      </>
    );  
  }

  return (
    <>
      <Modal
        open={open}
        closeModal={closeModal}
        wide={false}
      >
        <Typography variant="h2" className="card-title">
          <QueueListIcon className="mr-2 h-6 w-6 inline-block"/>
          Yield Pool Fees
        </Typography>

        <Typography
          variant="h2"
          className="mb-2"
        >
          Estimated Yield Based on Current APY
        </Typography>

        <div className="bg-base-300/40 p-4 rounded-lg">
          <Typography
            variant="p"
            className="mb-0 flex items-center"
          >
            <div className="inline-flex items-center mr-2">
              <TokenIcon
                symbol={'USDs'}
                className="h-8 w-8 p-1 rounded-full bg-base-300/50"
              />
              <TokenIcon
                symbol={'USDC'}
                className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
              />
            </div>
            Stable Pool
            (USDs/USDC):
            <b>&nbsp;≈{0}% APY</b>
          </Typography>

          <div className="divider my-1" />

          <Typography
            variant="p"
            className="mb-0 flex items-center"
          >
            <div className="inline-flex items-center mr-2">
              <TokenIcon
                symbol={assetYield.pair[0]}
                className="h-8 w-8 p-1 rounded-full bg-base-300/50"
              />
              <TokenIcon
                symbol={assetYield.pair[1]}
                className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
              />
            </div>
            Volatile Pool
            ({assetYield.pair[0]}/{assetYield.pair[1]}):
            <b>&nbsp;≈{0}% APY</b>
          </Typography>
        </div>
        <div className="mt-2">
          <Typography
            variant="h2"
            className="mb-1"
          >
            Yield Pool Fees: 1% of collateral
          </Typography>
          <Typography
            className="mb-2 opacity-80 text-sm"
          >
            (Paid on withdrawal from yield pool and airdropped onto TST stakers)
          </Typography>
        </div>

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
            loading={isPending}
            disabled={isPending}
            onClick={() => setYieldStage('STABILITY')}
          >
            Next
          </Button>
        </div>
      </Modal>
    </>
  );

};

export default YieldDepositModal;