import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {
  useWriteContract,
  useChainId
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import {
  Button,
} from 'react-daisyui';
import {
  TrashIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

import {
  useContractAddressStore,
  useVaultManagerAbiStore,
} from "../../store/Store";

import SendModal from "./SendModal";

const VaultSend = ({
  currentVault,
  vaultId,
  address
}) => {
  const { arbitrumSepoliaContractAddress, arbitrumContractAddress } = useContractAddressStore();
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const navigate = useNavigate();

  const { writeContract, isError, isPending, isSuccess } = useWriteContract();

  const chainId = useChainId();

  const vaultManagerAddress =
  chainId === arbitrumSepolia.id
    ? arbitrumSepoliaContractAddress
    : arbitrumContractAddress;

  const [sendTo, setSendTo] = useState('');

  const [sendType, setSendType] = useState(undefined);

  const handleCloseSendModal = () => {
    setSendType(undefined);
  };

  const handleSendVault = async () => {
    const burnAddress = `0x000000000000000000000000000000000000dEaD`;

    let useSendAddress;
    if (sendType === 'BURN') {
      useSendAddress = burnAddress;
    }
    if (sendType === 'SEND') {
      useSendAddress = sendTo;
    }
    try {
      writeContract({
        abi: vaultManagerAbi,
        address: vaultManagerAddress,
        functionName: "transferFrom",
        args: [
          address, // from
          useSendAddress, // to
          vaultId // which vault
        ],
      });

    } catch (error) {
      let errorMessage = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was an error');
    }
  };

  useEffect(() => {
    if (isPending) {
      // 
    } else if (isSuccess) {
      toast.success('Successful');
      navigate('/');
    } else if (isError) {
      // 
      toast.error('There was an error');
    }
  }, [
    isPending,
    isSuccess,
    isError,
  ]);

  const vaultActive = Number(BigInt(currentVault.status.totalCollateralValue)) > 0 || Number(BigInt(currentVault.status.minted)) > 0;

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            setSendType('BURN');
          }}
        >
          <TrashIcon className="h-6 w-6 inline-block"/>
        </Button>
        <Button
          onClick={() => {
            setSendType('SEND');
          }}
        >
          <PaperAirplaneIcon className="h-6 w-6 inline-block"/>
        </Button>
      </div>
      <SendModal
        isOpen={!!sendType}
        sendType={sendType}
        handleCloseModal={handleCloseSendModal}
        vaultActive={vaultActive}
        isPending={isPending}
        setSendTo={setSendTo}
        sendTo={sendTo}
        handleSendVault={handleSendVault}
      />
    </>
  )

};

export default VaultSend;