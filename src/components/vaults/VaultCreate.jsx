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

const vaultTypes = [
  {
    title: "EUROs (Standard Euro)",
    para: "Euro pegged stablecoin",
    borrowRate: "Borrow up to 90.91%",
    type: 'EUROs',
    isActive: true,
  },
  {
    title: "USDs (Standard Dollar)",
    para: "US Dollar pegged stablecoin",
    borrowRate: "Borrow up to 90.91%",
    type: 'USDs',
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
    <div className="flex gap-4 mb-4">
      {vaultTypes.map((item) => (
        <Card className="flex-1 card-compact">
          <div className="card-body">
            <div className="flex flex-col">
              <Typography
                variant="h3"
                className="mb-2"
              >
                {item.title}
              </Typography>
              <Typography
                variant="p"
                className="mb-2"
              >
                {item.para}
              </Typography>
            </div>
            <div
              className="flex flex-row"
            >
              <Button
                onClick={() => handleMintVault(item.type)}
                disabled={!item.isActive}
              >
                <Typography
                  type="p"
                >
                  {item.isActive ? "Create Smart Vault" : "Coming Soon"}
                </Typography>
              </Button>
            </div>
            </div>
        </Card>
      ))}
    </div>
  );
};

export default VaultCreate;