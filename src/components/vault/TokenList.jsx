import { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";
import axios from "axios";
import {
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import {
  Tooltip,
} from 'react-daisyui';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultStore,
  useGuestShowcaseStore,
  useGammaHypervisorsAllDataStore,
} from "../../store/Store";

import {
  ArbitrumVaults,
  SepoliaVaults,
  ArbitrumGammaVaults,
  SepoliaGammaVaults,
} from "./yield/YieldGammaVaults";

import { formatNumber, formatCurrency } from '../ui/NumberUtils';
import TokenNormalise from "../ui/TokenNormalise";
import Card from "../ui/Card";
import Button from "../ui/Button";
import CenterLoader from "../ui/CenterLoader";
import TokenIcon from "../ui/TokenIcon";
import Typography from "../ui/Typography";
import TokenActions from "./TokenActions";
import TokenValueChart from "./TokenValueChart";

const TokenList = ({
  assets,
  assetsLoading,
  vaultType,
  yieldEnabled,
}) => {
  const {
    useShowcase,
  } = useGuestShowcaseStore();
  const {
    gammaHypervisorsAllData,
    gammaHypervisorsAllDataLoading,
  } = useGammaHypervisorsAllDataStore();

  let currencySymbol = '';
  if (vaultType === 'EUROs') {
    currencySymbol = '€';
  }
  if (vaultType === 'USDs') {
    currencySymbol = '$';
  }

  const chainId = useChainId();

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  const gammaVaults = chainId === arbitrumSepolia.id
  ? SepoliaGammaVaults
  : ArbitrumGammaVaults;

  const { vaultStore } = useVaultStore();

  const [actionType, setActionType] = useState();
  const [useAsset, setUseAsset] = useState();

  const [subRow, setSubRow] = useState('0sub');

  const closeAction = () => {
    setActionType('');
  }

  const toggleSubRow = (index) => {
    const useRow = index + 'sub';

    if (subRow === useRow) {
      setSubRow('');
    } else {
      setSubRow(useRow);
    }
  }

  const [chartData, setChartData] = useState(undefined);

  const getChartData = async () => {
    try {
      const response = await axios.get(
        "https://smart-vault-api.thestandard.io/asset_prices"
      );
      const chainData =
        chainId === arbitrumSepolia.id
          ? response.data.arbitrum_sepolia
          : response.data.arbitrum;
      setChartData(chainData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  const vaultVersion = vaultStore?.status?.version || '';

  const useSwapV4 = vaultVersion >= 4;

  const [hideUnCol, setHideUnCol] = useState('SHOW');

  const handleUnColToggle = () => {
    if (hideUnCol === 'HIDE') {
      setHideUnCol('SHOW');
      localStorage.setItem("hideUnCol", 'SHOW');
    } else {
      setHideUnCol('HIDE');
      localStorage.setItem("hideUnCol", 'HIDE');
    }
  }

  useEffect(() => {
    const local = localStorage.getItem("hideUnCol", hideUnCol);
    setHideUnCol(local)
  }, []);

  let firstPositive = 0;
  if (assets && assets.length) {
    firstPositive = assets.find(item => item.amount > 0);
  }

  return (
    <>
      <Card className="card-compact">
        <div className="card-body">
          <div>
            <div className="flex flex-col sm:flex-row justify-between">
              <Typography variant="h2" className="card-title flex gap-0">
                <QueueListIcon className="mr-2 h-6 w-6 inline-block"/>
                Collateral Tokens
              </Typography>
              <div>
                <Button
                  color="ghost"
                  size="sm"
                  onClick={() => handleUnColToggle()}
                >
                  {hideUnCol === 'HIDE' ? (
                    'Show Unused Tokens'
                  ) : (
                    'Hide Unused Tokens'
                  )}
                </Button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Balance</th>
                  <th className="hidden md:table-cell">Price Development</th>
                  <th className="hidden md:table-cell">If Placed In Yield</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              {assetsLoading ? (null) : (
                <tbody>
                  {assets.map(function(asset, index) {
                    const amount = asset?.amount.toString();
                    const token = asset?.token;
                    const collateralValue = asset?.collateralValue;
                    const symbol = ethers.decodeBytes32String(asset?.token?.symbol);

                    const handleClick = (type, asset) => {
                      setActionType(type);
                      setUseAsset(asset);
                    };

                    let useData = [];
                    
                    if (chartData && chartData[symbol] && chartData[symbol].prices) {
                      useData = chartData[symbol].prices;
                    }

                    let latestPrice;
                    if (useData && useData.length) {
                      latestPrice = useData[useData.length - 1]?.price;
                    }

                    let showLatestPrice;
                    if (latestPrice) {
                      showLatestPrice = formatCurrency('$', (latestPrice / 100000000), 2)
                    }

                    let tokenYield = yieldVaultsInfo.find(item => item.asset === symbol);
                    let yieldPair;
                    if (tokenYield && tokenYield.pair) {
                      yieldPair = tokenYield.pair;
                    }

                    let gammaVault = {};
                    let gammaAddress;
                    if (yieldPair) {
                      gammaVault = gammaVaults.find(vault => (
                        // vault.pair.length === yieldPair.length && 
                        // vault.pair.every((token, index) => token === yieldPair[index])
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
                      gammaYield = gammaData.feeApr * 100;
                    }

                    const balance = ethers.formatUnits(amount, token.dec);

                    let formatBalance = formatNumber(balance, token.dec);

                    if (!(Number(balance) > 0)) {
                      formatBalance = formatNumber(0, 2);
                    }

                    const depositDisabled = symbol === 'RDNT' || symbol === 'SUSHI';

                    if (hideUnCol === 'HIDE') {
                      // if ((Number(balance) > 0)) {
                      //   if (firstPositive) {
                      //     if (subRow === '0sub') {
                      //       setSubRow(assets.indexOf(firstPositive) + 'sub')
                      //     }  
                      //   }
                      //   if (!firstPositive && subRow !== '0sub') {
                      //     setSubRow('0sub')
                      //   }
                      // }
                      if (!(Number(balance) > 0)) {
                        if (firstPositive && subRow === index + 'sub') {
                          setSubRow(assets.indexOf(firstPositive) + 'sub')
                        }
                        return (null);
                      }
                    }


                    return (
                      <Fragment key={index}>
                        <tr
                          onClick={() => toggleSubRow(index)}
                          className={subRow === index + 'sub' ? (
                            'cursor-pointer hover active'
                          ) : (
                            'cursor-pointer hover'
                          )}
                        >
                          <td>
                            <div className="h-full w-full flex items-center">
                              <Tooltip
                                className="h-full"
                                position="top"
                                message={(TokenNormalise(symbol) || '' )}
                              >
                                <TokenIcon
                                  symbol={TokenNormalise(symbol)}
                                  style={{
                                    height: "1rem",
                                    width: "1rem",
                                    minHeight: 24,
                                    minWidth: 24
                                  }}
                                />
                              </Tooltip>
                              <div className="pl-4 hidden md:table-cell">
                                {TokenNormalise(symbol)}
                                <br/>
                                <span className="opacity-50">
                                  {showLatestPrice}
                                </span>
                              </div>                              
                            </div>
                          </td>
                          <td className="truncate max-w-[150px] md:max-w-[200px]">
                            <span className={
                              balance > 0 ? ('') : ('opacity-50')
                            }>
                              {formatBalance || ''}
                              <br/>
                              {formatCurrency(
                                currencySymbol,
                                Number(
                                  ethers.formatEther(collateralValue)
                                ),
                                2
                              )}
                            </span>
                          </td>
                          <td className="hidden md:table-cell">
                            <TokenValueChart
                              data={useData}
                              symbol={symbol}
                            />
                          </td>
                          <td className="hidden md:table-cell">
                          {gammaHypervisorsAllDataLoading ? (
                            <span className="loading loading-bars loading-xs"></span>
                          ) : (
                            <>
                              <span className={
                                gammaYield > 0 ? ('') : ('opacity-50')
                              }>
                                {subRow === index + 'sub' ? (
                                  <>
                                    Earn
                                    <br/>
                                    ≈ {gammaYield.toFixed(2)}% APY
                                  </>
                                ) : (
                                  <>
                                    {gammaYield.toFixed(2)}% APY
                                  </>
                                )}
                              </span>
                            </>
                          )}
                          </td>
                          <td className="text-right">
                            <Button
                              shape="circle"
                              color="ghost"
                              className="btn-sm"
                            >
                              {subRow === index + 'sub' ? (
                                <ChevronUpIcon className="w-5 h-5"/>
                              ) : (
                                <ChevronDownIcon className="w-5 h-5"/>
                              )}
                            </Button>
                          </td>
                        </tr>
                        <tr
                          className={subRow === index + 'sub' ? (
                            'glass-alt-bg w-full p-4 h-auto'
                          ) : (
                            'glass-alt-bg w-full hidden h-0'
                          )}
                        >
                          <td colSpan="5">
                            {vaultStore.status.liquidated ? null : (
                              <>
                                <div className="flex flex-row flex-wrap gap-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleClick('DEPOSIT', asset)}
                                    className="grow"
                                    disabled={useShowcase || depositDisabled}
                                  >
                                    Deposit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    disabled={useShowcase || amount <= 0}
                                    onClick={() => handleClick('WITHDRAW', asset)}
                                    className="grow"
                                  >
                                    Withdraw
                                  </Button>
                                  <Button
                                    variant="outline"
                                    disabled={useShowcase || amount <= 0}
                                    onClick={
                                      useSwapV4 ? (
                                        () => handleClick('SWAPV4', asset)
                                      ) : (
                                        () => handleClick('SWAP', asset)
                                      )
                                    }
                                    className="grow"
                                  >
                                    Swap
                                  </Button>
                                  <div className="btn-ping-wrap grow">
                                    <Button
                                      // variant="outline"
                                      color="success"
                                      disabled={useShowcase || amount <= 0 || !yieldEnabled || !tokenYield}
                                      onClick={() => handleClick('YIELD', asset)}
                                      className="grow"
                                    >
                                      Place In Yield Pool
                                    </Button>
                                    {(amount <= 0 || !yieldEnabled || !tokenYield) ? (null) : (
                                      <span className="btn-ping h-full w-full rounded-lg bg-green-400 opacity-75"></span>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      </Fragment>
                    )}
                  )}
                </tbody>
              )}
            </table>
            {assetsLoading ? (
              <CenterLoader />
            ) : (null)}
            {
              !assetsLoading &&
              (assets && assets.length) &&
              (hideUnCol === 'HIDE') &&
              !firstPositive ? (
                <div className="p-2 glass-alt-bg">
                  <Typography variant="h2">
                    No Collateral In Use
                  </Typography>
                  <Typography variant="p">
                    Click the button above to reveal unused collateral tokens
                  </Typography>
                </div>
              ) : (null)
            }
          </div>
          <TokenActions
            actionType={actionType}
            useAsset={useAsset}
            closeModal={closeAction}
            assets={assets}   
            vaultType={vaultType}         
          />
        </div>
      </Card>
    </>
  );
};

export default TokenList;