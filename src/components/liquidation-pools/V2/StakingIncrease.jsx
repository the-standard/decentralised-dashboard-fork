import { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useChainId,
  useWatchBlockNumber,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { formatEther, parseEther } from "viem";

import {
  useTstAddressStore,
  useErc20AbiStore,
  usesEuroAddressStore,
  useSnackBarStore,
  useCircularProgressStore,
  useStakingPoolv2AbiStore,
  useStakingPoolv2AddressStore,
} from "../../../store/Store.jsx";

import Card from "../../Card";
import Button from "../../Button";

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
  const { getSnackBar } = useSnackBarStore();
  const { getCircularProgress, getProgressType } = useCircularProgressStore();
  const [tstStakeAmount, setTstStakeAmount] = useState<any>(0);
  const [eurosStakeAmount, setEurosStakeAmount] = useState<any>(0);
  const [stage, setStage] = useState('');

  const tstInputRef = useRef<HTMLInputElement>(null);
  const eurosInputRef = useRef<HTMLInputElement>(null);

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
      getSnackBar('ERROR', errorMessage);
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
        getSnackBar('ERROR', errorMessage);
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
        getSnackBar('ERROR', errorMessage);
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
        getProgressType('STAKE_DEPOSIT');
        getCircularProgress(true);
      } else if (isSuccess) {
        setStage('');
        getSnackBar('SUCCESS', 'TST Approved');
        handleApproveEuros();
      } else if (isError) {
        setStage('');
        getSnackBar('ERROR', 'There was a problem');
        getCircularProgress(false);
      }  
    }
    if (stage === 'APPROVE_EUROS') {
      if (isPending) {
        getProgressType('STAKE_DEPOSIT');
        getCircularProgress(true);
      } else if (isSuccess) {
        setStage('');
        getSnackBar('SUCCESS', 'EUROs Approved');
        handleDepositToken();
      } else if (isError) {
        setStage('');
        getSnackBar('ERROR', 'There was a problem');
        getCircularProgress(false);
      }
    }
    if (stage === 'DEPOSIT_TOKEN') {
      if (isPending) {
        getProgressType('STAKE_DEPOSIT');
        getCircularProgress(true);
      } else if (isSuccess) {
        setStage('');
        getSnackBar('SUCCESS', 'Deposited Successfully');
        getCircularProgress(false);
        eurosInputRef.current.value = "";
        tstInputRef.current.value = "";
        setTstStakeAmount(0);
        setEurosStakeAmount(0);
      } else if (isError) {
        setStage('');
        getSnackBar('ERROR', 'There was a problem');
        getCircularProgress(false);
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
      setTstStakeAmount(parseEther(e.target.value.toString()));      
    }
  };

  const handleTstInputMax = () => {
    const formatBalance = formatEther(tstBalance);
    tstInputRef.current.value = formatBalance;
    handleTstAmount({target: {value: formatBalance}});
  }

  const handleEurosAmount = (e) => {
    if (Number(e.target.value) < 10n ** 21n) {
      setEurosStakeAmount(parseEther(e.target.value.toString()));      
    }
  };

  const handleEurosInputMax = () => {
    const formatBalance = formatEther(eurosBalance);
    eurosInputRef.current.value = formatBalance;
    handleEurosAmount({target: {value: formatBalance}});
  }

  return (
    <Card
    sx={{
      padding: "1.5rem",
    }}
  >
    <div
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          margin: "0",
          marginBottom: "1rem",
          fontSize: {
            xs: "1.2rem",
            md: "1.5rem"
          }
        }}
        variant="h4"
      >
        Deposit
      </Typography>
    </div>
    <Typography
      sx={{
        fontSize: "1rem",
        width: "100%",
        opacity: "0.8",
        marginBottom: "1rem",
      }}
    >
      Increase your TST position to earn EUROs rewards, and increase your EUROs position to earn an assortment of other tokens. 
    </Typography>
    <Typography
      sx={{
        fontSize: "1rem",
        width: "100%",
        opacity: "0.8",
        marginBottom: "1rem",
      }}
    >
      Depositing will automatically claim your existing rewards & compound any EUROs, ending your current staking period and restarting a new one.
    </Typography>
    <div>
      <div
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <input
          style={{
            background: "rgba(18, 18, 18, 0.5)",
            border: "1px solid #8E9BAE",
            color: "white",
            fontSize: "1rem",
            fontWeight: "normal",
            fontFamily: "Poppins",
            height: "2.5rem",
            width: "100%",
            borderRadius: "10px",
            paddingLeft: "0.5rem",
            boxSizing: "border-box",
            MozBoxSizing: "border-box",
            WebkitBoxSizing: "border-box",
          }}
          placeholder="TST Amount"
          type="number"
          onChange={handleTstAmount}
          ref={tstInputRef}
        />
        <Button
          sx={{
            marginLeft: "0.5rem",
            padding: "0px 5px",
            minWidth: "60px",
            height: "2.5rem",
            fontSize: "1rem",
            boxSizing: "border-box",
            MozBoxSizing: "border-box",
            WebkitBoxSizing: "border-box",
          }}
          clickFunction={() => handleTstInputMax()}
          >
          Max
        </Button>
      </div>
      <div
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <input
          style={{
            background: "rgba(18, 18, 18, 0.5)",
            border: "1px solid #8E9BAE",
            color: "white",
            fontSize: "1rem",
            fontWeight: "normal",
            fontFamily: "Poppins",
            height: "2.5rem",
            width: "100%",
            borderRadius: "10px",
            paddingLeft: "0.5rem",
            boxSizing: "border-box",
            MozBoxSizing: "border-box",
            WebkitBoxSizing: "border-box",
          }}
          placeholder="EUROs Amount"
          type="number"
          onChange={handleEurosAmount}
          ref={eurosInputRef}
        />
        <Button
          sx={{
            marginLeft: "0.5rem",
            padding: "5px",
            minWidth: "60px",
            height: "2.5em",
            fontSize: "1rem",
            boxSizing: "border-box",
            MozBoxSizing: "border-box",
            WebkitBoxSizing: "border-box",
          }}
          clickFunction={() => handleEurosInputMax()}
        >
          Max
        </Button>
      </div>
      <Button
        sx={{
          marginTop: "1rem",
        }}
        isDisabled={isPending || tstStakeAmount <= 0 && eurosStakeAmount <= 0}
        clickFunction={handleLetsStake}
      >
        Deposit
      </Button>
    </div>
  </Card>
);
};

export default StakingIncrease;