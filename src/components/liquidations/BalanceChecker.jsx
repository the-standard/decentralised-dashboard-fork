import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import React, { useState, useEffect } from 'react';

import {
  useErc20AbiStore,
  usesUSDAddressStore,
} from "../../store/Store";

import Typography from "../ui/Typography";

import susdlogo from "../../assets/USDs.svg";

const BalanceChecker = (props) => {
  const { setUSDsBalance, USDsBalance } = props;
  const { address, chainId, isConnected } = useAccount();
  const { arbitrumsUSDAddress } = usesUSDAddressStore();
  const { erc20Abi } = useErc20AbiStore();
  const [formattedBalance, setFormattedBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const usdsAddress = arbitrumsUSDAddress;

  const { data: decimals } = useReadContract({
    address: usdsAddress,
    abi: erc20Abi,
    functionName: 'decimals',
    enabled: !!usdsAddress && isConnected,
  });

  // Get balance
  const { data: balance, isError, isLoading, refetch } = useReadContract({
    address: usdsAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!usdsAddress && !!address && isConnected,
  });

  useEffect(() => {
    setLoading(isLoading);
    
    if (isError) {
      setError('Error fetching USDC balance');
      setFormattedBalance('');
      setUSDsBalance(0n);
      return;
    }

    if (balance !== undefined) {
      setUSDsBalance(balance);
    }
    
    if (balance !== undefined && decimals !== undefined) {
      const formatted = formatUnits(balance, decimals);
      setFormattedBalance(formatted);
      setError('');
    }
  }, [balance, decimals, isLoading, isError]);

  if (!isConnected) {
    return (
      <div className="bg-base-300/40 p-4 rounded-lg w-full">
        <Typography variant="p">
          <b>Wallet Not Connected</b>
          <br/>
          Please connect your wallet to check your USDs Balance.
        </Typography>
      </div>
    )
  }

  if (isConnected && chainId && !usdsAddress) {
    return (
      <div className="bg-base-300/40 p-4 rounded-lg w-full">
        <Typography variant="p">
          <b>Only Available On Arbitrum</b>
          <br/>
          Please change your connected chain over to Arbitrum.
        </Typography>
      </div>
    )
  }

  return (
    <div className="bg-base-300/40 p-4 rounded-lg w-full">
      {loading ? (
        <Typography variant="h2" className="text-center">
          <span className="loading loading-spinner loading-md"></span>
        </Typography>
      ) : formattedBalance ? (
        <div className="flex items-center">
          <img
            src={susdlogo}
            alt="USDs"
            className="block w-[42px] mr-4"
          />
          <Typography
            variant="h2"
            className="overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {formattedBalance}
          </Typography>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BalanceChecker;