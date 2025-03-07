import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import React, { useState, useEffect } from 'react';

import {
  useErc20AbiStore,
  usesUSDAddressStore,
} from "../../store/Store";

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
    return <div>Please connect your wallet to check USDs balance.</div>;
  }

  if (isConnected && chainId && !usdsAddress) {
    return <div>USDs contract not configured for the current chain (ID: {chainId}).</div>;
  }

  return (
    <div>
      <h2>USDs Balance</h2>
      
      {loading ? (
        <div>Loading balance...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : formattedBalance ? (
        <div className="balance">
          <span className="amount">{formattedBalance}</span>
          <span className="symbol"> USDs</span>
        </div>
      ) : (
        <div>No balance data available</div>
      )}
    </div>
  );
};

export default BalanceChecker;