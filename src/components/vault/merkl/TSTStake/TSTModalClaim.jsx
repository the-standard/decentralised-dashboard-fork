import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useMerklAddressStore,
  useMerklABIStore,
  useSmartVaultV4ABIStore,
  useMerklTSTStakeStage,
} from "../../../../store/Store";

import Modal from "../../../ui/Modal";
import Button from "../../../ui/Button";
import Typography from "../../../ui/Typography";
import TokenIcon from "../../../ui/TokenIcon";
import CenterLoader from "../../../ui/CenterLoader";

const TSTModalClaim = (props) => {
  const {
    open,
    closeModal,
    useAssets,
    parentLoading,
    unclaimed,
  } = props;

  const { merklDistributorAddress } = useMerklAddressStore();
  const { merklABI } = useMerklABIStore();
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultV4ABI } = useSmartVaultV4ABIStore();

  const {
    merklTSTStakeStage,
    setMerklTSTStakeStage,
  } = useMerklTSTStakeStage();

  const { vaultId } = useParams();

  const {
    writeContract,
    data: txHash,
    isError,
    isPending,
    isSuccess,
    error,
  } = useWriteContract();

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 4,
  });

  const claimUsers = useAssets && useAssets.length && useAssets.map(function(asset, index) {
    return (vaultAddress)
  });
  const claimTokens = useAssets && useAssets.length && useAssets.map(function(asset, index) {
    return (asset?.tokenAddress)
  });
  const claimAmounts = useAssets && useAssets.length && useAssets.map(function(asset, index) {
    return (asset?.accumulated)
  });
  const claimProofs = useAssets && useAssets.length && useAssets.map(function(asset, index) {
    return (asset?.proof)
  });

  const handleClaimToken = async () => {
    if (unclaimed > 0) {
      if (vaultId <= 39) {
        // LEGACY CODE FOR OLD VAULTS
        try {
          writeContract({
            abi: merklABI,
            address: merklDistributorAddress,
            functionName: "claim",
            args: [
              claimUsers,
              claimTokens,
              claimAmounts,
              claimProofs
            ],
          });
        } catch (error) {
          let errorMessage = '';
          if (error && error.shortMessage) {
            errorMessage = error.shortMessage;
          }
          toast.error(errorMessage || 'There was an error');
        }
      } else {
        // CURRENT CODE
        try {
          writeContract({
            abi: smartVaultV4ABI,
            address: vaultAddress,
            functionName: "merklClaim",
            args: [
              merklDistributorAddress,
              claimUsers,
              claimTokens,
              claimAmounts,
              claimProofs
            ],
          });
        } catch (error) {
          let errorMessage = '';
          if (error && error.shortMessage) {
            errorMessage = error.shortMessage;
          }
          toast.error(errorMessage || 'There was an error');
        }
      }  
    } else {
      setMerklTSTStakeStage('WITHDRAW');
    }
  };

  useEffect(() => {
    if (isPending) {
      // 
    } else if (isSuccess) {
      // toast.success("Tokens Claimed Successfully");
      // setMerklTSTStakeStage('WITHDRAW')
    } else if (isError) {
      console.error(error)
      toast.error('There was a problem');
      setMerklTSTStakeStage('CLAIM_ERROR');
    }
  }, [
    isPending,
    isSuccess,
    isError,
    error,
  ]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Tokens Claimed Successfully");
      setMerklTSTStakeStage('WITHDRAW')
    }
  }, [
    isConfirming,
    isConfirmed,
  ]);

  let claimStage = '';

  if (isPending && !isConfirming) {
    claimStage = 'Attempting claim';
  }
  if (isConfirming) {
    claimStage = 'Confirming claim transaction';
  }

  if (isPending || isConfirming) {
    return (
      <>
        <Typography variant="h2" className="card-title">
          <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
          Claiming TST 1/3
        </Typography>
        <CenterLoader
          label={claimStage}
        />
      </>
    )
  }

  return (
    <>
      <Typography variant="h2" className="card-title">
        <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
        Stake Your TST
      </Typography>

      <Typography
        variant="p"
      >
        Increase your TST position by staking your claimed Merkl rewards to earn USDs & more.

        This will automatically claim any existing Staking Pool rewards, ending your current staking period and restarting a new one.
      </Typography>

      <Typography
        variant="p"
      >
        Please confirm that you wish to stake the following tokens:
      </Typography>

      <table className="table table-sm">
        <thead>
          <tr>
            <th className="pl-0">Token</th>
            <th>Quantity</th>
          </tr>
        </thead>
        {parentLoading ? (null) : (
          <tbody>
            {useAssets && useAssets.length && useAssets.map(function(asset, index) {
              const symbol = asset?.symbol;
              const decimals = asset?.decimals;
              const unclaimedRaw = asset?.unclaimed;
              const balanceRaw = asset?.balanceOf;

              const unclaimed = ethers.formatUnits(unclaimedRaw, decimals);
              const balance = ethers.formatUnits(balanceRaw, decimals);

              const totalBalance = Number(unclaimed) + Number(balance);

              return (
                <tr key={index}>
                  <td className="pl-0">
                    <div className="h-full w-full flex flex-row">
                      <div className="flex items-center">
                        <TokenIcon
                          symbol={symbol}
                          className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                          isMerkl={true}
                        />
                      </div>
                      <div className="pl-2 pt-2 table-cell">
                        {symbol}
                      </div>
                    </div>
                  </td>
                  <td>
                    {totalBalance}
                  </td>
                </tr>  
              )
            })}
          </tbody>
        )}
      </table>
      {parentLoading ? (
        <CenterLoader />
      ) : (null)}

      <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
        <Button
          className="w-full lg:w-auto"
          color="ghost"
          onClick={closeModal}
          disabled={isPending}
        >
          Close
        </Button>
        <Button
          className="w-full lg:w-64"
          color="success"
          disabled={isPending}
          onClick={handleClaimToken}
          loading={isPending}
          wide
        >
          Confirm
        </Button>
      </div>
    </>
  );
};

export default TSTModalClaim;