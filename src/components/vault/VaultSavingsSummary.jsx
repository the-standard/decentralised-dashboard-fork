import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BanknotesIcon
} from '@heroicons/react/24/outline';
import axios from "axios";

import {
  useVaultAddressStore,
} from "../../store/Store";

import Card from "../ui/Card";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import CenterLoader from "../ui/CenterLoader";

const VaultSavingsSummary = ({
  vaultId,
  vaultType,
}) => {
  const navigate = useNavigate();
  const [savingsLoading, setSavingsLoading] = useState(true);
  const [savingsData, setSavingsData] = useState([]);

  const { vaultAddress } = useVaultAddressStore();

  useEffect(() => {
    getSavingsData();
  }, []);

  const getSavingsData = async () => {
    try {
      setSavingsLoading(true);
      const response = await axios.get(
        `https://smart-vault-api.thestandard.io/redemptions/${vaultAddress}`
      );
      const data = response.data;
      setSavingsData(data);
      setSavingsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // if (savingsLoading) {
  //   return (
  //     <Card className="card-compact mb-4 success-card">
  //       <div className="card-body">
  //         <CenterLoader />
  //       </div>
  //     </Card>
  //   )
  // }

  const totalSaved = savingsData.reduce((sum, item) => {
    const itemSaved = Number(item.debtRepaid) - Number(item.amountUSD);
    return sum + itemSaved;
  }, 0);

  const numberOfSavings = savingsData.length;

  if (numberOfSavings > 0) {
    return (
      <>
        <Card className="card-compact mb-4 success-card">
          <div className="card-body">
            <Typography variant="h2" className="card-title flex gap-0">
              <BanknotesIcon
                className="mr-2 h-6 w-6 inline-block"
              />
              Your Smart Vault Has Saved You ${totalSaved ? (totalSaved.toFixed(2)) : ('')} Total!
            </Typography>
            <Typography variant="p" className="sm:mr-[100px]">
              {numberOfSavings} automatic savings events have been captured
            </Typography>
            <div className="card-actions flex-1 flex-col-reverse lg:flex-row justify-end items-end">
              <Button
                onClick={() => navigate('./savings')}
                variant="outline"
                className="w-full sm:w-auto sm:btn-sm mt-[4px] sm:-mt-[2rem]"
              >
                More Info
              </Button>
            </div>
          </div>
        </Card>
      </>
    )
  }

  return (<></>)
};

export default VaultSavingsSummary;