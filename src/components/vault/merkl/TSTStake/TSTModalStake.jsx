import { useRef, useState, useEffect } from "react";
import { toast } from 'react-toastify';

import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useChainId,
  useWatchBlockNumber,
  useWaitForTransactionReceipt,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { ethers } from "ethers";
import {
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useTstAddressStore,
  useErc20AbiStore,
  useStakingPoolv3AbiStore,
  useStakingPoolv3AddressStore,
  useGuestShowcaseStore,
  useMerklTSTStakeStage,
} from "../../../../store/Store";

import Card from "../../../ui/Card";
import Typography from "../../../ui/Typography";
import Button from "../../../ui/Button";
import CenterLoader from "../../../ui/CenterLoader";
import Input from "../../../ui/Input";

const TSTModalStake = (props) => {
  const { balanceRaw } = props;
  const isFirstMount = useRef(true);
  const chainId = useChainId();
  const {
    arbitrumTstAddress,
    arbitrumSepoliaTstAddress,
  } = useTstAddressStore();
  const {
    arbitrumSepoliaStakingPoolv3Address,
    arbitrumStakingPoolv3Address,
  } = useStakingPoolv3AddressStore();
  const {
    merklTSTStakeStage,
    setMerklTSTStakeStage,
  } = useMerklTSTStakeStage();

  // const { address } = useAccount();
  const {
    useWallet,
    useShowcase,
  } = useGuestShowcaseStore();
  const accountAddress = useWallet;

  const { erc20Abi } = useErc20AbiStore();
  const { stakingPoolv3Abi } = useStakingPoolv3AbiStore();
  const [stage, setStage] = useState('');

  const tstInputRef = useRef(null);

  const tstAddress = chainId === arbitrumSepolia.id ?
  arbitrumSepoliaTstAddress :
  arbitrumTstAddress;

  const stakingPoolv3Address = chainId === arbitrumSepolia.id ? arbitrumSepoliaStakingPoolv3Address :
  arbitrumStakingPoolv3Address;

  const tstContract = {
    address: tstAddress,
    abi: erc20Abi,
  }

  const {
    data: tstData,
    refetch: tstRefetch,
    isPending: tstIsPending,
    isSuccess: tstIsSuccess
  } = useReadContracts({
    contracts: [{
      ... tstContract,
      functionName: "allowance",
      args: [accountAddress, stakingPoolv3Address]
    },{
      ... tstContract,
      functionName: "balanceOf",
      args: [accountAddress]
    }],
  });

  // useWatchBlockNumber({
  //   onBlockNumber() {
  //     tstRefetch();
  //   },
  // })

  let existingTstAllowance = 0n;
  let tstBalance = 0n;

  if (tstData && tstData[0] && tstData[0].result) {
    existingTstAllowance = tstData[0].result;
  }
  // if (tstData && tstData[1] && tstData[1].result) {
  //   tstBalance = tstData[1].result;
  // }
  if (balanceRaw) {
    tstBalance = balanceRaw;
  }

  const {
    writeContract: approveWriteContract,
    data: approveTxHash,
    isError: approveIsError,
    isPending: approveIsPending,
    isSuccess: approveIsSuccess,
    error: approveError
  } = useWriteContract();

  const { 
    isLoading: approveIsConfirming,
    isSuccess: approveIsConfirmed,
  } = useWaitForTransactionReceipt({
    hash: approveTxHash,
    confirmations: 4,
  });

  const {
    writeContract: depositWriteContract,
    data: depositTxHash,
    isError: depositIsError,
    isPending: depositIsPending,
    isSuccess: depositIsSuccess,
    error: depositError
  } = useWriteContract();

  const { 
    isLoading: depositIsConfirming,
    isSuccess: depositIsConfirmed,
  } = useWaitForTransactionReceipt({
    hash: depositTxHash,
    confirmations: 4,
  });

  const handleApproveTst = async () => {
    setStage('APPROVE_TST');
    try {
      approveWriteContract({
        abi: erc20Abi,
        address: tstAddress,
        functionName: "approve",
        args: [stakingPoolv3Address, tstBalance],
      });
    } catch (error) {
      console.error('approve', error)
      let errorMessage = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was a problem');
    }
  };

  const handleDepositToken = async () => {
    setStage('DEPOSIT_TOKEN');
    setTimeout(() => {
      try {
        depositWriteContract({
          abi: stakingPoolv3Abi,
          address: stakingPoolv3Address,
          functionName: "increaseStake",
          args: [
            tstBalance,
          ],
        });
      } catch (error) {
        console.error('increaseStake', error)
        let errorMessage = '';
        if (error && error.shortMessage) {
          errorMessage = error.shortMessage;
        }
        toast.error(errorMessage || 'There was a problem');
      }  
    }, 1000);
  };

  const handleLetsStake = async () => {
    if (existingTstAllowance < tstBalance) {
      handleApproveTst();
    } else {
      handleDepositToken();
    }
  };

  // useEffect(() => {
  //   if (isFirstMount.current) {
  //     isFirstMount.current = false;
  //     return;
  //   }
  //   handleLetsStake();
  // }, []);

  useEffect(() => {
    // if (isFirstMount.current) {
    //   isFirstMount.current = false;
    //   return;
    // }
    if (tstIsSuccess) {
      handleLetsStake();
    }
  }, [tstIsSuccess]);

  useEffect(() => {
    if (stage === 'APPROVE_TST') {
      if (approveIsPending) {
        // 
      } else if (approveIsSuccess) {
        // setStage('');
        // toast.success('TST Approved');
        // handleDepositToken();
      } else if (approveIsError) {
        console.log('approve', approveIsError)
        setStage('');
        toast.error('There was a problem');
        setMerklTSTStakeStage('STAKE_ERROR');
      }  
    }
    if (stage === 'DEPOSIT_TOKEN') {
      if (depositIsPending) {
        // 
      } else if (depositIsSuccess) {
        // setStage('');
        // toast.success('TST Staked Successfully');
        // setMerklTSTStakeStage('SUCCESS');
      } else if (depositIsError) {
        console.log('deposit', depositError)
        setStage('');
        toast.error('There was a problem');
        setMerklTSTStakeStage('STAKE_ERROR');
      }  
    }
  }, [
    depositIsPending,
    depositIsSuccess,
    depositIsError,
    depositError
  ]);

  useEffect(() => {
    if (stage === 'APPROVE_TST') {
      if (approveIsConfirmed) {
        setStage('');
        toast.success('TST Approved');
        handleDepositToken();
      }  
    }
  }, [
    approveIsConfirming,
    approveIsConfirmed,
  ]);

  useEffect(() => {
    if (stage === 'DEPOSIT_TOKEN') {
      if (depositIsConfirmed) {
        setStage('');
        toast.success('TST Staked Successfully');
        setMerklTSTStakeStage('SUCCESS');
      }  
    }
  }, [
    depositIsConfirming,
    depositIsConfirmed,
  ]);

  let stakeStage = 'Attempting deposit';

  if (tstIsPending) {
    stakeStage = 'Attempting deposit approval';
  }

  if (approveIsPending && !approveIsConfirming) {
    stakeStage = 'Attempting deposit approval';
  }
  if (approveIsConfirming) {
    stakeStage = 'Confirming approval transaction';
  }

  if (depositIsPending && !depositIsConfirming) {
    stakeStage = 'Attempting deposit';
  }
  if (depositIsConfirming) {
    stakeStage = 'Confirming deposit transaction';
  }

  return (
    <>
      <Typography variant="h2" className="card-title">
        <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
        Staking TST 3/3
      </Typography>
      <CenterLoader
        label={stakeStage}
      />
    </>
  );
};

export default TSTModalStake;