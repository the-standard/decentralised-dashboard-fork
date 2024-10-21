import { useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import {
  useWriteContract,
  useReadContracts,
  useChainId,
  useWatchBlockNumber
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  usesEuroAddressStore,
  usesUSDAddressStore,
  useErc20AbiStore,
  useVaultHealthUpdate,
} from "../../store/Store";

import smartVaultAbi from "../../abis/smartVault";

import BorrowModal from "./BorrowModal";
import RepayModal from "./RepayModal";

import Button from "../ui/Button";

const Debt = ({
  currentVault,
  vaultType
}) => {
  const { address } = useAccount();
  const { vaultAddress } = useVaultAddressStore();
  const {
    arbitrumsEuroAddress,
    arbitrumSepoliasEuroAddress
  } = usesEuroAddressStore();

  const {
    arbitrumsUSDAddress,
    arbitrumSepoliasUSDAddress
  } = usesUSDAddressStore();
    
  const { erc20Abi } = useErc20AbiStore();
  const {
    setVaultHealthUpdateType,
    setVaultHealthUpdateAmount,
  } = useVaultHealthUpdate();
  const inputRef = useRef(null);

  const [ amount, setAmount ] = useState(BigInt(0));
  const [ stage, setStage ] = useState('');

  const chainId = useChainId();
  const HUNDRED_PC = 100_000n;

  const eurosAddress = chainId === arbitrumSepolia.id ?
    arbitrumSepoliasEuroAddress :
    arbitrumsEuroAddress;

  const usdsAddress = chainId === arbitrumSepolia.id ?
    arbitrumSepoliasUSDAddress :
    arbitrumsUSDAddress;

  let sAddress;
  if (vaultType === 'EUROs') {
    sAddress = eurosAddress;
  }
  if (vaultType === 'USDs') {
    sAddress = usdsAddress;
  }

  const sContract = {
    address: sAddress,
    abi: erc20Abi,
  }
    
  const { data: sData, refetch } = useReadContracts({
    contracts: [{
      ... sContract,
      functionName: "allowance",
      args: [address, vaultAddress]
    },{
      ... sContract,
      functionName: "balanceOf",
      args: [address]
    }],
  });

  useWatchBlockNumber({
    onBlockNumber() {
      refetch();
    },
  })

  const allowance = sData && sData[0].result;
  const sWalletBalance = sData && sData[1].result;

  const handleAmount = (e, type) => {
    setVaultHealthUpdateType(type);
    if (Number(e.target.value) < 10n ** 21n) {
      const amount = ethers.parseEther(e.target.value.toString());
      setAmount(amount)
      setVaultHealthUpdateAmount(amount);
    }
  };

  const getInputMax = () => {
    const minted = currentVault?.status?.minted;
    const burnFeeRate = currentVault?.burnFeeRate;
    const maxRepayWei = sWalletBalance < (minted + calculateRateAmount(minted, burnFeeRate)) ?
      sWalletBalance * HUNDRED_PC / (HUNDRED_PC + burnFeeRate) :
      minted;
    const maxRepay = ethers.formatEther(maxRepayWei);
    return maxRepay;
  }

  const handleInputMax = (type) => {
    const maxRepay = getInputMax();
    inputRef.current.value = maxRepay;
    handleAmount({target: {value: maxRepay}}, type);
  }

  useEffect(() => {
    setAmount(BigInt(0));
  }, []);

  useEffect(() => {
    return () => {
      setAmount(BigInt(0));
    };
  }, []);

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleMint = async () => {
    setStage('MINT');
    try {
      writeContract({
        abi: smartVaultAbi,
        address: vaultAddress,
        functionName: "mint",
        args: [address, amount],
      });

    } catch (error) {
      let errorMessage = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was a problem');
    }
  };

  const [borrowOpen, setBorrowOpen] = useState(false);
  const [repayOpen, setRepayOpen] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [repaySuccess, setRepaySuccess] = useState(false);

  const closeDebtModal = () => {
    setAmount(BigInt(0));
    setBorrowOpen(false);
    setRepayOpen(false);
    setBorrowSuccess(false);
    setRepaySuccess(false);
    setRepayStep(0);
    setVaultHealthUpdateType('');
    setVaultHealthUpdateAmount(0);
  }

  const [repayStep, setRepayStep] = useState(0);

  const burnFeeRate = currentVault?.burnFeeRate;

  const repayFee = amount * burnFeeRate / HUNDRED_PC;

  const handleApprove = async () => {
    setStage('APPROVE');
    try {
      writeContract({
        abi: erc20Abi,
        address: sAddress,
        functionName: "approve",
        args: [vaultAddress, repayFee],
      });

    } catch (error) {
      let errorMessage = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was a problem');
    }
  };

  const handleApprovePayment = async () => {
    // V3+ Vaults
    // if vault version exists and if >= 3 skip the approval step
    if (currentVault && currentVault.status && currentVault.status.version && currentVault.status.version !== 1 && currentVault.status.version !== 2) {
      handleBurn()
    } else {
      if (allowance && allowance >= repayFee) {
        handleBurn()
      } else {
        handleApprove()
      }
    }
  };

  const handleBurn = async () => {
    setStage('BURN');
    try {
      writeContract({
        abi: smartVaultAbi,
        address: vaultAddress,
        functionName: "burn",
        args: [amount],
      });

    } catch (error) {
      let errorMessage = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      toast.error(errorMessage || 'There was a problem');
    }
  };

  const handleBorrowSuccessReport = () => {
    const minted = currentVault?.status?.minted;
    let formatPrevTotal;
    if (minted) {
      formatPrevTotal = ethers.formatEther(minted);
    }
    let formatAmount = ethers.formatEther(amount);
    let formatNewTotal;
    if (amount && minted) {
      formatNewTotal = ethers.formatEther(ethers.parseEther(formatPrevTotal) + amount);
    }

    try {
      plausible('DebtIssue', {
        props: {
          BorrowToken: vaultType,
          BorrowAmount: formatAmount,
          BorrowPreviousDebt: formatPrevTotal,
          BorrowNewDebt: formatNewTotal,
        }
      });  
    } catch (error) {
      console.log(error);
    }
  };

  const handleRepaySuccessReport = () => {
    const minted = currentVault?.status?.minted;
    let formatPrevTotal;
    if (minted) {
      formatPrevTotal = ethers.formatEther(minted);
    }
    let formatAmount = ethers.formatEther(amount);
    let formatNewTotal;
    if (amount && minted) {
      formatNewTotal = ethers.formatEther(ethers.parseEther(formatPrevTotal) - amount);
    }

    // TODO add plausible logic for USDs vaults
    try {
      plausible('DebtRepay', {
        props: {
          RepayToken: vaultType,
          RepayAmount: formatAmount,
          RepayPreviousDebt: formatPrevTotal,
          RepayNewDebt: formatNewTotal,
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (stage === 'MINT') {
      if (isPending) {
        setBorrowSuccess(false);
      } else if (isSuccess) {
        handleBorrowSuccessReport();
        setBorrowSuccess(true);
        toast.success("Borrowed Successfully");
        setStage('');
      } else if (isError) {
        setBorrowSuccess(false);
        toast.error('There was a problem');
        setStage('');
      }  
    }
    if (stage === 'APPROVE') {
      if (isPending) {
        setRepayStep(1);
      } else if (isSuccess) {
        toast.success("Approved Successfully");
        handleBurn();
      } else if (isError) {
        toast.error('There was a problem');
        setStage('');
      }  
    }
    if (stage === 'BURN') {
      if (isPending) {
        setRepaySuccess(false)
        setRepayStep(2);
      } else if (isSuccess) {
        handleRepaySuccessReport();
        setRepaySuccess(true);
        toast.success("Repayed Successfully");
        setRepayStep(1);
        setStage('');
      } else if (isError) {
        setRepaySuccess(false)
        toast.error('There was a problem');
        setRepayStep(1);
        setStage('');
      }
    }
  }, [
    isPending,
    isSuccess,
    isError,
  ]);

  const toPercentage = (rate) => {
    return Number(rate) * 100 / Number(HUNDRED_PC);
  };

  const calculateRateAmount = (fullAmount, rate) => {
    return fullAmount * rate / HUNDRED_PC;
  };

  const calculateRepaymentWithFee = () => {
    return amount + calculateRateAmount(amount, currentVault?.burnFeeRate);
  }

  const handleDebtAction = (type) => {
    if (type === 'BORROW') {
      handleMint();
    } else {
      if (amount > currentVault?.status.minted) {
        alert('Repayment amount exceeds debt in vault');
      } else if (sWalletBalance < calculateRepaymentWithFee()) {
        alert('Repayment amount exceeds your balance');
      } else {
        handleApprovePayment();
      }
    }
  };

  const shortenAddress = (address) => {
    const prefix = address?.slice(0, 6);
    const suffix = address?.slice(-8);
    return `${prefix}...${suffix}`;
  };

  const shortenedAddress = shortenAddress(address);

  const borrowValues = [
    {
      key: "Mint to address",
      value: shortenedAddress,
    },
    {
      key: "Fixed interest %",
      value: "0",
    },
    {
      key: `Minting Fee (${toPercentage(currentVault?.mintFeeRate)}%)`,
      value: ethers.formatEther(calculateRateAmount(amount, currentVault?.mintFeeRate)),
    },
    {
      key: "Borrowing",
      value: ethers.formatEther(amount + calculateRateAmount(amount, currentVault?.mintFeeRate)),
    },
    {
      key: "Receiving",
      value: ethers.formatEther(amount.toString()),
    },
  ];
  const repayValues = [
    {
      key: "Fixed interest %",
      value: "0",
    },
    {
      key: `Burn Fee (${toPercentage(currentVault?.burnFeeRate)}%)`,
      value: ethers.formatEther(calculateRateAmount(amount, currentVault?.burnFeeRate)),
    },
    {
      key: "Actual Repayment",
      value: ethers.formatEther(amount.toString()),
    },
    {
      key: "Send",
      value: ethers.formatEther(amount + calculateRateAmount(amount, currentVault?.burnFeeRate)),
    },
  ];

  return (
    <>
      <div className="card-actions">
        <Button
          className="w-full lg:w-auto flex-1"
          color="primary"
          // TEMP disabled
          disabled
          // onClick={() => setBorrowOpen(!borrowOpen)}
        >
          <ArrowDownCircleIcon className="h-6 w-6 inline-block"/>
          Borrow
        </Button>
        <Button
          className="w-full lg:w-auto flex-1"
          color="primary"
          onClick={() => setRepayOpen(!repayOpen)}
        >
          <ArrowUpCircleIcon className="h-6 w-6 inline-block"/>
          Repay
        </Button>
      </div>

      <BorrowModal
        open={borrowOpen}
        closeModal={closeDebtModal}
        handleAmount={handleAmount}
        isPending={isPending}
        isSuccess={borrowSuccess}
        amount={amount}
        handleDebtAction={handleDebtAction}
        borrowValues={borrowValues}
        inputRef={inputRef}
        currentVault={currentVault}
        vaultType={vaultType}
      />

      <RepayModal
        open={repayOpen}
        closeModal={closeDebtModal}
        handleAmount={handleAmount}
        getInputMax={getInputMax}
        handleInputMax={handleInputMax}
        isPending={isPending}
        isSuccess={repaySuccess}
        amount={amount}
        handleDebtAction={handleDebtAction}
        repayValues={repayValues}
        repayStep={repayStep}
        repayFee={repayFee}
        burnFeeRate={currentVault?.burnFeeRate}
        toPercentage={toPercentage}
        inputRef={inputRef}
        currentVault={currentVault}
        vaultType={vaultType}
      />
    </>
  );
};

export default Debt;