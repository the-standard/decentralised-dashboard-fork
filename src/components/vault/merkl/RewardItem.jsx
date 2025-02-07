import { Fragment } from "react";
import { ethers } from "ethers";
import {
  Tooltip,
} from 'react-daisyui';

import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

import {
  useGuestShowcaseStore,
} from "../../../store/Store";

import Button from "../../ui/Button";
import TokenIcon from "../../ui/TokenIcon";

const RewardItem = ({
  vaultType,
  index,
  asset,
  handleClick,
  toggleSubRow,
  subRow,
}) => {
  const {
    useShowcase,
  } = useGuestShowcaseStore();

  let currencySymbol = '';
  if (vaultType === 'EUROs') {
    currencySymbol = '€';
  }
  if (vaultType === 'USDs') {
    currencySymbol = '$';
  }

  const claimed = asset?.accumulated;
  const unclaimed = asset?.unclaimed;
  const symbol = asset?.symbol;
  const decimals = asset?.decimals;
  const balance = asset?.balanceOf;

  return (
    <Fragment>
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
          {ethers.formatUnits(balance, decimals)}
        </td>
        <td className="hidden md:table-cell">
          {ethers.formatUnits(claimed, decimals)}
        </td>
        <td className="table-cell md:hidden"></td>
        <td>
          {ethers.formatUnits(unclaimed, decimals)}
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
        <td colSpan="5">
          <>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {/* {symbol === 'TST' ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleClick('CLAIM', asset)}
                    disabled={useShowcase || unclaimed <= 0}
                    className="grow"
                  >
                    Stake Rewards
                  </Button>
                </>
              ) : ( */}
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleClick('WITHDRAW', asset)}
                    disabled={useShowcase || balance <= 0}
                    className="grow"
                  >
                    Withdraw
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleClick('CLAIM', asset)}
                    disabled={useShowcase || unclaimed <= 0}
                    className="grow"
                  >
                    Claim Rewards
                  </Button>
                </>
              {/* )} */}
            </div>
          </>
        </td>
      </tr>
    </Fragment>
  )
};

export default RewardItem;