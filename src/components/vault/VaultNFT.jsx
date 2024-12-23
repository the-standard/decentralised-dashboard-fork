import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import {
  useReadContract,
  useChainId
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  usesUSDContractAddressStore,
  useContractAddressStore,
  useVaultManagerAbiStore,
  useGuestShowcaseStore,
} from "../../store/Store";

import {
  StopCircleIcon
} from '@heroicons/react/24/outline';

import Card from "../ui/Card";
import Button from "../ui/Button";
import Typography from "../ui/Typography";

const VaultNFT = ({
  vaultId,
  vaultType,
}) => {
  const {
    useShowcase,
  } = useGuestShowcaseStore();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const [ isLoading, setIsLoading ] = useState(false);

  const {
    arbitrumSepoliaContractAddress,
    arbitrumContractAddress
  } = useContractAddressStore();

  const {
    arbitrumsUSDSepoliaContractAddress,
    arbitrumsUSDContractAddress,
  } = usesUSDContractAddressStore();

  const chainId = useChainId();

  const vaultManagerAddress =
  chainId === arbitrumSepolia.id
    ? arbitrumSepoliaContractAddress
    : arbitrumContractAddress;

  const sUSDVaultManagerAddress =
  chainId === arbitrumSepolia.id
    ? arbitrumsUSDSepoliaContractAddress
    : arbitrumsUSDContractAddress;

  let useVaultManagerAddress = vaultManagerAddress;

  if (vaultType === 'USDs') {
    useVaultManagerAddress = sUSDVaultManagerAddress;
  }

  const { data: nftData, refetch: nftRefetch } = useReadContract({
    address: useVaultManagerAddress,
    abi: vaultManagerAbi,
    functionName: "tokenURI",
    args: [vaultId]
  });

  let decoded = '';
  let parsed = '';
  if (nftData) {
    const decodable = nftData?.toString().split(",")[1];
    if (decodable) {
      decoded = atob(decodable);
      parsed = JSON.parse(decoded);
    }
  }

  let nftContent = '';

  if (parsed && parsed.image_data) {
    nftContent = parsed.image_data;
  }

  const checkEthereum = () => {
    if (!window.ethereum) {
      toast.error('MetaMask not detected');
      return false;
    }
    return true;
  };

  const addNFT = async (tokenAddress, tokenId, tokenURI) => {
    if (!checkEthereum()) return;
    setIsLoading(true);
    try {
      setIsLoading(true);
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: tokenAddress,
            tokenId: tokenId,
            tokenURI: tokenURI
          },
        },
      });
      if (wasAdded) {
        setIsLoading(false);
        toast.success('NFT added successfully to MetaMask');
      } else {
        setIsLoading(false);
        toast.error('Failed to add NFT');
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Error adding NFT');
    }
  };

  return (
    <Card className="card-compact mb-4">
      <div className="card-body">
        <Typography variant="h2" className="card-title flex gap-0">
          <StopCircleIcon
            className="mr-2 h-6 w-6 inline-block"
          />
          Vault NFT
        </Typography>
        <div 
          className="nft-wrap"
          dangerouslySetInnerHTML={{ __html: nftContent }}
        />
        <Button
          onClick={() => addNFT(
            useVaultManagerAddress,
            vaultId,
            nftData
          )}
          variant="outline"
          className="pl-2"
          loading={isLoading}
          disabled={useShowcase || isLoading}
        >
          Add NFT to MetaMask
        </Button>
      </div>
    </Card>
  )
};

export default VaultNFT;