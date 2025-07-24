import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Tooltip,
  Progress,
} from 'react-daisyui';
import { ethers } from "ethers";
import {
  useChainId,
  useReadContract,
  useReadContracts,
  useWatchBlockNumber,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  usesUSDContractAddressStore,
  useVaultManagerAbiStore,
  useGuestShowcaseStore,
} from "../../store/Store";

import { useInactivityControl } from '../InactivityControl';

import { formatNumber, formatCurrency } from '../ui/NumberUtils';

import Card from "../ui/Card";
import CenterLoader from "../ui/CenterLoader";
import Typography from "../ui/Typography";

import seurologo from "../../assets/EUROs.svg";
import susdlogo from "../../assets/USDs.svg";

const VaultList = ( props ) => {
  const { vaults, vaultsLoading, listType} = props;
  const { isActive } = useInactivityControl();
  const navigate = useNavigate();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const {
    useWallet,
  } = useGuestShowcaseStore();
  const {
    arbitrumsUSDSepoliaContractAddress,
    arbitrumsUSDContractAddress,
  } = usesUSDContractAddressStore();

  const chainId = useChainId();
  const accountAddress = useWallet;

  const vaultManagerAddress =
  chainId === arbitrumSepolia.id
    ? arbitrumsUSDSepoliaContractAddress
    : arbitrumsUSDContractAddress;      

  const vaultContracts = vaults?.map((item) => {
    return ({
      abi: vaultManagerAbi,
      address: vaultManagerAddress,
      functionName: "vaultData",
      args: [item?.tokenID || ''],
    })
  });

  const { data: vaultData, refetch: refetchVaultData } = useReadContracts({
    contracts: vaultContracts,
    enabled: isActive,
  });

  const useVaults = vaultData?.map((item) => {
    if (item && item.result) {
      return (
        item.result
      )    
    }
  });

  const { data: userVaultIDs, refetch: refetchUserVaultIDs } = useReadContract({
    abi: vaultManagerAbi,
    address: vaultManagerAddress,
    functionName: "vaultIDs",
    args: [accountAddress || ethers?.constants?.AddressZero],
    enabled: isActive,
  });

  useWatchBlockNumber({
    enabled: isActive,
    onBlockNumber() {
      refetchVaultData();
    },
  })

  let currencySymbol = '$';

  const computeProgressBar = (
    totalDebt,
    totalCollateralValue
  ) => {
    return totalCollateralValue === 0n
      ? "0.0"
      : (Number((10000n * totalDebt) / totalCollateralValue) / 100).toFixed(2);
  };

  const calculateVaultHealth = (status) => {
    return status?.totalCollateralValue && status.totalCollateralValue !== 0n
      ? Number((10000n * status.minted) / status.totalCollateralValue) / 100
      : 0;
  };

  function truncateToTwoDecimals(num) {
    const withTwoDecimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/);
    return withTwoDecimals ? withTwoDecimals[0] : num;
  }

  return (
    <>
      <Card className="card-compact mb-4">
        <div className="card-body">
          <Typography variant="h2" className="card-title">
            {listType} Vaults
          </Typography>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="hidden md:table-cell">Type</th>
                  <th>Vault ID</th>
                  <th className="hidden md:table-cell">Collateral</th>
                  <th>Debt</th>
                  <th className="hidden md:table-cell">Ratio</th>
                </tr>
              </thead>
              {vaultsLoading ? (null) : (
                <tbody>
                  {useVaults && useVaults.length ? (
                    <>
                      {useVaults
                        .sort((a, b) => {
                          // Sort by health percent
                          const vaultHealthA = calculateVaultHealth(a?.status);
                          const vaultHealthB = calculateVaultHealth(b?.status);
                          
                          if (vaultHealthA < vaultHealthB) {
                            return 1;
                          } else if (vaultHealthB < vaultHealthA) {
                            return -1;
                          } else {
                            return 0;
                          }
                        })
                        .map(function(vault, index) {
                          if (!vault || !vault.status) {
                            return(
                              <tr
                                key={index}
                                className="active animate-pulse"
                              >
                                <td className="hidden md:table-cell">
                                  <div className="rounded-full bg-base-content h-[42px] w-[42px] opacity-30"></div>
                                </td>
                                <td>
                                  <div className="rounded-lg bg-base-content h-[12px] w-[38px] opacity-30"></div>
                                </td>
                                <td className="hidden md:table-cell">
                                  <div className="rounded-lg bg-base-content h-[12px] w-[72px] opacity-30"></div>
                                </td>
                                <td>
                                  <div className="rounded-lg bg-base-content h-[12px] w-[92px] opacity-30"></div>
                                </td>
                                <td className="hidden md:table-cell">
                                  <div className="rounded-lg bg-base-content h-[12px] w-[120px] opacity-30"></div>
                                </td>
                                <td className="text-right">
                                  <div className="rounded-lg bg-base-content h-[38px] w-[64px] opacity-30"></div>
                                </td>
                              </tr> 
                            )
                          }
                          let vaultType = '';
                          if (vault?.status?.vaultType) {
                            vaultType = ethers.decodeBytes32String(vault?.status?.vaultType);
                          }
                          let vaultHealth = 100;
                          if (vault?.status) {
                            vaultHealth = computeProgressBar(
                              vault?.status?.minted,
                              vault?.status?.totalCollateralValue
                            );
                          }
                          let healthColour = 'success';
                          if (vaultHealth >= 30) {
                            healthColour = 'neutral';
                          }
                          if (vaultHealth >= 50) {
                            healthColour = 'warning';
                          }
                          if (vaultHealth >= 75) {
                            healthColour = 'error';
                          }

                          let userOwned = false;
                          if (userVaultIDs && userVaultIDs.includes(vault.tokenId)) {
                            userOwned = true;
                          }

                          if (!Number(vaultHealth) > 0) {
                            return null;
                          }

                          return(
                            <tr
                              key={index}
                              className={userOwned ? (
                                'cursor-pointer hover'
                              ) : (
                                ''
                              )}
                              onClick={
                                userOwned ? (
                                  () => navigate(
                                    `/vault/${vaultType.toString()}/${
                                      BigInt(
                                        vault.tokenId
                                      ).toString()
                                    }`
                                  )
                                ) : (() => {})
                              }
                            >
                              <td className="hidden md:table-cell">
                                <Tooltip
                                  className="h-full"
                                  position="top"
                                  message={(vaultType || '' )}
                                >
                                  {vaultType === 'EUROs' ? (
                                    <img
                                      style={{
                                        display: "block",
                                        width: "42px",
                                      }}
                                      src={seurologo}
                                      alt="EUROs"
                                    />
                                  ) : null}
                                  {vaultType === 'USDs' ? (
                                    <img
                                      style={{
                                        display: "block",
                                        width: "42px",
                                      }}
                                      src={susdlogo}
                                      alt="USDs"
                                    />
                                  ) : null}
                                </Tooltip>
                              </td>
                              <td>
                                {vault?.status?.version ? (
                                  `V${vault?.status?.version}-`
                                ) : ('')}
                                {BigInt(vault?.tokenId).toString()}
                              </td>
                              <td className="hidden md:table-cell">
                                {formatCurrency(
                                  currencySymbol,
                                  ethers.formatEther(
                                    BigInt(
                                      vault.status.totalCollateralValue
                                    ).toString()
                                  ),
                                  2
                                )}
                              </td>
                              <td>
                                {formatNumber(
                                  truncateToTwoDecimals(
                                    ethers.formatEther(vault.status.minted.toString())
                                  )
                                )}
                                &nbsp;
                                {vaultType.toString()}
                              </td>
                              <td className="hidden md:table-cell">
                                {vault.status.liquidated ? (
                                  <Typography variant="p" className="text-error">
                                    Vault Liquidated
                                  </Typography>
                                ) : (
                                  <Tooltip
                                    className="w-full h-full"
                                    position="top"
                                    message={(vaultHealth || 0 ) + '%'}
                                  >
                                    <Progress
                                      value={vaultHealth || 0}
                                      max="100"
                                      color={healthColour || 'neutral'}
                                    />
                                  </Tooltip>
                                )}
                              </td>
                              <td className="text-right">
                                {userOwned ? (
                                  <Link
                                    className="btn btn-outline"
                                    disabled={!vault.tokenId}
                                    to={
                                      vault?.tokenId ? (
                                        `/vault/${
                                          BigInt(
                                            vault?.tokenId
                                          ).toString()
                                        }`
                                      ) : (
                                        `/`
                                      )
                                    }
                                  >
                                    Manage
                                  </Link>
                                ) : (<></>)}
                              </td>
                            </tr> 
                          )}
                      )}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        No Data
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
            {vaultsLoading ? (
              <CenterLoader />
            ) : (null)}
          </div>
        </div>
      </Card>
    </>
  );
};

export default VaultList;