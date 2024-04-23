import { useEffect } from "react";
import { ethers } from "ethers";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {
  useWriteContract,
  useChainId,
  useAccount
} from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";

import {
  Tooltip,
  Card,
  Progress,
  Button,
} from 'react-daisyui';

import {
  useCurrentPageStore,
  useContractAddressStore,
  useVaultManagerAbiStore
} from "../../store/Store.jsx";

import Pagination from "../ui/Pagination.jsx";
import CenterLoader from "../ui/CenterLoader.jsx";

const VaultList = ({ vaults, vaultsLoading, tokenId }) => {
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const {
    arbitrumSepoliaContractAddress,
    arbitrumContractAddress,
  } = useContractAddressStore();

  const { address } = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();

  const vaultManagerAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumSepoliaContractAddress
      : arbitrumContractAddress;

  const { writeContract: mintVault, isError, isPending, isSuccess } = useWriteContract();

  const handleMintVault = async () => {
    if (chainId !== arbitrumSepolia.id && chainId !== arbitrum.id) {
      toast.error('Please change to Arbitrum network!');
      return;
    }
    mintVault({
      abi: vaultManagerAbi,
      address: vaultManagerAddress,
      functionName: 'mint',
      args: [],
    });
  };

  useEffect(() => {
    if (isPending) {
      // 
    } else if (isSuccess && tokenId) {
      navigate(`/vault/${tokenId.toString()}`);
    } else if (isError) {
      // 
    }
  }, [
    isError,
    isPending,
    isSuccess,
    tokenId
  ]);

  const { setCurrentPage, currentPage } = useCurrentPageStore();

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
      <Card compact className="bg-base-100 shadow-md">
        <Card.Body>
          <Card.Title tag="h2">
            Vault List
          </Card.Title>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
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
                  {sortedVaults
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
                      const vaultHealth = computeProgressBar(
                        vault.status.minted,
                        vault.status.totalCollateralValue
                      );
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
                        <tr key={index}>
                          <td className="hidden md:table-cell">
                            EUROs
                          </td>
                          <td>
                            {vault.status.version ? (
                              `V${vault.status.version}-`
                            ) : ('')}
                            {BigInt(vault.tokenId).toString()}
                          </td>
                          <td className="hidden md:table-cell">
                            €
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
                            &nbsp;EUROs
                          </td>
                          <td className="hidden md:table-cell">
                            {vault.status.liquidated ? (
                              <p>Vault Liquidated</p>
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
                          <td>
                            <Link
                              className="btn btn-outline btn-sm"
                              to={`/vault/${
                                BigInt(
                                  vault.tokenId
                                ).toString()
                              }`}
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

          <Card.Actions className="pt-4 justify-between items-center">
            <Pagination
              totalItems={sortedVaults.length || 0}
              perPage={itemsPerPage || 0}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
            <Button
              onClick={() => handleMintVault()}
              disabled={isPending}
              loading={isPending}
            >
              Create Vault
            </Button>
          </Card.Actions>
        </Card.Body>
      </Card>
    </>
  );
};

export default VaultList;