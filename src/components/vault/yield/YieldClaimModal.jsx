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
}) => {
  const [claimAsset, setClaimAsset] = useState();
  const chainId = useChainId();
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();
  const { writeContract, isError, isPending, isSuccess } = useWriteContract();

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  const gammaYieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaGammaVaults
  : ArbitrumGammaVaults;

  let allReturnTokens = [];

  if (yieldPair.toString() === 'USDs,USDC') {
    allReturnTokens = yieldVaultsInfo.filter(item => item.collateral === true);
  } else {
    allReturnTokens = yieldVaultsInfo.filter(item => item.pair.toString() === yieldPair.toString());
  }

  const handleSetClaimAsset = (e) => {
    setClaimAsset(e.target.value);
  };

  const handleClaimYield = async () => {
    const yieldAsset = ethers.encodeBytes32String(claimAsset);
    try {
      writeContract({
        abi: smartVaultABI,
        address: vaultAddress,
        functionName: "withdrawYield",
        args: [
          yieldHypervisor,
          yieldAsset,
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


  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          handleCloseModal();
        }}
      >
        <>
          {isPending ? (
            <>
              <Typography variant="h2" className="card-title">
                <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
                Claiming Your Yield
              </Typography>
              <CenterLoader />
            </>
          ) : (
            <>
              <div>
                <Typography variant="h2" className="card-title">
                  <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
                  Claim Your Yields
                </Typography>

                <Typography variant="p" className="mb-2">
                  Claiming your yields will withdraw <b>all</b> of the assets in this pair.
                </Typography>

                <Typography
                  variant="p"
                  className="mb-2"
                >
                  Select which asset you want to claim your yield as.
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
                  Claim Yield As:
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
                  onClick={() => handleClaimYield()}
                >
                  Claim All Yields
                </Button>
              </div>
            </>
          )}
        </>
      </Modal>
    </>
  )
};

export default YieldClaimModal;