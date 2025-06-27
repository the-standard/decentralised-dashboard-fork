import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import axios from "axios";

import Card from "../ui/Card";
import Button from "../ui/Button";
import Typography from "../ui/Typography";

const VaultRedemptionAlert = ({
  vaultId,
}) => {
  const navigate = useNavigate();
  const [redemptionsData, setRedemptionsData] = useState({});
  const [redemptionsDataLoading, setRedemptionsDataLoading] = useState(true);

  const getUpcomingRedemptionsData = async () => {
    try {
      const response = await axios.get(
        `https://smart-vault-api.thestandard.io/redemptions`
      );
      const useData = response?.data;
      setRedemptionsData(useData);
      setRedemptionsDataLoading(false);
    } catch (error) {
      console.log(error);
      setRedemptionsDataLoading(false);
    }
  };

  useEffect(() => {
    getUpcomingRedemptionsData();
  }, []);

  const redemptionsVaults = redemptionsData?.vaults || [];

  const vaultOnList = redemptionsVaults?.find((item) => item.tokenID === Number(vaultId));

  if (redemptionsData) {
    if (vaultOnList) {
      return (
        <>
          <Card className="card-compact mb-4 warn-card">
            <div className="card-body">
              <Typography variant="h2" className="card-title flex gap-0">
                <ExclamationTriangleIcon
                  className="mr-2 h-6 w-6 inline-block"
                />
                Upcoming Auto Redemption
              </Typography>
              <Typography variant="p">
                Your smart vault currently has one of the lowest collateral-to-debt ratios on the protocol. It may automatically use its collateral to repay your debt at a slight discount if USDs trades below $0.9899 cents.
                <br/>
                This ensures the stability of the protocol.
                <br/>
                To avoid an auto redemption, consider repaying some USDs debt soon or add more collateral.
              </Typography>
              <div className="card-actions flex-1 flex-col lg:flex-row justify-end items-end">
                <Button
                  onClick={() => navigate('/redemptions')}
                  variant="outline"
                  className="w-full sm:w-auto sm:btn-sm"
                >
                  See More
                </Button>
                <Button
                  onClick={() => navigate('/dex?toChain=42161&toToken=0x2Ea0bE86990E8Dac0D09e4316Bb92086F304622d')}
                  variant="outline"
                  className="w-full sm:w-auto sm:btn-sm"
                >
                  Buy USDs Here
                </Button>
              </div>
            </div>
          </Card>
        </>
      )
    }  
  }
  
  return (<></>)
};

export default VaultRedemptionAlert;