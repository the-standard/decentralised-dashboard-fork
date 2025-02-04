import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import axios from "axios";

import Card from "../ui/Card";
import Typography from "../ui/Typography";

const VaultRedemptionAlert = ({
  vaultId,
}) => {
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
                <ArrowTrendingUpIcon
                  className="mr-2 h-6 w-6 inline-block"
                />
                Upcoming Auto Redemption
              </Typography>
              <Typography variant="p">
                Your vault is currently the most borrowed against, and may automatically use a portion of your collateral to pay off your debt at a discount if USDs trades below $1.
                <br/>
                If you want to avoid the auto redemption you should repay some of your debt now.
              </Typography>
            </div>
          </Card>
        </>
      )
    }  
  }

  return (<></>)
};

export default VaultRedemptionAlert;