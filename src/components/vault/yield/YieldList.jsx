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
} from "./YieldGammaVaults";

import CenterLoader from "../../ui/CenterLoader";
import TokenIcon from "../../ui/TokenIcon";
import Button from "../../ui/Button";

const YieldList = (props) => {
  const { yieldData } = props;
  const [ open, setOpen ] = useState(false);
  const [ yieldPair, setYieldPair ] = useState([]);
  const [ yieldQuantities, setYieldQuantities ] = useState([]);
  const [ yieldHypervisor, setYieldHypervisor ] = useState('');
  const chainId = useChainId();

  const handleCloseModal = () => {
    setYieldPair([]);
    setYieldQuantities([]);
    setYieldHypervisor('');
    setOpen(false);
  };

  const handleOpenModal = (pair, quantities, hypervisor) => {
    setYieldPair(pair);
    setYieldQuantities(quantities);
    setYieldHypervisor(hypervisor);
    setOpen(true);
  }

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  return (
    <div className="">
      <table className="table">
        <thead>
          <tr>
            <th>Yield Pair</th>
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
              
              const pair = [symbolA, symbolB];
              const quantities = [
                ethers.formatUnits(amountA, decA),
                ethers.formatUnits(amountB, decB),
              ];
              const hypervisor = item.hypervisor;

              return (
                <tr
                  key={index}
                  className="cursor-pointer hover"
                  onClick={() => handleOpenModal(pair, quantities, hypervisor)}
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
                    <b>{symbolA}:<br/></b>
                    {ethers.formatUnits(amountA, decA)}<br/>
                    <b>{symbolB}:<br/></b>
                    {ethers.formatUnits(amountB, decB)}
                  </td>
                  <td>
                    <Button
                      color="ghost"
                      onClick={() => handleOpenModal(pair, quantities, hypervisor)}
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
        yieldPair={yieldPair || []}
        yieldQuantities={yieldQuantities || []}
        yieldHypervisor={yieldHypervisor || ''}
      />
    </div>
  );
};

export default YieldList;