import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  useBlockNumber,
  useReadContract,
  useChainId,
  useWatchBlockNumber,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  useSmartVaultV4ABIStore,
  usesUSDAddressStore,
  useYieldBalancesStore,
} from "../../store/Store";

import {
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

import {
  Tooltip,
} from 'react-daisyui';

import Typography from "../ui/Typography";
import VaultHealth from "./VaultHealth";

const VaultStats = ({
  currentVault,
  currentVaultLoading,
  vaultType,
  yieldEnabled,
}) => {
  const { smartVaultV4ABI } = useSmartVaultV4ABIStore();
  const {
    arbitrumsUSDAddress,
    arbitrumSepoliasUSDAddress
  } = usesUSDAddressStore();
  const {
    yieldBalances,
    yieldBalancesLoading,
  } = useYieldBalancesStore();

  const chainId = useChainId();
  const { data: blockNumber } = useBlockNumber();
  const [renderedBlock, setRenderedBlock] = useState(blockNumber);

  const usdsAddress = chainId === arbitrumSepolia.id ?
    arbitrumSepoliasUSDAddress :
    arbitrumsUSDAddress;

  const { data: totalSupply, refetch: refetchTotalSupply, isLoading: isLoadingTotalSupply, isError, error } = useReadContract({
    abi: smartVaultV4ABI,
    address: usdsAddress,
    functionName: "totalSupply",
    args: [],
  });

  const { data: supplyLimit, refetch: refetchSupplyLimit, isLoading: isLoadingSupplyLimit } = useReadContract({
    abi: smartVaultV4ABI,
    address: usdsAddress,
    functionName: "supplyLimit",
    args: [],
  });

  useEffect(() => {
    if (isError) {
      console.error(error)
    }
  }, [
    isError,
  ]);

  useWatchBlockNumber({
    onBlockNumber() {
      setRenderedBlock(blockNumber);
      if (vaultType === 'USDs') {
        refetchTotalSupply();
        refetchSupplyLimit();  
      }
    },
  })

  let currencySymbol = '';
  if (vaultType === 'EUROs') {
    currencySymbol = '€';
  }
  if (vaultType === 'USDs') {
    currencySymbol = '$';
  }

  let availableSupply = 0n;

  if (
    (totalSupply != null) &&
    (supplyLimit != null)
  ) {
    availableSupply = supplyLimit - totalSupply;
  }

  if (Number(availableSupply) < 0) {
    availableSupply = 0;
  }

  let maxBorrow = 0;
  let maxMintable = 0n;
  let minted = 0n;
  let mintFeeRate = 0n;
  let totalCollateralValue = 0n;

  if (currentVault?.status?.maxMintable) {
    maxMintable = currentVault.status.maxMintable;
  }
  if (currentVault?.status?.minted) {
    minted = currentVault.status.minted;
  }
  if (currentVault?.mintFeeRate) {
    mintFeeRate = currentVault.mintFeeRate;
  }
  if (currentVault?.status?.totalCollateralValue) {
    totalCollateralValue = currentVault.status.totalCollateralValue;
  }

  maxBorrow = (
    (
      Number(ethers.formatEther(maxMintable)) - 
      Number(ethers.formatEther(minted))
    ) *
    (
      100000 - Number(mintFeeRate)
    )
  ) / 100000;

  if ( vaultType === 'USDs' && (maxBorrow >= availableSupply) ) {
    maxBorrow = availableSupply;
  }

  const collateralBalance = Number(
    ethers.formatEther(totalCollateralValue)
  ).toFixed(2);
  let yieldBalance = 0;
  if (yieldBalances && yieldBalances.length) {
    yieldBalance = yieldBalances.reduce((total, item) => {
      const value = parseFloat(item.balance);
      return total + (isNaN(value) ? 0 : value);
    }, 0);
  }
  const useTotalBalance = Number(collateralBalance) + Number(yieldBalance);

  const statsItemsBalances = [
    {
      title: "Total Balance",
      value: (
        currentVaultLoading ? (
          <span className="loading loading-bars loading-xs"></span>
        ) : (
          currencySymbol + Number(
            useTotalBalance
          ).toFixed(2)    
        )
      ),
      currency: "",
      tooltip: false,
      show: true,
    },
    {
      title: "Collateral Balance",
      value: (
        currentVaultLoading ? (
          <span className="loading loading-bars loading-xs"></span>
        ) : (
          currencySymbol + Number(
            collateralBalance
          ).toFixed(2)    
        )
      ),
      currency: "",
      tooltip: false,
      show: yieldEnabled,
    },
    {
      title: "Yield Pool Balance",
      value: (
        currentVaultLoading || yieldBalancesLoading ? (
          <span className="loading loading-bars loading-xs"></span>
        ) : (
          currencySymbol + Number(
            yieldBalance
          ).toFixed(2)    
        )
      ),
      currency: "",
      tooltip: false,
      show: yieldEnabled,
    },
  ];

  const statsItemsDebt = [
    {
      title: "Debt",
      value: (
        currentVaultLoading ? (
          <span className="loading loading-bars loading-xs"></span>
        ) : (
          Number(ethers.formatEther(minted)).toFixed(2)
        )
      ),
      currency: vaultType,
      tooltip: false,
      show: true,
    },
    {
      title: "Global Borrow Limit",
      value: (
        isLoadingSupplyLimit || isLoadingTotalSupply ? (
          <span className="loading loading-bars loading-xs"></span>
        ) : (
          Number(ethers.formatEther(availableSupply)).toFixed(2)
        )
      ),
      currency: vaultType,
      tooltip: `Total ${vaultType} remaining available on this network for all users.`,
      show: vaultType === 'USDs',
    },
    {
      title: "Borrow up to",
      value: (
        vaultType === 'USDs' ? (
          currentVaultLoading || isLoadingSupplyLimit || isLoadingTotalSupply ? (
            <span className="loading loading-bars loading-xs"></span>
          ) : (
            Number(maxBorrow).toFixed(2)
          )
        ) : (
          currentVaultLoading ? (
            <span className="loading loading-bars loading-xs"></span>
          ) : (
            Number(maxBorrow).toFixed(2)
          )
        )
      ),
      currency: vaultType,
      tooltip: `Total ${vaultType} you can borrow, based on your balance & global limit.`,
      show: true,
    },
  ];


  return (
    <>
      {/* <div className="flex flex-wrap"> */}
      {yieldEnabled ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {statsItemsBalances.map((item, index) => {
              if (item.show) {
                return (
                  <div
                    key={index}
                  >
                    <Typography
                      variant="p"
                    >
                      {item.title}
                      {/* {item.tooltip ? (
                        <Tooltip
                          className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                          position="top"
                          message={item.tooltip}
                        >
                          <QuestionMarkCircleIcon
                            className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                          />
                        </Tooltip>
                      ) : (null)} */}
                    </Typography>
                    <div>
                      <Typography
                        variant="h2"
                      >
                        {item.value}&nbsp;
                      </Typography>
                      <Typography
                        variant="p"
                      >
                        {item.currency}
                      </Typography>
                    </div>
                  </div>  
                )
              }
            })}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
            {statsItemsDebt.map((item, index) => {
              if (item.show) {
                return (
                  <div
                    key={index}
                  >
                    <Typography
                      variant="p"
                    >
                      {item.title}
                      {/* {item.tooltip ? (
                        <Tooltip
                          className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                          position="top"
                          message={item.tooltip}
                        >
                          <QuestionMarkCircleIcon
                            className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                          />
                        </Tooltip>
                      ) : (null)} */}
                    </Typography>
                    <div>
                      <Typography
                        variant="h2"
                      >
                        {item.value}&nbsp;
                      </Typography>
                      <Typography
                        variant="p"
                      >
                        {item.currency}
                      </Typography>
                    </div>
                  </div>  
                )
              }
            })}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {[...statsItemsBalances, ...statsItemsDebt].map((item, index) => {
              if (item.show) {
                return (
                  <div
                    key={index}
                  >
                    <Typography
                      variant="p"
                    >
                      {item.title}
                      {/* {item.tooltip ? (
                        <Tooltip
                          className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                          position="top"
                          message={item.tooltip}
                        >
                          <QuestionMarkCircleIcon
                            className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                          />
                        </Tooltip>
                      ) : (null)} */}
                    </Typography>
                    <div>
                      <Typography
                        variant="h2"
                      >
                        {item.value}&nbsp;
                      </Typography>
                      <Typography
                        variant="p"
                      >
                        {item.currency}
                      </Typography>
                    </div>
                  </div>  
                )
              }
            })}
          </div>
        </>
      )}
      <div className="w-full px-1 mt-4">
        {currentVault.status.liquidated ? (
          <Typography variant="h1" className="text-error">
            Vault Liquidated
          </Typography>
        ) : (
          <VaultHealth currentVault={currentVault}/>
        )}
      </div>
    </>
  )

};

export default VaultStats;