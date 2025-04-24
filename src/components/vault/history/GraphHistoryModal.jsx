import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { ethers } from "ethers";
import moment from 'moment';
import axios from "axios";
import {
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  DocumentDuplicateIcon,
} from '@heroicons/react/24/solid';

import {
  ArbitrumVaults,
  SepoliaVaults,
} from "../yield/YieldGammaVaults";

import TokenNormalise from "../../ui/TokenNormalise";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Typography from "../../ui/Typography";

const GraphHistoryModal = ({
  isOpen,
  handleCloseModal,
  historyItem,
  handleEtherscanLink,
  currentPage,
  vaultAddress
}) => {

  const chainId = useChainId();

  const yieldTokenInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  const {
    useGraphId,
    useType,
    showType,
    useDate,
    useDebt,
    useTotalCollateralValue,
    txHash,
  } = historyItem;

  const [graphDataLoading, setGraphDataLoading] = useState(true);
  const [graphData, setGraphData] = useState({});


  useEffect(() => {
    if ((historyItem) && (Object.keys(historyItem).length > 0)) {
      getGraphData();
    }
  }, [historyItem]);

  const getGraphData = async () => {
    try {
      setGraphDataLoading(true);
      const response = await axios.get(
        `https://smart-vault-api.thestandard.io/transactions/${vaultAddress}/${useGraphId}?page=${currentPage}&detailType=${useType}`
      );
      const data = response.data[useType];
      setGraphData(data);
      setGraphDataLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyText = (copyText) => {
    const textElement = copyText;

    if (navigator.clipboard && textElement) {
      const text = textElement;

      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success('Copied to clipboard!');
        })
        .catch((error) => {
          toast.error('There was a problem');
        });
    }
  };

  const graphTo = graphData?.to;
  const graphFrom = graphData?.from;
  const graphAmount = graphData?.amount;
  const graphFee = graphData?.fee;
  const graphSymbol = graphData?.symbol;
  const graphTokenAddress = graphData?.token;
  const graphVaultAddress = graphData?.vaultAddress;
  const graphOwner = graphData?.owner;
  const graphTokenId = graphData?.tokenId;
  const graphTokenIn = graphData?.tokenIn;
  const graphAmountIn = graphData?.amountIn;
  const graphTokenOut = graphData?.tokenOut;
  const graphFeeRate = graphData?.feeRate;

  let useTo = '';
  if (graphTo) {
    useTo = graphTo;
  }
  let useFrom = '';
  if (graphFrom) {
    useFrom = graphFrom;
  }
  let useAmount = '';
  if (graphAmount) {
    useAmount = ethers.formatEther(graphAmount.toString());
  }
  let useFee = '';
  if (graphFee) {
    useFee = ethers.formatEther(graphFee.toString());
  }
  let useSymbol = '';
  if (graphSymbol) {
    useSymbol = ethers.decodeBytes32String(graphSymbol);
  }
  let useTokenAddress = '';
  if (graphTokenAddress) {
    useTokenAddress = graphTokenAddress;
  }
  let useVaultAddress = '';
  if (graphVaultAddress) {
    useVaultAddress = graphVaultAddress;
  }
  let useOwner = '';
  if (graphOwner) {
    useOwner = graphOwner;
  }
  let useTokenId = '';
  if (graphTokenId) {
    useTokenId = graphTokenId;
  }
  let useTokenIn = '';
  if (graphTokenIn) {
    useTokenIn = graphTokenIn;
  }

  let useAmountIn = '';
  let tokenInDecimals = 8;
  let tokenInfo = yieldTokenInfo.find(item => item.asset === useTokenIn);
  if (tokenInfo && tokenInfo.dec) {
    tokenInDecimals = Number(tokenInfo.dec);
  }
  if (graphAmountIn) {
    useAmountIn = ethers.formatUnits(graphAmountIn.toString(), tokenInDecimals);
  }
  
  let useTokenOut = '';
  if (graphTokenOut) {
    useTokenOut = graphTokenOut;
  }
  let useFeeRate = '';
  if (graphFeeRate) {
    useFeeRate = Number(graphFeeRate) / 10000 + '%';
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
        wide={true}
      >
        <>
          <div>
            <Typography variant="h2" className="card-title">
              Vault Event
            </Typography>
          </div>
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
              <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                <Typography variant="p" className="opacity-40">
                  Event Type
                </Typography>
                <Typography variant="p" className="font-bold">
                  {showType}
                </Typography>
              </div>
              <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                <Typography variant="p" className="opacity-40">
                  Time
                </Typography>
                <Typography variant="p" className="font-bold">
                  {useDate}
                </Typography>
              </div>
              <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col col-span-2 sm:col-span-1">
                <Typography variant="p" className="opacity-40">
                  TX Hash
                </Typography>
                <Typography variant="p" className="font-bold">
                  <div className="flex items-center">
                    <span className="truncate overflow-hidden flex-1">
                      {txHash}
                    </span>
                    <Button
                      className="ml-[4px]"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyText(txHash)}
                    >
                      <DocumentDuplicateIcon
                        className="h-3 w-3 inline-block"
                      />
                    </Button>
                  </div>
                </Typography>
              </div>

            </div>

            {graphDataLoading ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col items-center justify-center col-span-2 sm:col-span-1 h-[64px] animate-pulse"><span className="loading loading-bars loading-md"></span></div>
                  <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col items-center justify-center col-span-2 sm:col-span-1 h-[64px] animate-pulse"><span className="loading loading-bars loading-md"></span></div>
                  <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col items-center justify-center col-span-2 sm:col-span-1 h-[64px] animate-pulse"><span className="loading loading-bars loading-md"></span></div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  {useTo ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col col-span-2 sm:col-span-1">
                      <Typography variant="p" className="opacity-40">
                        To
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          <>
                            {useTo ? (
                              <div className="flex items-center">
                                <span className="truncate overflow-hidden flex-1">
                                  {useTo}
                                </span>
                                <Button
                                  className="ml-[4px]"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopyText(useTo)}
                                >
                                  <DocumentDuplicateIcon
                                    className="h-3 w-3 inline-block"
                                  />
                                </Button>
                              </div>
                            ) : ('')}
                          </>
                        )}
                      </Typography>
                    </div>
                  ) : (null)}

                  {useFrom ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col col-span-2 sm:col-span-1">
                      <Typography variant="p" className="opacity-40">
                        From
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          <>
                            {useFrom ? (
                              <div className="flex items-center">
                                <span className="truncate overflow-hidden flex-1">
                                  {useFrom}
                                </span>
                                <Button
                                  className="ml-[4px]"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopyText(useFrom)}
                                >
                                  <DocumentDuplicateIcon
                                    className="h-3 w-3 inline-block"
                                  />
                                </Button>
                              </div>
                            ) : ('')}
                          </>
                        )}
                      </Typography>
                    </div>
                  ) : (null)}

                  {useTokenAddress ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col col-span-2 sm:col-span-1">
                      <Typography variant="p" className="opacity-40">
                        Token Address
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          <>
                            {useTokenAddress ? (
                              <div className="flex items-center">
                                <span className="truncate overflow-hidden flex-1">
                                  {useTokenAddress}
                                </span>
                                <Button
                                  className="ml-[4px]"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopyText(useTokenAddress)}
                                >
                                  <DocumentDuplicateIcon
                                    className="h-3 w-3 inline-block"
                                  />
                                </Button>
                              </div>
                            ) : ('')}
                          </>
                        )}
                      </Typography>
                    </div>
                  ) : (null)}

                  {useSymbol ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                      <Typography variant="p" className="opacity-40">
                        Asset
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          TokenNormalise(useSymbol) || ''
                        )}
                      </Typography>
                    </div>
                  ) : ('')}

                  {useTokenIn ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                      <Typography variant="p" className="opacity-40">
                        Token In
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          TokenNormalise(useTokenIn) || ''
                        )}
                      </Typography>
                    </div>
                  ) : ('')}

                  {useAmountIn ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                      <Typography variant="p" className="opacity-40">
                        Amount In
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          useAmountIn || ''
                        )}
                      </Typography>
                    </div>
                  ) : (null)}

                  {useTokenOut ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                      <Typography variant="p" className="opacity-40">
                        Token Out
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          TokenNormalise(useTokenOut) || ''
                        )}
                      </Typography>
                    </div>
                  ) : ('')}

                  {useFeeRate ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                      <Typography variant="p" className="opacity-40">
                        Uniswap Fee Rate
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          useFeeRate || ''
                        )}
                      </Typography>
                    </div>
                  ) : (null)}

                  {useAmount ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                      <Typography variant="p" className="opacity-40">
                        Amount
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          useAmount || ''
                        )}
                      </Typography>
                    </div>
                  ) : (null)}

                  {useFee ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                      <Typography variant="p" className="opacity-40">
                        Fee
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          useFee || ''
                        )}
                      </Typography>
                    </div>
                  ) : (null)}

                  {useVaultAddress ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col col-span-2 sm:col-span-1">
                      <Typography variant="p" className="opacity-40">
                        Vault Address
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          <div className="flex items-center">
                            <span className="truncate overflow-hidden flex-1">
                              {useVaultAddress}
                            </span>
                            <Button
                              className="ml-[4px]"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyText(useVaultAddress)}
                            >
                              <DocumentDuplicateIcon
                                className="h-3 w-3 inline-block"
                              />
                            </Button>
                          </div>
                        )}
                      </Typography>
                    </div>
                  ) : (null)}
                  {useOwner ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col col-span-2 sm:col-span-1">
                      <Typography variant="p" className="opacity-40">
                        Vault Owner
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          <div className="flex items-center">
                            <span className="truncate overflow-hidden flex-1">
                              {useOwner}
                            </span>
                            <Button
                              className="ml-[4px]"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyText(useOwner)}
                            >
                              <DocumentDuplicateIcon
                                className="h-3 w-3 inline-block"
                              />
                            </Button>
                          </div>
                        )}
                      </Typography>
                    </div>
                  ) : (null)}
                  {useTokenId ? (
                    <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                      <Typography variant="p" className="opacity-40">
                        Token ID
                      </Typography>
                      <Typography variant="p" className="font-bold">
                        {graphDataLoading ? (
                          <span className="loading loading-bars loading-md"></span>
                        ) : (
                          useTokenId || ''
                        )}
                      </Typography>
                    </div>
                  ) : (null)}

                </div>

              </>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
              <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                <Typography variant="p" className="opacity-40">
                  Vault Debt (USDs)
                </Typography>
                <Typography variant="p" className="font-bold">
                  {useDebt || ''}
                </Typography>
              </div>
              <div className="bg-base-300/40 p-2 rounded-lg w-full flex flex-col">
                <Typography variant="p" className="opacity-40">
                  Total Collateral Value ($)
                </Typography>
                <Typography variant="p" className="font-bold">
                  {useTotalCollateralValue || ''}
                </Typography>
              </div>
            </div>
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
              className="w-full lg:w-auto"
              variant="outline"
              onClick={() => handleEtherscanLink(txHash)}
            >
              View On Arbiscan
            </Button>
          </div>
        </>
      </Modal>
    </>
  )
};

export default GraphHistoryModal;