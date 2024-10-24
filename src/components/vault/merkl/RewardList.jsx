import { useState, Fragment } from "react";
import { ethers } from "ethers";
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
} from "../../../store/Store";

import Card from "../../ui/Card";
import Button from "../../ui/Button";
import CenterLoader from "../../ui/CenterLoader";
import TokenIcon from "../../ui/TokenIcon";
import Typography from "../../ui/Typography";

const RewardList = ({
  merklRewards,
  merklRewardsLoading,
  vaultType,
}) => {

  let currencySymbol = '';
  if (vaultType === 'EUROs') {
    currencySymbol = '€';
  }
  if (vaultType === 'USDs') {
    currencySymbol = '$';
  }

  const { vaultStore } = useVaultStore();

  const [subRow, setSubRow] = useState('0sub');

  const toggleSubRow = (index) => {
    const useRow = index + 'sub';

    if (subRow === useRow) {
      setSubRow('');
    } else {
      setSubRow(useRow);
    }
  }

  const vaultVersion = vaultStore?.status?.version || '';

  const useSwapV4 = vaultVersion >= 4;

  return (
    <>
      {/* <Card className="card-compact">
        <div className="card-body"> */}
          <div>
            <Typography variant="h2" className="card-title flex gap-0">
              <QueueListIcon className="mr-2 h-6 w-6 inline-block"/>
              Merkl Reward Tokens
            </Typography>
            <table className="table table-fixed">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Tokens</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              {merklRewardsLoading ? (null) : (
                <tbody>
                  {merklRewards.map(function(asset, index) {
                    const claimed = asset?.accumulated || '';
                    const unclaimed = asset?.unclaimed || '';
                    const symbol = asset.symbol || '';

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
                                  isMerkl={true}
                                />
                              </Tooltip>
                              <div className="p-4 hidden md:table-cell">{symbol}</div>
                            </div>
                          </td>
                          <td>
                            <span className="opacity-60">
                              Accumulated:
                            </span>
                            <br/>
                            {ethers.formatUnits(claimed, asset.decimals)}
                            <br/>
                            <span className="opacity-60">
                              Unclaimed:
                            </span>
                            <br/>
                            {ethers.formatUnits(unclaimed, asset.decimals)}
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
                          <td colSpan="3">
                            <>
                              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                                <Button
                                  variant="outline"
                                  disabled={claimed <= 0}
                                  onClick={() => handleClick('WITHDRAW', asset)}
                                  className="grow"
                                >
                                  Withdraw
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleClick('DEPOSIT', asset)}
                                  disabled={unclaimed <= 0}
                                  className="grow"
                                >
                                  Claim
                                </Button>
                              </div>
                            </>
                          </td>
                        </tr>
                      </Fragment>
                    )}
                  )}
                </tbody>
              )}
            </table>
            {merklRewardsLoading ? (
              <CenterLoader />
            ) : (null)}
          </div>
        {/* </div>
      </Card> */}
    </>
  );
};

export default RewardList;