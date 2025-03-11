import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LiquidationsList from '../../components/liquidations/LiquidationsList';
import BalanceChecker from '../../components/liquidations/BalanceChecker';

import Card from "../../components/ui/Card";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";

const Liquidations = (props) => {
  const [liquidationsData, setLiquidationsData] = useState([]);
  const [liquidationsDataLoading, setLiquidationsDataLoading] = useState(true);
  const [USDsBalance, setUSDsBalance] = useState(0n);

  const navigate = useNavigate();

  const getLiquidationsData = async () => {
    try {
      setLiquidationsDataLoading(true);
      const response = await axios.get(
        "https://smart-vault-api.thestandard.io/liquidations"
      );
      const useData = response?.data;
      setLiquidationsData(useData);
      setLiquidationsDataLoading(false);
    } catch (error) {
      console.log(error);
      setLiquidationsDataLoading(false);
    }
  };

  useEffect(() => {
    getLiquidationsData();
  }, []);

  const testData = [
    // {
    //   tokenID: 52
    // },
    // {
    //   tokenID: 75
    // },
    // {
    //   tokenID: 1
    // },
    // {
    //   tokenID: 3
    // },
    // {
    //   tokenID: 5
    // },
    // {
    //   tokenID: 10
    // },
  ];

  console.log(123123, liquidationsData)

  return (
    <main>

      <div className="flex gap-4 mb-4 flex-col md:flex-row">

        <Card className="card-compact flex-1">
          <div className="card-body overflow-x-scroll">
            <Typography variant="h2" className="card-title flex gap-0">
              Liquidations
            </Typography>

            <Typography variant="p">
              Liquidate undercollateralised vaults by paying off their debt in a single transaction to claim their collateral at a discount.
            </Typography>

            <div className="card-actions">
              <Button
                color="primary"
                onClick={() => navigate("/dex")}
              >
                Need more USDs? Exchange Here
              </Button>
            </div>
          </div>
        </Card>

        <Card className="card-compact flex-1 max-w-none md:max-w-[400px]">
          <div className="card-body overflow-x-scroll">
            <Typography variant="h2" className="card-title flex gap-0">
              USDs Balance
            </Typography>

            <Typography variant="p">
              Your currently connected wallet contains:
            </Typography>

            <BalanceChecker
              USDsBalance={USDsBalance}
              setUSDsBalance={setUSDsBalance}
            />
          </div>
        </Card>

      </div>

      <LiquidationsList
        // items={liquidationsData}
        items={liquidationsData}
        USDsBalance={USDsBalance}
      />

    </main>
  );
};

export default Liquidations;