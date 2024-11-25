import { useState, useEffect } from "react";
import {
  useReadContract,
  useChainId
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  usesUSDContractAddressStore,
  useContractAddressStore,
  useVaultManagerAbiStore,
} from "../../store/Store";

import {
  StopCircleIcon
} from '@heroicons/react/24/outline';

import Card from "../ui/Card";
import Typography from "../ui/Typography";

const VaultNFT = ({
  vaultId,
  vaultType,
}) => {
  const { vaultManagerAbi } = useVaultManagerAbiStore();

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
      </div>
    </Card>
  )
};

export default VaultNFT;