import { useRef, useState, useEffect } from "react";
import { toast } from 'react-toastify';

import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useChainId,
  useWatchBlockNumber,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { ethers } from "ethers";

import {
  useTstAddressStore,
  useErc20AbiStore,
  useStakingPoolv3AbiStore,
  useStakingPoolv3AddressStore,
  useGuestShowcaseStore,
} from "../../store/Store";

import { useInactivityControl } from '../InactivityControl';

import Card from "../ui/Card";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Input from "../ui/Input";

const StakingIncrease = () => {
  const chainId = useChainId();
  const {
    arbitrumTstAddress,
    arbitrumSepoliaTstAddress,
  } = useTstAddressStore();
  const {
    arbitrumSepoliaStakingPoolv3Address,
    arbitrumStakingPoolv3Address,
  } = useStakingPoolv3AddressStore();
  // const { address } = useAccount();
  const {
    useWallet,
    useShowcase,
  } = useGuestShowcaseStore();
  const accountAddress = useWallet;
  const { isActive } = useInactivityControl();

  const { erc20Abi } = useErc20AbiStore();
  const { stakingPoolv3Abi } = useStakingPoolv3AbiStore();
  const [tstStakeAmount, setTstStakeAmount] = useState(0);
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

  const { data: tstData, refetch: refetchTst } = useReadContracts({
    contracts: [{
      ... tstContract,
      functionName: "allowance",
      args: [accountAddress, stakingPoolv3Address],
    },{
      ... tstContract,
      functionName: "balanceOf",
      args: [accountAddress],
    }],
    enabled: isActive,
  });

  useWatchBlockNumber({
    enabled: isActive,
    onBlockNumber() {
      refetchTst();
    },
  })

  const existingTstAllowance = tstData && tstData[0].result;
  const tstBalance = tstData && tstData[1].result;

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleApproveTst = async () => {
    setStage('APPROVE_TST');
    try {
      writeContract({
        abi: erc20Abi,
        address: tstAddress,
        functionName: "approve",
        args: [stakingPoolv3Address, tstStakeAmount],
      });
    } catch (error) {
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
        writeContract({
          abi: stakingPoolv3Abi,
          address: stakingPoolv3Address,
          functionName: "increaseStake",
          args: [
            tstStakeAmount,
          ],
        });
      } catch (error) {
        let errorMessage = '';
        if (error && error.shortMessage) {
          errorMessage = error.shortMessage;
        }
        toast.error(errorMessage || 'There was a problem');
      }  
    }, 1000);
  };

  const handleLetsStake = async () => {
    if (existingTstAllowance < tstStakeAmount) {
      handleApproveTst();
    } else {
      handleDepositToken();
    }
  };

  useEffect(() => {
    if (stage === 'APPROVE_TST') {
      if (isPending) {
        // 
      } else if (isSuccess) {
        setStage('');
        toast.success('TST Approved');
        handleDepositToken();
      } else if (isError) {
        setStage('');
        toast.error('There was a problem');
      }  
    }
    if (stage === 'DEPOSIT_TOKEN') {
      if (isPending) {
        // 
      } else if (isSuccess) {
        setStage('');
        toast.success('Deposited Successfully!');
        tstInputRef.current.value = "";
        setTstStakeAmount(0);
      } else if (isError) {
        setStage('');
        toast.error('There was a problem');
        tstInputRef.current.value = "";
        setTstStakeAmount(0);
      }  
    }
  }, [
    isPending,
    isSuccess,
    isError,
    error
  ]);

  const handleTstAmount = (e) => {
    if (Number(e.target.value) < 10n ** 21n) {
      setTstStakeAmount(ethers.parseEther(e.target.value.toString()));      
    }
  };

  const handleTstInputMax = () => {
    const formatBalance = ethers.formatEther(tstBalance);
    tstInputRef.current.value = formatBalance;
    handleTstAmount({target: {value: formatBalance}});
  }

  let maxTst = 0;

  if (tstBalance) {
    maxTst = ethers.formatEther(tstBalance.toString());
  }

  return (
    <>
      <Card className="card-compact w-full">
        <div className="card-body">
          <Typography variant="h2" className="card-title justify-between">
            Deposit
          </Typography>
          <Typography variant="p" className="mb-2">
            Increase your TST position to earn USDs & more rewards. 
          </Typography>
          <Typography variant="p" className="mb-2">
            Depositing will automatically claim your existing rewards, ending your current staking period and restarting a new one.
          </Typography>
          <div>
            <div className="flex justify-between">
              <Typography
                variant="p"
                className="pb-2"
              >
                TST Deposit Amount
              </Typography>
              <Typography
                variant="p"
                className="text-right"
              >
                Available: {maxTst || '0'}
              </Typography>
            </div>
            <div
              className="join w-full mb-4"
            >
              <Input
                className="join-item w-full"
                placeholder="TST Amount"
                type="number"
                onChange={handleTstAmount}
                useRef={tstInputRef}
              />
              <Button
                className="join-item"
                variant="outline"
                onClick={() => handleTstInputMax()}
              >
                Max
              </Button>
            </div>
            <div className="card-actions flex flex-row justify-end">
              <Button
                color="primary"
                loading={isPending}
                disabled={useShowcase || isPending || tstStakeAmount <= 0 }
                onClick={handleLetsStake}
                className="w-full lg:w-1/2"
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default StakingIncrease;