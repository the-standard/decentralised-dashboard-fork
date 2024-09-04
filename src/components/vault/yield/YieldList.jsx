import { useState } from "react";
import { ethers } from "ethers";
import {
  useWriteContract,
  useReadContract,
} from "wagmi";

import {
  useVaultAddressStore,
} from "../../../store/Store";

import smartVaultAbi from "../../../abis/smartVault";

import YieldClaimModal from "./YieldClaimModal";
import { YieldVaults, YieldGammaVaults } from "./YieldGammaVaults";

import CenterLoader from "../../ui/CenterLoader";
import TokenIcon from "../../ui/TokenIcon";

const YieldList = ({ assets, assetsLoading }) => {
  const [open, setOpen] = useState(false);
  const { vaultAddress } = useVaultAddressStore();

  const handleCloseModal = () => {
    setOpen(false)
  };

  const { data: yieldData, isLoading } = useReadContract({
    abi: smartVaultAbi,
    address: vaultAddress,
    functionName: "yieldAssets",
    args: [],
  });

  return (
    <div className="">
      <table className="table">
        <thead>
          <tr>
            <th>Earning Yield</th>
            <th>APY</th>
            <th>Value</th>
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

              return (
                <>
                  <tr
                    key={index}
                    className="cursor-pointer hover"
                    onClick={() => setOpen(true)}
                  >
                    <td>
                      <div className="h-full w-full flex flex-col">
                        <div className="flex items-center">
                          <TokenIcon
                            symbol={symbol}
                            className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                          />
                          <TokenIcon
                            symbol={symbol}
                            className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                          />
                        </div>
                        <div className="pt-2 hidden md:table-cell">
                          {symbol}/{symbol}
                        </div>
                      </div>
                    </td>
                    <td>
                      {ethers.formatUnits(amount, token.dec)}
                    </td>
                    <td>
                      €{formattedCollateralValue}
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
      <YieldClaimModal
        handleCloseModal={handleCloseModal}
        isOpen={open}
      />
    </div>
  );
};

export default YieldList;