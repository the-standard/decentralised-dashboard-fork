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
  useVaultManagerAbiStore
} from "../../store/Store";

import Card from "../ui/Card";
import Button from "../ui/Button";
import Typography from "../ui/Typography";

import seurologo from "../../assets/EUROs.svg";
import susdlogo from "../../assets/USDs.svg";

const vaultTypes = [
  {
    title: "EUROs (Standard Euro)",
    para: "Euro pegged stablecoin",
    borrowRate: "Borrow up to 90.91%",
    type: 'EUROs',
    image: seurologo,
    isActive: true,
  },
  {
    title: "USDs (Standard Dollar)",
    para: "US Dollar pegged stablecoin",
    borrowRate: "Borrow up to 90.91%",
    type: 'USDs',
    image: susdlogo,
    isActive: false,
  },
];

const VaultCreate = ({ tokenId }) => {
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const {
    arbitrumSepoliaContractAddress,
    arbitrumContractAddress,
  } = useContractAddressStore();

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

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      {vaultTypes.map((item) => (
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
              <Button
                className="w-full"
                color="primary"
                disabled
                // TEMP DISABLED
                // onClick={() => handleMintVault(item.type)}
                // disabled={!item.isActive}
                loading={isPending && item.isActive}  
              >
                {item.isActive ? `Create ${item.type} Vault` : "Coming Soon"}
              </Button>
            </div>
            </div>
        </Card>
      ))}
    </div>
  );
};

export default VaultCreate;