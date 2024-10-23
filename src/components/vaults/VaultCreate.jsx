import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {
  useWriteContract,
  useChainId,
  useAccount
} from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";

import {
  useContractAddressStore,
  usesUSDContractAddressStore,
  useVaultManagerAbiStore
} from "../../store/Store";

import Card from "../ui/Card";
import Button from "../ui/Button";
import Typography from "../ui/Typography";

import seurologo from "../../assets/EUROs.svg";
import susdlogo from "../../assets/USDs.svg";

const vaultTypes = [
  {
    title: "USDs (Standard Dollar)",
    para: "US Dollar pegged stablecoin",
    borrowRate: "Borrow up to 90.91%",
    type: 'USDs',
    image: susdlogo,
    isActive: true,
  },
  {
    title: "EUROs (Standard Euro)",
    para: "Euro pegged stablecoin",
    borrowRate: "Borrow up to 90.91%",
    type: 'EUROs',
    image: seurologo,
    isActive: false,
  },
];

const VaultCreate = ({ tokenId, vaultType }) => {
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const {
    arbitrumSepoliaContractAddress,
    arbitrumContractAddress,
  } = useContractAddressStore();

  const {
    arbitrumsUSDSepoliaContractAddress,
    arbitrumsUSDContractAddress,
  } = usesUSDContractAddressStore();

  const chainId = useChainId();
  const navigate = useNavigate();

  const vaultManagerAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumSepoliaContractAddress
      : arbitrumContractAddress;

  const sUSDVaultManagerAddress =
  chainId === arbitrumSepolia.id
    ? arbitrumsUSDSepoliaContractAddress
    : arbitrumsUSDContractAddress;  

  const { writeContract: mintVaultEur, isError: isErrorEur, isPending: isPendingEur, isSuccess: isSuccessEur } = useWriteContract();
  const { writeContract: mintVaultUsd, isError: isErrorUsd, isPending: isPendingUsd, isSuccess: isSuccessUsd } = useWriteContract();

  const handleMintVault = async (type) => {
    if (chainId !== arbitrumSepolia.id && chainId !== arbitrum.id) {
      toast.error('Please change to Arbitrum network!');
      return;
    }
    if (type === 'EUROs') {
      mintVaultEur({
        abi: vaultManagerAbi,
        address: vaultManagerAddress,
        functionName: 'mint',
        args: [],
      });
    }
    if (type === 'USDs') {
      mintVaultUsd({
        abi: vaultManagerAbi,
        address: sUSDVaultManagerAddress,
        functionName: 'mint',
        args: [],
      });
    }
  };

  useEffect(() => {
    if (isPendingEur || isPendingUsd) {
      // 
    } else if ((isSuccessEur || isSuccessUsd) && tokenId && vaultType) {
      navigate(`/vault/${vaultType.toString()}/${tokenId.toString()}`);
    } else if (isErrorEur || isErrorUsd) {
      toast.error('There was a problem');
    }
  }, [
    isErrorEur,
    isErrorUsd,
    isPendingEur,
    isPendingUsd,
    isSuccessEur,
    isSuccessUsd,
    tokenId,
    vaultType,
  ]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      {vaultTypes.map((item) => {        
        return (
          <Card className="flex-1 card-compact">
            <div className="card-body">
              <div
                className="flex flex-col md:flex-row"
              >
                <div className="mb-4 md:mb-0 flex justify-center">
                  <img
                    className="w-[60px] mr-4"
                    src={item.image}
                  />
                </div>
                <div className="flex flex-col my-auto mx-0">
                  <Typography
                    variant="h2"
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="p"
                  >
                    {item.para}
                  </Typography>
                </div>
              </div>

              <div
                className="card-actions pt-4"
              >
                { item.type === 'USDs' ? (
                  <Button
                    className="w-full"
                    color="primary"
                    onClick={() => handleMintVault(item.type)}
                    disabled={isPendingUsd || isPendingEur || !item.isActive}
                    loading={isPendingUsd && item.isActive}  
                  >
                    {item.isActive ? `Create ${item.type} Vault` : "Coming Soon"}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    color="primary"
                    onClick={() => handleMintVault(item.type)}
                    disabled={isPendingUsd || isPendingEur || !item.isActive}
                    loading={isPendingEur && item.isActive}  
                  >
                    {item.isActive ? `Create ${item.type} Vault` : "Coming Soon"}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
      )}
    </div>
  );
};

export default VaultCreate;