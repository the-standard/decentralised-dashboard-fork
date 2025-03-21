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
} from "./YieldGammaVaults";

import TokenNormalise from "../../ui/TokenNormalise";
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
  positionUser,
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

  const isStablePair = yieldPair?.includes('USDs') && yieldPair?.includes('USDC');

  if (isStablePair) {
    allReturnTokens = yieldVaultsInfo.filter(item => item.collateral === true);
  } else {
    allReturnTokens = yieldVaultsInfo.filter(item => item.pair.every(i => yieldPair?.includes(i)));
  }

  const handleSetClaimAsset = (e) => {
    setClaimAsset(e.target.value);
  };

  const handleClaimYield = async () => {
    const yieldAsset = ethers.encodeBytes32String(claimAsset);
    const formattedMinCollateral = Number(minCollateral * 1000).toString();
    const now = Math.floor(Date.now() / 1000);
    const deadline = now + 60;
    const yieldHypervisorAddress = yieldHypervisor?.address;

    try {
      writeContract({
        abi: smartVaultABI,
        address: vaultAddress,
        functionName: "withdrawYield",
        args: [
          yieldHypervisorAddress,
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
      toast.success("Yield Pool Withdrawal Successful");
      handleCloseModal();
    } else if (isError) {
      //
      console.error(error)
      toast.error('There was a problem');
    }
  }, [
    isPending,
    isSuccess,
    isError,
  ]);

  const currentUSD = positionUser?.returns?.currentUSD || 0;
  const hypervisorReturnsUSD = positionUser?.returns?.hypervisorReturnsUSD;

  if (isPending) {
    return (
      <>
        <Modal
          open={isOpen}
          onClose={() => {
            handleCloseModal();
          }}
          closeModal={() => {
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
          closeModal={() => {
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
                            symbol={TokenNormalise(yieldPair?.[0])}
                            className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                          />
                          <TokenIcon
                            symbol={TokenNormalise(yieldPair?.[1])}
                            className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                          />
                        </div>
                        <div className="pt-2 hidden md:table-cell">
                          {TokenNormalise(yieldPair?.[0])}/{TokenNormalise(yieldPair?.[1])}
                        </div>
                      </div>
                    </td>
                    <td>
                      <b>{TokenNormalise(yieldPair?.[0])}:<br/></b>
                      {yieldQuantities?.[0]}<br/>
                      <b>{TokenNormalise(yieldPair?.[1])}:<br/></b>
                      {yieldQuantities?.[1]}
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
              variant="outline"
              onClick={() => setYieldStage('')}
            >
              Back
            </Button>
            <Button
              className="w-full lg:w-64"
              color="error"
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

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          handleCloseModal();
        }}
        closeModal={() => {
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
                variant="outline"
                onClick={handleCloseModal}
              >
                Back
              </Button>
              <Button
                className="w-full lg:w-64"
                color="error"
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

              {isStablePair ? (
                <Typography variant="p" className="mb-2">
                  USDs cannot be withdrawn as a collateral, but will be converted to the asset you select below.
                </Typography>
              ) : (null)}

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
                              symbol={TokenNormalise(yieldPair?.[0])}
                              className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                            />
                            <TokenIcon
                              symbol={TokenNormalise(yieldPair?.[1])}
                              className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                            />
                          </div>
                          <div className="pt-2 hidden md:table-cell">
                            {TokenNormalise(yieldPair?.[0])}/{TokenNormalise(yieldPair?.[1])}
                          </div>
                        </div>
                      </td>
                      <td>
                        <b>{TokenNormalise(yieldPair?.[0])}:<br/></b>
                        {yieldQuantities?.[0]}<br/>
                        <b>{TokenNormalise(yieldPair?.[1])}:<br/></b>
                        {yieldQuantities?.[1]}
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
                variant="outline"
                onClick={handleCloseModal}
              >
                Back
              </Button>
              <Button
                className="w-full lg:w-64"
                color="error"
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