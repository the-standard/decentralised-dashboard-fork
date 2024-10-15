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
  const chainId = useChainId();
  const [ yieldStage, setYieldStage ] = useState('');
  const [ stableRatio, setStableRatio ] = useState(75);
  const [ minCollateral, setMinCollateral ] = useState(50);

  const formattedSymbol = ethers.encodeBytes32String(symbol);
  const formattedStableRatio = Number(stableRatio * 1000).toString();
  const formattedMinCollateral = Number(minCollateral * 1000).toString();

  const { writeContract, isError, error, isPending, isSuccess } = useWriteContract();

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
            Choose Stable Ratio
          </Typography>

          <Typography
            variant="p"
            className="mb-2"
          >
            Choose how much volatile collateral you want to use to earn a yield, and what percentage you would like in safer, correlated, stable asset yield strategies.
            <br/>
            A minimum of 10% stable is required. 
          </Typography>

  
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <Typography
                variant="p"
                className="mb-2"
              >
                Volatile
              </Typography>
              <Typography
                variant="p"
                className="mb-2 text-right"
              >
                Stable
              </Typography>
            </div>
            <div>
              <input
                type="range"
                min={0}
                max="100"
                value={stableRatio}
                className={`range`}
                onChange={(e) => handleStableRatio(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <Typography
                  variant="p"
                  className="mt-2"
                >
                  {100 - stableRatio}% {assetYield.pair[0]}/{assetYield.pair[1]}
                </Typography>
              </div>
              <div className="flex flex-col">
                <Typography
                  variant="p"
                  className="mt-2"
                >
                  {stableRatio}% USDs/USDC
                </Typography>
              </div>
            </div>
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
          Yield Pool
        </Typography>

        <Typography
          variant="p"
          className="mb-2"
        >
          This will place <b>all</b> of your <b>{symbol}</b> into the Yield Pool shown below. You will get to choose the stable/volatile ratio next.
        </Typography>

        <Typography
          variant="p"
          className="mb-2"
        >
          The price of yield generation is 1%. This will get distributed to TST stakers.
        </Typography>

        <Typography
          variant="p"
          className="mb-2"
        >
          Confirm that you are happy to continue with this selected Yield Pool.
        </Typography>

        <div className="flex flex-col">
          <table className="table">
            <thead>
              <tr>
                <th>Stable Pair</th>
                <th>Volatile Pair</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>
                    <div className="h-full w-full flex flex-col">
                      <div className="flex items-center">
                        <TokenIcon
                          symbol={'USDs'}
                          className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                        />
                        <TokenIcon
                          symbol={'USDC'}
                          className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                        />
                      </div>
                      <div className="pt-2 hidden md:table-cell">
                        USDs/USDC
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="h-full w-full flex flex-col">
                      <div className="flex items-center">
                        <TokenIcon
                          symbol={assetYield.pair[0]}
                          className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                        />
                        <TokenIcon
                          symbol={assetYield.pair[1]}
                          className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                        />
                      </div>
                      <div className="pt-2 hidden md:table-cell">
                        {assetYield.pair[0]}/{assetYield.pair[1]}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
          </table>
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