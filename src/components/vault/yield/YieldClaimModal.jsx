import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import {
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useSmartVaultABIStore,
} from "../../../store/Store";

import {
  ArbitrumVaults,
  SepoliaVaults,
  ArbitrumGammaVaults,
  SepoliaGammaVaults,
} from "./YieldGammaVaults";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Typography from "../../ui/Typography";
import CenterLoader from "../../ui/CenterLoader";
import TokenIcon from "../../ui/TokenIcon";
import Select from "../../ui/Select";

const YieldClaimModal = ({
  isOpen,
  handleCloseModal,
  yieldPair,
  yieldQuantities,
  yieldHypervisor,
  gammaUser,
}) => {
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();
  const { writeContract, isError, error, isPending, isSuccess } = useWriteContract();
  const chainId = useChainId();

  const [claimAsset, setClaimAsset] = useState();
  const [ yieldStage, setYieldStage ] = useState('');
  const [ minCollateral, setMinCollateral ] = useState(95);
  const [ feeAcknowledged, setFeeAcknowledged ] = useState(false);

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  let allReturnTokens = [];

  const isStablePair = yieldPair.includes('USDs') && yieldPair.includes('USDC');

  if (isStablePair) {
    allReturnTokens = yieldVaultsInfo.filter(item => item.collateral === true);
  } else {
    console.log
    allReturnTokens = yieldVaultsInfo.filter(item => item.pair.every(i => yieldPair.includes(i)));
  }

  const handleSetClaimAsset = (e) => {
    setClaimAsset(e.target.value);
  };

  const handleClaimYield = async () => {
    const yieldAsset = ethers.encodeBytes32String(claimAsset);
    const formattedMinCollateral = Number(minCollateral * 1000).toString();
    const now = Math.floor(Date.now() / 1000);
    const deadline = now + 60;    

    try {
      writeContract({
        abi: smartVaultABI,
        address: vaultAddress,
        functionName: "withdrawYield",
        args: [
          yieldHypervisor,
          yieldAsset,
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

  useEffect(() => {
    if (isPending) {
      // 
    } else if (isSuccess) {
      toast.success("Yield Claimed Successfully");
      handleCloseModal();
    } else if (isError) {
      //
      toast.error('There was a problem');
    }
  }, [
    isPending,
    isSuccess,
    isError,
  ]);

  const positionUser = gammaUser?.[yieldHypervisor.toLowerCase()] || {};
  const currentUSD = positionUser.returns?.currentUSD || 0;
  const hypervisorReturnsUSD = positionUser?.returns?.hypervisorReturnsUSD;

  if (isPending) {
    return (
      <>
        <Modal
          open={isOpen}
          onClose={() => {
            handleCloseModal();
          }}
          wide={false}
        >
          <Typography variant="h2" className="card-title">
            <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
            Claiming Your Yield
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

  if (yieldStage === 'CONFIRM') {
    return (
      <>
        <Modal
          open={isOpen}
          onClose={() => {
            handleCloseModal();
          }}
          wide={false}
        >
          <div>
            <Typography variant="h2" className="card-title">
              <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
              Withdraw From Yield Pool
            </Typography>

            <Typography variant="p" className="mb-2">
              This will withdraw <b>all</b> of the assets in this pair as the asset you have chosen below.
            </Typography>
          </div>
          <div>
            <Typography
              variant="h2"  
            >
              Current Position:
            </Typography>

            <table className="table">
              <thead>
                <tr>
                  <th className="pl-0">Yield Pair</th>
                  <th>Token Quantities</th>
                </tr>
              </thead>
                <tbody>
                  <tr>
                    <td className="pl-0">
                      <div className="h-full w-full flex flex-col">
                        <div className="flex items-center">
                          <TokenIcon
                            symbol={yieldPair[0]}
                            className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                          />
                          <TokenIcon
                            symbol={yieldPair[1]}
                            className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                          />
                        </div>
                        <div className="pt-2 hidden md:table-cell">
                          {yieldPair[0]}/{yieldPair[1]}
                        </div>
                      </div>
                    </td>
                    <td>
                      <b>{yieldPair[0]}:<br/></b>
                      {yieldQuantities[0]}<br/>
                      <b>{yieldPair[1]}:<br/></b>
                      {yieldQuantities[1]}
                    </td>
                  </tr>
                </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Typography
              variant="h2"
            >
              Withdraw As:
            </Typography>
            <Typography
              variant="p"
            >
              This will not go through if the trading slippage is more than {100 - minCollateral}%.
            </Typography>
            <table className="table">
              <thead>
                <tr>
                  <th className="pl-0">Claiming Token</th>
                  <th>Est. Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pl-0">
                    <div className="h-full w-full flex flex-col">
                      <div className="flex items-center">
                        <TokenIcon
                          symbol={claimAsset || ''}
                          className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                        />
                      </div>
                      <div className="pt-2 hidden md:table-cell">
                        {claimAsset || ''}
                      </div>
                    </div>
                  </td>
                  <td>
                    ${currentUSD?.toFixed(2) || ''}
                  </td>
                </tr>
              </tbody>
            </table>

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
              loading={isPending}
              disabled={isPending || !claimAsset}
              onClick={() => handleClaimYield()}
            >
              Confirm
            </Button>
          </div>
        </Modal>
      </>
    );  
  }

  // if (yieldStage === 'COLLATERAL') {
  //   return (
  //     <>
  //       <Modal
  //         open={isOpen}
  //         onClose={() => {
  //           handleCloseModal();
  //         }}
  //         wide={false}
  //       >
  //         <Typography variant="h2" className="card-title">
  //           <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
  //           Choose Minimum Collateral Percentage
  //         </Typography>

  //         <Typography
  //           variant="p"
  //           className="mb-2"
  //         >
  //           Your Yield Claim will revert if it's value after withdrawing isn't at least {minCollateral}% of it's current value.
  //         </Typography>

  
  //         <div className="flex flex-col">
  //           <div>
  //             <input
  //               type="range"
  //               min={0}
  //               max="100"
  //               value={minCollateral}
  //               className={`range range-info`}
  //               onChange={(e) => setMinCollateral(e.target.value)}
  //             />
  //           </div>
  //           <div className="flex flex-row justify-between">
  //             <div className="flex flex-col">
  //               <Typography
  //                 variant="p"
  //                 className="mt-2"
  //               >
  //                 Minimum Collateral Value: {minCollateral}%
  //               </Typography>
  //             </div>
  //           </div>
  //         </div>
  
  //         <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
  //           <Button
  //             className="w-full lg:w-auto"
  //             color="ghost"
  //             onClick={() => setYieldStage('')}
  //           >
  //             Back
  //           </Button>
  //           <Button
  //             className="w-full lg:w-64"
  //             color="success"
  //             loading={isPending}
  //             disabled={isPending || !claimAsset}
  //             onClick={() => setYieldStage('CONFIRM')}
  //           >
  //             Next
  //           </Button>
  //         </div>
  //       </Modal>
  //     </>
  //   );  
  // }

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          handleCloseModal();
        }}
      >
        {!(hypervisorReturnsUSD > 1) && !feeAcknowledged ? (
          <>
            <div>
              <Typography variant="h2" className="card-title">
                <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
                Withdraw From Yield Pool
              </Typography>

              <Typography variant="p" className="mt-4 mb-4">
                You haven't yet earned enough yield to cover the 1% protocol fee.
              </Typography>

              <Typography variant="p" className="mt-4 mb-4">
                We recommend leaving your tokens in the yield pool longer to maximise your earnings.
              </Typography>

              <Typography variant="p" className="mb-2">
                Would you like to continue with withdrawing your tokens?
              </Typography>
            </div>
            <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
              <Button
                className="w-full lg:w-auto"
                color="ghost"
                onClick={handleCloseModal}
              >
                Close
              </Button>
              <Button
                className="w-full lg:w-64"
                color="success"
                onClick={() => setFeeAcknowledged(true)}
              >
                Continue
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <Typography variant="h2" className="card-title">
                <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
                Withdraw From Yield Pool
              </Typography>

              <Typography variant="p" className="mb-2">
                This will withdraw <b>all</b> of the assets in this pair.
              </Typography>

              <Typography
                variant="p"
                className="mb-2"
              >
                Select which asset you want to withdraw as.
              </Typography>

              <table className="table">
                <thead>
                  <tr>
                    <th>Yield Pair</th>
                    <th>Token Quantities</th>
                  </tr>
                </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="h-full w-full flex flex-col">
                          <div className="flex items-center">
                            <TokenIcon
                              symbol={yieldPair[0]}
                              className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                            />
                            <TokenIcon
                              symbol={yieldPair[1]}
                              className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                            />
                          </div>
                          <div className="pt-2 hidden md:table-cell">
                            {yieldPair[0]}/{yieldPair[1]}
                          </div>
                        </div>
                      </td>
                      <td>
                        <b>{yieldPair[0]}:<br/></b>
                        {yieldQuantities[0]}<br/>
                        <b>{yieldPair[1]}:<br/></b>
                        {yieldQuantities[1]}
                      </td>
                    </tr>
                  </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Typography
                variant="p"
                className="mb-2"
              >
                Withdraw As:
              </Typography>
              <Select
                id="yield-asset-select"
                value={claimAsset}
                label="Asset"
                handleChange={handleSetClaimAsset}
                optName="asset"
                optValue="asset"
                options={allReturnTokens || []}
                className="w-full mb-4"
              >
              </Select>
            </div>
            <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
              <Button
                className="w-full lg:w-auto"
                color="ghost"
                onClick={handleCloseModal}
              >
                Close
              </Button>
              <Button
                className="w-full lg:w-64"
                color="success"
                loading={isPending}
                disabled={isPending || !claimAsset}
                onClick={() => setYieldStage('CONFIRM')}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
};

export default YieldClaimModal;