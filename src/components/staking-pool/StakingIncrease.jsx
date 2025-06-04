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
  usesEuroAddressStore,
  useStakingPoolv2AbiStore,
  useStakingPoolv2AddressStore,
} from "../../store/Store.jsx";

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
    arbitrumsEuroAddress,
    arbitrumSepoliasEuroAddress,
  } = usesEuroAddressStore();
  const {
    arbitrumSepoliaStakingPoolv2Address,
    arbitrumStakingPoolv2Address,
  } = useStakingPoolv2AddressStore();
  const { address } = useAccount();
  const { erc20Abi } = useErc20AbiStore();
  const { stakingPoolv2Abi } = useStakingPoolv2AbiStore();
  const [tstStakeAmount, setTstStakeAmount] = useState(0);
  const [eurosStakeAmount, setEurosStakeAmount] = useState(0);
  const [stage, setStage] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const { isActive } = useInactivityControl();

  const tstInputRef = useRef(null);
  const eurosInputRef = useRef(null);

  const tstAddress = chainId === arbitrumSepolia.id ?
  arbitrumSepoliaTstAddress :
  arbitrumTstAddress;

  const eurosAddress = chainId === arbitrumSepolia.id ?
  arbitrumSepoliasEuroAddress :
  arbitrumsEuroAddress;

  const stakingPoolv2Address = chainId === arbitrumSepolia.id ? arbitrumSepoliaStakingPoolv2Address :
  arbitrumStakingPoolv2Address;

  const tstContract = {
    address: tstAddress,
    abi: erc20Abi,
  }

  const { data: tstData, refetch: refetchTst } = useReadContracts({
    contracts: [{
      ... tstContract,
      functionName: "allowance",
      args: [address, stakingPoolv2Address]
    },{
      ... tstContract,
      functionName: "balanceOf",
      args: [address]
    }],
    enabled: isActive,
  });

  const eurosContract = {
    address: eurosAddress,
    abi: erc20Abi,
  }

  const { data: eurosData, refetch: refetchEuros } = useReadContracts({
    contracts: [{
      ... eurosContract,
      functionName: "allowance",
      args: [address, stakingPoolv2Address]
    },{
      ... eurosContract,
      functionName: "balanceOf",
      args: [address]
    }],
    enabled: isActive,
  });

  useWatchBlockNumber({
    enabled: isActive,
    onBlockNumber() {
      refetchTst();
      refetchEuros();
    },
  })

  const existingTstAllowance = tstData && tstData[0].result;
  const tstBalance = tstData && tstData[1].result;

  const existingEurosAllowance = eurosData && eurosData[0].result;
  const eurosBalance = eurosData && eurosData[1].result;

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleApproveTst = async () => {
    setStage('APPROVE_TST');
    try {
      writeContract({
        abi: erc20Abi,
        address: tstAddress,
        functionName: "approve",
        args: [stakingPoolv2Address, tstStakeAmount],
      });
    } catch (error) {
      let errorMessage = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was a problem');
    }
  };

  const handleApproveEuros = async () => {
    setStage('APPROVE_EUROS');
    setTimeout(() => {
      try {
        writeContract({
          abi: erc20Abi,
          address: eurosAddress,
          functionName: "approve",
          args: [stakingPoolv2Address, eurosStakeAmount],
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

  const handleDepositToken = async () => {
    setStage('DEPOSIT_TOKEN');
    setTimeout(() => {
      try {
        writeContract({
          abi: stakingPoolv2Abi,
          address: stakingPoolv2Address,
          functionName: "increaseStake",
          args: [
            tstStakeAmount,
            eurosStakeAmount
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
      if (existingEurosAllowance < eurosStakeAmount) {
        handleApproveEuros();
      } else {
        handleDepositToken();
      }
    }
  };

  useEffect(() => {
    if (stage === 'APPROVE_TST') {
      if (isPending) {
        // 
      } else if (isSuccess) {
        setStage('');
        toast.success('TST Approved');
        handleApproveEuros();
      } else if (isError) {
        setStage('');
        toast.error('There was a problem');
      }  
    }
    if (stage === 'APPROVE_EUROS') {
      if (isPending) {
        // 
      } else if (isSuccess) {
        setStage('');
        toast.success('EUROs Approved');
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
        eurosInputRef.current.value = "";
        tstInputRef.current.value = "";
        setTstStakeAmount(0);
        setEurosStakeAmount(0);
      } else if (isError) {
        setStage('');
        toast.error('There was a problem');
        eurosInputRef.current.value = "";
        tstInputRef.current.value = "";
        setTstStakeAmount(0);
        setEurosStakeAmount(0);
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

  const handleEurosAmount = (e) => {
    if (Number(e.target.value) < 10n ** 21n) {
      setEurosStakeAmount(ethers.parseEther(e.target.value.toString()));      
    }
  };

  const handleEurosInputMax = () => {
    const formatBalance = ethers.formatEther(eurosBalance);
    eurosInputRef.current.value = formatBalance;
    handleEurosAmount({target: {value: formatBalance}});
  }

  return (
    <>
      <Card className="card-compact w-full">
        <div className="card-body">
          <Typography variant="h2" className="card-title justify-between">
            Deposit
          </Typography>
          <Typography variant="p" className="mb-2">
            Increase your TST position to earn EUROs rewards, and increase your EUROs position to earn an assortment of other tokens. 
          </Typography>
          <Typography variant="p" className="mb-2">
            Depositing will automatically claim your existing rewards & compound any EUROs, ending your current staking period and restarting a new one.
          </Typography>
          <hr className="my-2" />
          <div>
            <Typography variant="p" className="pb-2">
              TST Deposit Amount:
            </Typography>
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
            <Typography variant="p" className="pb-2">
              EUROs Deposit Amount:
            </Typography>
            <div
              className="join w-full mb-4"
            >
            <Input
                className="join-item w-full"
                placeholder="EUROs Amount"
                type="number"
                onChange={handleEurosAmount}
                useRef={eurosInputRef}
              />
              <Button
                className="join-item"
                variant="outline"
                onClick={() => handleEurosInputMax()}
              >
                Max
              </Button>
            </div>
            <div className="card-actions flex flex-row justify-end">
              <Button
                color="primary"
                loading={isPending}
                disabled={isPending || tstStakeAmount <= 0 && eurosStakeAmount <= 0}
                onClick={handleLetsStake}
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