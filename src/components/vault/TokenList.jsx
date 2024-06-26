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
  useVaultStore,
} from "../../store/Store";

import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

import Card from "../ui/Card";
import Button from "../ui/Button";
import CenterLoader from "../ui/CenterLoader";
import TokenIcon from "../ui/TokenIcon";
import TokenActions from "./TokenActions";
import TokenValueChart from "./TokenValueChart";

const TokenList = ({ assets, assetsLoading }) => {

  const chainId = useChainId();

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

  return (
    <>
      <Card className="card-compact">
        <div className="card-body">
          <div className="">
            <table className="table table-fixed">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Balance</th>
                  <th className="hidden md:table-cell">Price Development</th>
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
                    const formattedCollateralValue = Number(
                      ethers.formatEther(collateralValue)
                    ).toFixed(2);

                    const handleClick = (type, asset) => {
                      setActionType(type);
                      setUseAsset(asset);
                    };

                    let useData = [];
                    
                    if (chartData && chartData[symbol] && chartData[symbol].prices) {
                      useData = chartData[symbol].prices;
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
                                message={(symbol || '' )}
                              >
                                <TokenIcon
                                  symbol={symbol}
                                  style={{ height: "2rem", width: "2rem" }}
                                />
                              </Tooltip>
                              <div className="p-4 hidden md:table-cell">{symbol}</div>
                            </div>
                          </td>
                          <td>
                            {ethers.formatUnits(amount, token.dec)}
                            <br/>
                            €{formattedCollateralValue}
                          </td>
                          <td className="hidden md:table-cell">
                            <TokenValueChart
                              data={useData}
                              symbol={symbol}
                            />
                          </td>
                          <td className="text-right">
                            <Button
                              shape="circle"
                              color="ghost"
                            >
                              {subRow === index + 'sub' ? (
                                <ChevronUpIcon className="w-6 h-6"/>
                              ) : (
                                <ChevronDownIcon className="w-6 h-6"/>
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
                          <td className="hidden md:table-cell"></td>
                          <td colSpan="3">
                            {vaultStore.status.liquidated ? null : (
                              <>
                                <div className="flex flex-row gap-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleClick('DEPOSIT', asset)}
                                    className="grow"
                                  >
                                    Deposit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    disabled={amount <= 0}
                                    onClick={() => handleClick('WITHDRAW', asset)}
                                    className="grow"
                                  >
                                    Withdraw
                                  </Button>
                                  <Button
                                    variant="outline"
                                    disabled={amount <= 0}
                                    onClick={() => handleClick('SWAP', asset)}
                                    className="grow"
                                  >
                                    Swap
                                  </Button>
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
          </div>
          <TokenActions
            actionType={actionType}
            useAsset={useAsset}
            closeModal={closeAction}
            assets={assets}            
          />

        </div>
      </Card>
    </>
  );
};

export default TokenList;