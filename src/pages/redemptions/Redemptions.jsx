import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/16/solid';

import VaultList from '../../components/redemptions/VaultList';
import USDsStatus from '../../components/redemptions/USDsStatus';

import Card from "../../components/ui/Card";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";

const Redemptions = (props) => {
  const [redemptionsData, setRedemptionsData] = useState({});
  const [redemptionsDataLoading, setRedemptionsDataLoading] = useState(true);
  const [USDsBalance, setUSDsBalance] = useState(0n);

  const navigate = useNavigate();

  const getRedemptionsData = async () => {
    try {
      setRedemptionsDataLoading(true);
      const response = await axios.get(
        "https://smart-vault-api.thestandard.io/redemptions"
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
    getRedemptionsData();
  }, []);

  return (
    <main>

      <div className="flex gap-4 mb-4 flex-col md:flex-row">

        <Card className="card-compact flex-1">
          <div className="card-body overflow-x-scroll">
            <Typography variant="h2" className="card-title flex gap-0">
              Auto Redemptions
            </Typography>

            <div className="h-full">
              <Typography variant="p" className="mb-2">
                If your vault is on this list, it may automatically use it's collateral to repay it's debt at a slight discount if USDs trades below $0.9899 cents.
              </Typography>
              <Typography variant="p" className="mb-2">
                This is to ensure the stability of the protocol.
              </Typography>
              <Typography variant="p" className="mb-2">
                To avoid an auto-redemption, consider repaying some USDs debt soon.
              </Typography>
            </div>

            <div className="card-actions">
              <Button
                onClick={() => window.open("https://www.thestandard.io/blog/why-the-standards-self-redeeming-smart-vaults-redefine-defi-redemptions", "_blank")}
                variant="outline"
                className="w-auto"
              >
                <ArrowTopRightOnSquareIcon
                  className="h-4 w-4 inline-block"
                />
                More Info
              </Button>
              <Button
                color="primary"
                onClick={() => navigate("/dex")}
              >
                Need more USDs? Exchange Here
              </Button>
            </div>
          </div>
        </Card>

        <USDsStatus
          usdsUsdcPrice={redemptionsData?.usdsUsdcPrice || ''}
          usdsRemainingToTriggerPrice={redemptionsData?.usdsRemainingToTriggerPrice || ''}
          isLoading={redemptionsDataLoading}
        />

      </div>

      <VaultList
        vaults={redemptionsData?.vaults || []}
        vaultsLoading={redemptionsDataLoading}
        listType={'USDs'}
      />

    </main>
  );
};

export default Redemptions;