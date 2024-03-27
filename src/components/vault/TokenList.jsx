import { useState } from "react";
import { ethers } from "ethers";
import {
  Card,
  Button
} from 'react-daisyui';

import {
  useVaultStore,
} from "../../store/Store";

import CenterLoader from "../CenterLoader";
import TokenActions from "./TokenActions";

const TokenList = ({ assets, assetsLoading }) => {

  const { vaultStore } = useVaultStore();

  const [actionType, setActionType] = useState();
  const [useAsset, setUseAsset] = useState();

  const closeAction = () => {
    setActionType('');
  }

  return (
    <>
      <Card compact className="bg-base-100 shadow-md">
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
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
                      <tr key={index}>
                        <td>
                          {symbol}
                        </td>
                        <td>
                          {ethers.formatUnits(amount, token.dec)}
                          <br/>
                          €{formattedCollateralValue}
                        </td>
                        <td>
                          {vaultStore.status.liquidated ? null : (
                            <div>
                              <div className="flex flex-col space-x-0 space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleClick('DEPOSIT', asset)}
                                  className="w-full md:w-1/3"
                                >
                                  Deposit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleClick('WITHDRAW', asset)}
                                  className="w-full md:w-1/3"
                                >
                                  Withdraw
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleClick('SWAP', asset)}
                                  className="w-full md:w-1/3"
                                >
                                  Swap
                                </Button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
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

        </Card.Body>
      </Card>
    </>
  );
};

export default TokenList;