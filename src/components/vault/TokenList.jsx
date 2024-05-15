import { useState } from "react";
import { ethers } from "ethers";

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

const TokenList = ({ assets, assetsLoading }) => {

  const { vaultStore } = useVaultStore();

  const [actionType, setActionType] = useState();
  const [useAsset, setUseAsset] = useState();

  const [subRow, setSubRow] = useState();

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

  return (
    <>
      <Card className="card-compact">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-fixed table-zebra">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Balance</th>
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
                  
                    return(
                      <>
                        <tr
                          key={index}
                          onClick={() => toggleSubRow(index)}
                          className="cursor-pointer hover"
                        >
                          <td>
                            {/* {symbol} */}
                            <TokenIcon
                              symbol={symbol}
                              style={{ height: "2rem", width: "2rem" }}
                            />
                          </td>
                          <td>
                            {ethers.formatUnits(amount, token.dec)}
                            <br/>
                            €{formattedCollateralValue}
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
                          key={index + 'sub'}
                          className={subRow === index + 'sub' ? (
                            'glass-alt-bg w-full p-4 h-auto'
                          ) : (
                            'glass-alt-bg w-full hidden h-0'
                          )}
                        >
                          <td colspan="3">
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

                                    onClick={() => handleClick('WITHDRAW', asset)}
                                    className="grow"
                                  >
                                    Withdraw
                                  </Button>
                                  <Button
                                    variant="outline"

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
                      </>
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