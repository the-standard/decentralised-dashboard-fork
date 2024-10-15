import { useState } from "react";
import { ethers } from "ethers";
import {
  useChainId
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

import YieldClaimModal from "./YieldClaimModal";
import YieldViewModal from "./YieldViewModal";
import {
  ArbitrumVaults,
  SepoliaVaults,
} from "./YieldGammaVaults";
import CenterLoader from "../../ui/CenterLoader";
import TokenIcon from "../../ui/TokenIcon";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";

const YieldList = (props) => {
  const {
    yieldData,
    yieldIsPending,
    gammaUser,
    gammaReturns,
    gammaStats,
    gammaUserLoading,
    gammaReturnsLoading,
    gammaStatsLoading,
  } = props;

  const [ open, setOpen ] = useState('');
  const [ yieldPair, setYieldPair ] = useState([]);
  const [ yieldQuantities, setYieldQuantities ] = useState([]);
  const [ yieldHypervisor, setYieldHypervisor ] = useState('');
  const chainId = useChainId();

  const handleCloseModal = () => {
    setYieldPair([]);
    setYieldQuantities([]);
    setYieldHypervisor('');
    setOpen('');
  };

  const handleOpenModal = (pair, quantities, hypervisor, type) => {
    setYieldPair(pair);
    setYieldQuantities(quantities);
    setYieldHypervisor(hypervisor);
    setOpen(type);
  }

  const yieldVaultsInfo = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;

  return (
    <div className="">
      <Typography variant="h2" className="card-title flex gap-0">
        <AdjustmentsHorizontalIcon
          className="mr-2 h-6 w-6 inline-block"
        />
        Yield Pools
      </Typography>
      <table className="table">
        <thead>
          <tr>
            <th>Yield Pair</th>
            <th>APY</th>
            <th>Value</th>
            {/* <th>Token Quantities</th> */}
            <th></th>
          </tr>
        </thead>
        <>
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
                  const yieldReturns = gammaReturns?.find((item) => item.hypervisor === hypervisor);

                  const yieldUser = gammaUser?.[hypervisor.toLowerCase()];

                  const showApy = Number(yieldReturns?.feeApy * 100).toFixed(2);
                  const showBalance = yieldUser?.balanceUSD.toFixed(2) || '';

                  return (
                    <tr
                      key={index}
                      className="cursor-pointer hover"
                      onClick={() => handleOpenModal(pair, quantities, hypervisor, 'VIEW')}
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
                        {showApy || ''}%
                      </td>
                      <td>
                        ${showBalance || ''}
                      </td>
                      <td>
                        <Button
                          color="ghost"
                          onClick={() => handleOpenModal(pair, quantities, hypervisor, 'VIEW')}
                          className="grow"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  )}
                )}
              </tbody>
            ) : (null)}
          </>
      </table>
      {yieldData && yieldData.length ? (null) : (
        <CenterLoader />
      )}
      <YieldClaimModal
        handleCloseModal={() => handleCloseModal()}
        isOpen={open === 'CLAIM'}
        yieldPair={yieldPair || []}
        yieldQuantities={yieldQuantities || []}
        yieldHypervisor={yieldHypervisor || ''}
        gammaUser={gammaUser}
      />
      <YieldViewModal
        handleCloseModal={() => handleCloseModal()}
        isOpen={open === 'VIEW'}
        openClaim={() => handleOpenModal(yieldPair, yieldQuantities, yieldHypervisor, 'CLAIM')}
        yieldPair={yieldPair || []}
        yieldQuantities={yieldQuantities || []}
        yieldHypervisor={yieldHypervisor || ''}
        gammaUser={gammaUser}
        gammaReturns={gammaReturns}
        gammaStats={gammaStats}
      />
    </div>
  );
};

export default YieldList;