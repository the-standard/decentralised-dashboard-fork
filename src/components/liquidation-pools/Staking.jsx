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
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useTstAddressStore,
  useErc20AbiStore,
  usesEuroAddressStore,
  useLiquidationPoolAbiStore,
  useLiquidationPoolStore,
} from "../../store/Store";

import Card from "../ui/Card";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import Modal from "../ui/Modal";
import Input from "../ui/Input";

const Staking = () => {
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
    arbitrumSepoliaLiquidationPoolAddress,
    arbitrumLiquidationPoolAddress,
  } = useLiquidationPoolStore();

  const { address } = useAccount();
  const { erc20Abi } = useErc20AbiStore();
  const { liquidationPoolAbi } = useLiquidationPoolAbiStore();
  const [tstStakeAmount, setTstStakeAmount] = useState(0);
  const [eurosStakeAmount, setEurosStakeAmount] = useState(0);
  const [stage, setStage] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);

  const tstInputRef = useRef(null);
  const eurosInputRef = useRef(null);

  const tstAddress = chainId === arbitrumSepolia.id ?
  arbitrumSepoliaTstAddress :
  arbitrumTstAddress;

  const eurosAddress = chainId === arbitrumSepolia.id ?
  arbitrumSepoliasEuroAddress :
  arbitrumsEuroAddress;

  const liquidationPoolAddress = chainId === arbitrumSepolia.id ? arbitrumSepoliaLiquidationPoolAddress :
  arbitrumLiquidationPoolAddress;

  const tstContract = {
    address: tstAddress,
    abi: erc20Abi,
  }

  const { data: tstData, refetch: refetchTst } = useReadContracts({
    contracts: [{
      ... tstContract,
      functionName: "allowance",
      args: [address, liquidationPoolAddress]
    },{
      ... tstContract,
      functionName: "balanceOf",
      args: [address]
    }],
  });

  const eurosContract = {
    address: eurosAddress,
    abi: erc20Abi,
  }

  const { data: eurosData, refetch: refetchEuros } = useReadContracts({
    contracts: [{
      ... eurosContract,
      functionName: "allowance",
      args: [address, liquidationPoolAddress]
    },{
      ... eurosContract,
      functionName: "balanceOf",
      args: [address]
    }],
  });

  useWatchBlockNumber({
    onBlockNumber() {
      refetchTst();
      refetchEuros();
    },
  })

  const existingTstAllowance = tstData && tstData[0].result;
  const tstBalance = tstData && tstData[1].result;

  const existingEurosAllowance = eurosData && eurosData[0].result;
  const eurosBalance = eurosData && eurosData[1].result;

  const { writeContract, isError, isPending, isSuccess } = useWriteContract();

  const handleApproveTst = async () => {
    setStage('APPROVE_TST');
    try {
      writeContract({
        abi: erc20Abi,
        address: tstAddress,
        functionName: "approve",
        args: [liquidationPoolAddress, tstStakeAmount],
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
          args: [liquidationPoolAddress, eurosStakeAmount],
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
          abi: liquidationPoolAbi,
          address: liquidationPoolAddress,
          functionName: "increasePosition",
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
        toast.success("TST Approved");
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
        toast.success("EUROs Approved");
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
        toast.success("Deposited Successfully");
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
          <Typography variant="h2" className="card-title flex justify-between">
            Deposit
            <Button size="sm" onClick={() => setHelpOpen(true)}>
              <QuestionMarkCircleIcon className="h-4 w-4 inline-block"/>
              How It Works
            </Button>
          </Typography>
          <Typography variant="p">
            To start earning fees & buying up liquidated assets at up to a 10% discount, stake your TST & EUROs below.
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
                onClick={() => handleEurosInputMax()}
              >
                Max
              </Button>
            </div>
            <div className="pt-4 flex flex-col-reverse lg:flex-row justify-end items-end">
              <Button
                className="w-full lg:w-auto"
                disabled={tstStakeAmount <= 0 && eurosStakeAmount <= 0}
                onClick={handleLetsStake}
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <Modal
        open={helpOpen}
        closeModal={() => setHelpOpen(false)}
        wide
      >
        <Typography variant="h2" className="card-title">
          <QuestionMarkCircleIcon className="mr-2 h-6 w-6 inline-block"/>
          Liquidation Pool - How It Works
        </Typography>

        <Typography variant="h2">
          Earning Fees
        </Typography>

        <Typography>
          TST represents your share of the pool. For example, if your stake equals 3% of the pool then you will receive 3% of all fees collected.
        </Typography>

        <hr className="my-2" />

        <Typography variant="h2">
          Purchasing Discounted Tokens
        </Typography>

        <Typography>
          EUROs will be spent to buy liquidated assets at up to a 10% discount.
        </Typography>
        <Typography>
          TST represents the maximum amount of EUROs you will spend.
        </Typography>
        <Typography>
          300 TST = 300 EUROs even if you have 500 EUROs deposited. This means you should always try to have more TST tokens in the pool than EUROs.
        </Typography>

        <hr className="my-2" />

        <Typography className="font-bold">
          Please Note:
        </Typography>

        <Typography>
          All deposits will be held for a 24hour maturity period where they cannot be withdrawn, but can still be used for automatically purchasing liquidated assets.
        </Typography>

        <div className="card-actions flex flex-row justify-end">
          <Button
            className="w-full lg:w-auto"
            color="ghost"
            onClick={() => setHelpOpen(false)}
          >
            Close
          </Button>
        </div>

      </Modal>
    </>
  );
};

export default Staking;