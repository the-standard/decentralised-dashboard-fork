import { useState, useEffect } from "react";
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
    {
      tokenID: 52
    },
    {
      tokenID: 75
    },
    {
      tokenID: 1
    },
    {
      tokenID: 3
    },
    {
      tokenID: 5
    },
    {
      tokenID: 10
    },
  ];

  return (
    <main>

      <Card className="card-compact mb-4">
        <div className="card-body overflow-x-scroll">
          <Typography variant="h2" className="card-title flex gap-0">
            Liquidations
          </Typography>

          <Typography variant="p">
            USDs vaults Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum 
          </Typography>

          <BalanceChecker
            USDsBalance={USDsBalance}
            setUSDsBalance={setUSDsBalance}
          />
        </div>
      </Card>

      <LiquidationsList
        // items={liquidationsData}
        items={testData}
        USDsBalance={USDsBalance}
      />

    </main>
  );
};

export default Liquidations;