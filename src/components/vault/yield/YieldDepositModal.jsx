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
  useGammaHypervisorsAllDataStore,
  useMerklPoolsDataStore,
} from "../../../store/Store";

import {
  ArbitrumVaults,
  SepoliaVaults,
  SepoliaGammaVaults,
  ArbitrumGammaVaults,
} from "./YieldGammaVaults";

import smartVaultAbi from "../../../abis/smartVault";

import TokenNormalise from "../../ui/TokenNormalise";
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
  const {
    gammaHypervisorsAllData,
    gammaHypervisorsAllDataLoading,
  } = useGammaHypervisorsAllDataStore();
  const {
    merklPoolsData,
    merklPoolsDataLoading,
  } = useMerklPoolsDataStore();

  const chainId = useChainId();
  const [ yieldStage, setYieldStage ] = useState('');
  const [ stableRatio, setStableRatio ] = useState(50);
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
      if (error?.cause?.reason) {
        toast.error(`Error: ${error.cause.reason}`)
      } else (
        toast.error('There was a problem')
      )
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

  const gammaVaults = chainId === arbitrumSepolia.id
  ? SepoliaGammaVaults
  : ArbitrumGammaVaults;

  // Volatile Pair

  let tokenYield = yieldVaultsInfo.find(item => item.asset === symbol);
  let yieldPair;
  if (tokenYield && tokenYield.pair) {
    yieldPair = tokenYield.pair;
  }

  let gammaVault = {};
  let gammaAddress;
  if (yieldPair) {
    gammaVault = gammaVaults.find(vault => (
      vault.pair.length === yieldPair.length && 
      yieldPair.every(token => vault.pair.includes(token))
    ))
  }
  if (gammaVault && gammaVault.address) {
    gammaAddress = gammaVault.address;
  }

  let gammaData;
  if (gammaAddress) {
    gammaData = gammaHypervisorsAllData.find(hypervisor => (
      hypervisor.address.toLowerCase() === gammaAddress.toLowerCase()
    ))
  }

  let gammaYield = 0;
  if (gammaData && gammaData.feeApr) {
    gammaYield = Number(gammaData.feeApr * 100).toFixed(2);
  }

  // USDs Stable Pair

  const usdsTokenYield = yieldVaultsInfo.find(item => item.asset === 'USDs');
  let usdsYieldPair;
  if (usdsTokenYield && usdsTokenYield.pair) {
    usdsYieldPair = usdsTokenYield.pair;
  }

  let usdsGammaVault = {};
  let usdsGammaAddress;
  if (usdsYieldPair) {
    usdsGammaVault = gammaVaults.find(vault => (
      vault.pair.length === usdsYieldPair.length && 
      usdsYieldPair.every(token => vault.pair.includes(token))
    ))
  }
  if (usdsGammaVault && usdsGammaVault.address) {
    usdsGammaAddress = usdsGammaVault.address;
  }

  let usdsGammaData;
  if (usdsGammaAddress) {
    usdsGammaData = gammaHypervisorsAllData.find(hypervisor => (
      hypervisor.address.toLowerCase() === usdsGammaAddress.toLowerCase()
    ))
  }

  let usdsGammaYield = 0;
  if (usdsGammaData && usdsGammaData.feeApr) {
    usdsGammaYield = Number(usdsGammaData.feeApr * 100).toFixed(2);
  }

  // USDs Merkl Rewards

  const usdsGammaVaultInfo = gammaVaults.find(item => item?.pair.every(token => ['USDs', 'USDC'].includes(token)));

  const merklPoolData = merklPoolsData?.pools?.[usdsGammaVaultInfo?.pool];

  const merklAprSelector = `Gamma ${usdsGammaVaultInfo?.address}`;

  const merklPoolReward = merklPoolData?.aprs?.[merklAprSelector] || 0;

  const stableYieldTotal = Number(Number(usdsGammaYield) + Number(merklPoolReward)).toFixed(2);

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
                  {TokenNormalise(tokenYield.pair[0])}/{TokenNormalise(tokenYield.pair[1])}
                </Typography>
                <Typography
                  variant="h2"
                  className="mt-1"
                >
                  {gammaHypervisorsAllDataLoading ? (
                    <span className="loading loading-bars loading-xs"></span>
                  ) : (
                    <>
                      ≈ {gammaYield}% APY
                    </>
                  )}
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
                  {gammaHypervisorsAllDataLoading || merklPoolsDataLoading ? (
                    <span className="loading loading-bars loading-xs"></span>
                  ) : (
                    <>
                      ≈ {stableYieldTotal}% APY
                    </>
                  )}
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

          {isError ? (
            <div className="bg-error/5 border border-error rounded-lg p-4">
              <div className="flex items-start">
                <Typography
                  variant="p"
                  className="text-sm text-error"
                >
                  We were unable to create a swap at that ratio. You may need to try a different ratio or try again later.
                </Typography>
              </div>
            </div>
          ) : null}
  
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
            {gammaHypervisorsAllDataLoading || merklPoolsDataLoading ? (
              <span className="loading loading-bars loading-xs"></span>
            ) : (
              <>
                <b>&nbsp;≈ {stableYieldTotal}% APY</b>
              </>
            )}
          </Typography>

          <div className="divider my-1" />

          <Typography
            variant="p"
            className="mb-0 flex items-center"
          >
            <div className="inline-flex items-center mr-2">
              <TokenIcon
                symbol={TokenNormalise(tokenYield.pair[0])}
                className="h-8 w-8 p-1 rounded-full bg-base-300/50"
              />
              <TokenIcon
                symbol={TokenNormalise(tokenYield.pair[1])}
                className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
              />
            </div>
            Volatile Pool
            ({TokenNormalise(tokenYield.pair[0])}/{TokenNormalise(tokenYield.pair[1])}):
            {gammaHypervisorsAllDataLoading ? (
              <span className="loading loading-bars loading-xs"></span>
            ) : (
              <>
                <b>&nbsp;≈ {gammaYield}% APY</b>
              </>
            )}
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