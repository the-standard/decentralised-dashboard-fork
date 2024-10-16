import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import {
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  AdjustmentsHorizontalIcon,
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

const YieldViewModal = ({
  isOpen,
  handleCloseModal,
  yieldPair,
  yieldQuantities,
  yieldHypervisor,
  gammaUser,
  gammaReturns,
  gammaStats,
  openClaim,
}) => {
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();
  const { writeContract, isError, isPending, isSuccess } = useWriteContract();
  const chainId = useChainId();

  const [claimAsset, setClaimAsset] = useState();
  const [ yieldStage, setYieldStage ] = useState('');
  const [ minCollateral, setMinCollateral ] = useState(50);

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  let allReturnTokens = [];

  if (yieldPair.toString() === 'USDs,USDC') {
    allReturnTokens = yieldVaultsInfo.filter(item => item.collateral === true);
  } else {
    allReturnTokens = yieldVaultsInfo.filter(item => item.pair.toString() === yieldPair.toString());
  }

  const handleSetClaimAsset = (e) => {
    setClaimAsset(e.target.value);
  };

  const positionUser = gammaUser?.[yieldHypervisor.toLowerCase()] || {};
  const positionStats = gammaStats?.find(item => item.hypervisor.toLowerCase() === yieldHypervisor.toLowerCase());
  const positionReturns = gammaReturns?.find((item) => item.hypervisor.toLowerCase() === yieldHypervisor.toLowerCase());

  const initialUSD = positionUser?.returns?.initialTokenUSD || 0;
  const initialTokenCurrentUSD = positionUser?.returns?.initialTokenCurrentUSD || 0;
  const currentUSD = positionUser?.returns?.currentUSD || 0;
  const hypervisorReturnsUSD = positionUser?.returns?.hypervisorReturnsUSD;
  const hypervisorReturnsPercentage = positionUser?.returns?.hypervisorReturnsPercentage;
  const tvlUSD = Number(positionStats?.tvlUSD) || 0;
  const showApy = Number(positionReturns?.feeApy * 100).toFixed(2);

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
            <AdjustmentsHorizontalIcon className="mr-2 h-6 w-6 inline-block"/>
            Yield Details
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

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          handleCloseModal();
        }}
        wide={false}
      >
        <>
          <div>
            <Typography variant="h2" className="card-title">
              <div className="flex items-center">
                <TokenIcon
                  symbol={yieldPair[0] || ''}
                  className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                />
                <TokenIcon
                  symbol={yieldPair[1] || ''}
                  className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                />
              </div>

              {yieldPair[0] || ''}/{yieldPair[1] || ''} Yield Pool
            </Typography>
          </div>
          <div className="mb-2">
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <Typography variant="p">
                  TVL
                </Typography>
                <Typography variant="h2">
                  ${tvlUSD?.toFixed(2) || ''}
                </Typography>
              </div>
              <div className="flex-1">
                <Typography variant="p">
                  APY
                </Typography>
                <Typography variant="h2">
                  {showApy || ''}%
                </Typography>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex flex-row gap-4 mb-4">
              <div className="flex-1">
                <Typography variant="p">
                  Principle at Deposit
                </Typography>
                <Typography variant="h2">
                  ${initialUSD?.toFixed(2) || ''}
                </Typography>
              </div>
              <div className="flex-1">
                <Typography variant="p">
                  Principle Currently
                </Typography>
                <Typography variant="h2">
                  ${initialTokenCurrentUSD?.toFixed(2) || ''}
                </Typography>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <Typography variant="p">
                  Net Value
                </Typography>
                <Typography variant="h2">
                  ${currentUSD?.toFixed(2) || ''}
                </Typography>
              </div>
              <div className="flex-1">
                <Typography variant="p">
                  Total Yield
                </Typography>
                <Typography variant="h2">
                  {hypervisorReturnsUSD ? (
                    <>
                      {hypervisorReturnsUSD < 0 ? (
                        '-$'
                      ) : (
                        '$'
                      )}
                      {
                        Math.abs(
                          hypervisorReturnsUSD
                        )?.toFixed(2) || ''
                      }
                    </>
                  ) : (
                    ''
                  )}
                    <Typography variant="p" className="inline-block text-xs">
                     &nbsp; {hypervisorReturnsPercentage}
                    </Typography>
                </Typography>
              </div>

            </div>
            <div className="mt-4">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th className="pl-0">Token</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                  <tbody>
                    <tr>
                      <td className="pl-0">
                        <div className="h-full w-full flex flex-row">
                          <div className="flex items-center">
                            <TokenIcon
                              symbol={yieldPair[0]}
                              className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                            />
                          </div>
                          <div className="pl-2 pt-2 table-cell">
                            {yieldPair[0]}
                          </div>
                        </div>
                      </td>
                      <td>
                        {yieldQuantities[0]}<br/>
                      </td>
                    </tr>
                    <tr>
                      <td className="pl-0">
                        <div className="h-full w-full flex flex-row">
                          <div className="flex items-center">
                            <TokenIcon
                              symbol={yieldPair[1]}
                              className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                            />
                          </div>
                          <div className="pl-2 pt-2 table-cell">
                            {yieldPair[1]}
                          </div>
                        </div>
                      </td>
                      <td>
                        {yieldQuantities[1]}
                      </td>
                    </tr>
                  </tbody>
              </table>
            </div>

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
              color="ghost"
              onClick={() => openClaim()}
            >
              Stop Earning Yield
            </Button>
          </div>
        </>
      </Modal>
    </>
  )
};

export default YieldViewModal;