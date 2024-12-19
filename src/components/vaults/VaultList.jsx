import { useEffect } from "react";
import { ethers } from "ethers";
import { Link, useNavigate } from "react-router-dom";

import {
  Tooltip,
  Progress,
} from 'react-daisyui';

import {
  useCurrentPageStore,
  usesUSDVaultListPageStore,
  usesEURVaultListPageStore,
} from "../../store/Store";

import Card from "../ui/Card";
import Pagination from "../ui/Pagination";
import CenterLoader from "../ui/CenterLoader";
import Typography from "../ui/Typography";

import seurologo from "../../assets/EUROs.svg";
import susdlogo from "../../assets/USDs.svg";

const VaultList = ({ vaults, vaultsLoading, listType }) => {

  const { setCurrentsUSDPage, currentsUSDPage } = usesUSDVaultListPageStore();
  const { setCurrentsEURPage, currentsEURPage } = usesEURVaultListPageStore();

  let setCurrentPage;
  let currentPage;
  let currencySymbol = '';

  if (listType === 'USDs') {
    setCurrentPage = setCurrentsUSDPage;
    currentPage = currentsUSDPage;
    currencySymbol = '$';
  } else {
    setCurrentPage = setCurrentsEURPage;
    currentPage = currentsEURPage;
    currencySymbol = '€';
  }

  const navigate = useNavigate();

  const sortedVaults = [...vaults].sort((a, b) => {
    const idA = BigInt(a.tokenId);
    const idB = BigInt(b.tokenId);
    if (idA < idB) {
      return 1;
    } else if (idB < idA) {
      return -1;
    } else {
      return 0;
    }
  });

  const itemsPerPage = 5;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    return () => {
      localStorage.setItem("currentPage", currentPage);
    };
  }, [currentPage]);

  useEffect(() => {
    const page = localStorage.getItem("currentPage");
    if (page) {
      setCurrentPage(Number(page));
    }
  }, []);

  const computeProgressBar = (
    totalDebt,
    totalCollateralValue
  ) => {
    return totalCollateralValue === 0n
      ? "0.0"
      : (Number((10000n * totalDebt) / totalCollateralValue) / 100).toFixed(2);
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
                  {sortedVaults?.length && sortedVaults
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .sort((a, b) => {
                      const vaultA = BigInt(a.tokenId);
                      const vaultB = BigInt(b.tokenId);              
                      if (vaultA < vaultB) {
                        return 1;
                      } else if (vaultB < vaultA) {
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

                      return(
                        <tr
                          key={index}
                          className="cursor-pointer hover"
                          onClick={() => navigate(
                            `/vault/${vaultType.toString()}/${
                              BigInt(
                                vault.tokenId
                              ).toString()
                            }`
                          )}
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
                            {currencySymbol}
                            {truncateToTwoDecimals(
                              ethers.formatEther(
                                BigInt(
                                  vault.status.totalCollateralValue
                                ).toString()
                              )
                            )}
                          </td>
                          <td>
                            {truncateToTwoDecimals(
                              ethers.formatEther(vault.status.minted.toString())
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
                          </td>
                        </tr> 
                      )}
                    )
                  }
                </tbody>
              )}
            </table>
            {vaultsLoading ? (
              <CenterLoader />
            ) : (null)}
          </div>

          <div className="card-actions pt-4 justify-between items-center">
            {sortedVaults && sortedVaults.length ? (
              <Pagination
                totalItems={sortedVaults.length || 0}
                perPage={itemsPerPage || 0}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />            
            ) : (
              <div>&nbsp;</div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default VaultList;