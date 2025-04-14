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
  const [redemption, setRedemption] = useState();

  useEffect(() => {
    getUpcomingRedemption();
  }, []);

  const getUpcomingRedemption = async () => {
    try {
      const response = await axios.get(
        `https://smart-vault-api.thestandard.io/redemption`
      );
      const data = response.data;
      setRedemption(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (redemption) {
    if (vaultId === redemption?.tokenID) {
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
                Your smart vault currently has the lowest collateral-to-debt ratio on the protocol. It may automatically use it's collateral to repay your debt at a slight discount if USDs trades below $0.9899 cents.
                <br/>
                This ensures the stability of the protocol.
                <br/>
                To avoid an auto redemption, consider repaying some USDs debt soon.
              </Typography>
              <div className="card-actions flex-1 flex-col lg:flex-row justify-end items-end">
                <Button
                  onClick={() => window.open("https://www.thestandard.io/blog/why-the-standards-self-redeeming-smart-vaults-redefine-defi-redemptions", "_blank")}
                  variant="outline"
                  className="w-full sm:w-auto sm:btn-sm"
                >
                  Read More
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