import { useState } from "react";
import { ethers } from "ethers";
import {
  useChainId
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import YieldClaimModal from "./YieldClaimModal";
import {
  ArbitrumVaults,
  SepoliaVaults,
  YieldVaults,
  YieldGammaVaults
} from "./YieldGammaVaults";

import CenterLoader from "../../ui/CenterLoader";
import TokenIcon from "../../ui/TokenIcon";
import Button from "../../ui/Button";

const YieldList = (props) => {
  const { yieldData, yieldIsPending } = props;
  const [ open, setOpen ] = useState(false);
  const chainId = useChainId();

  const handleCloseModal = () => {
    setOpen(false)
  };

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  return (
    <div className="">
      <table className="table">
        <thead>
          <tr>
            <th>Earning Yield</th>
            <th>Token Quantities</th>
            <th></th>
          </tr>
        </thead>
        {yieldData && yieldData.length ? (
          <tbody>
            {yieldData.map(function(item, index) {
              const tokenA = item.token0;
              const tokenB = item.token1;
              const amountA = item.amount0;
              const amountB = item.amount1;

              const tokenAdetails = yieldVaultsInfo.find(item => item.address === tokenA);

              const tokenBdetails = yieldVaultsInfo.find(item => item.address === tokenB);

              let symbolA = '';
              let symbolB = '';
              if (tokenAdetails?.symbol) {
                symbolA = ethers.decodeBytes32String(tokenAdetails.symbol);
              }
              if (tokenBdetails?.symbol) {
                symbolB = ethers.decodeBytes32String(tokenBdetails.symbol)
              }

              let decA = 18;
              let decB = 18;
              if (tokenAdetails?.dec) {
                decA = Number(tokenAdetails.dec);
              }
              if (tokenBdetails?.dec) {
                decB = Number(tokenBdetails.dec);
              }

              return (
                <tr
                  key={index}
                  className="cursor-pointer hover"
                  onClick={() => setOpen(true)}
                >
                  <td>
                    <div className="h-full w-full flex flex-col">
                      <div className="flex items-center">
                        <TokenIcon
                          symbol={symbolA}
                          className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                        />
                        <TokenIcon
                          symbol={symbolB}
                          className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                        />
                      </div>
                      <div className="pt-2 hidden md:table-cell">
                        {symbolA}/{symbolB}
                      </div>
                    </div>
                  </td>
                  <td>
                    {/* TODO add actual decimal */}
                    <b>{symbolA}:<br/></b>
                    {ethers.formatUnits(amountA, decA)}<br/>
                    <b>{symbolB}:<br/></b>
                    {ethers.formatUnits(amountB, decB)}
                  </td>
                  <td>
                    <Button
                      variant="outline"
                      onClick={() => setOpen(true)}
                      className="grow"
                    >
                      Claim
                    </Button>
                  </td>
                </tr>
              )}
            )}
          </tbody>        
        ) : (null)}
      </table>
      {yieldData && yieldData.length ? (null) : (
        <CenterLoader />
      )}
      <YieldClaimModal
        handleCloseModal={handleCloseModal}
        isOpen={open}
      />
    </div>
  );
};

export default YieldList;