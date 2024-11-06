import { useState } from "react";

import { ethers } from "ethers";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Typography from "../ui/Typography";
import CenterLoader from "../ui/CenterLoader";

import StakingDecreaseModal from "./StakingDecreaseModal";

const StakingAssets = ({
  positions,
}) => {
  const [open, setOpen] = useState(false);

  if (!positions) {
    return (
      <Card className="card-compact">
        <div className="card-body">
          <CenterLoader />
        </div>
      </Card>
    )  
  }

  const tstAmount = positions[1] || 0;

  const useRows = [
    {
      asset: 'TST',
      amount: tstAmount || 0
    },
  ]

  const handleCloseModal = () => {
    setOpen(false)
  };

  const rows = useRows || [];

  let noStaked = true;
  if (rows.some(e => e.amount > 0)) {
    noStaked = false;
  }

  return (
    <Card className="card-compact w-full">
      <div className="card-body">
        <Typography variant="h2" className="card-title justify-between">
          Staked Assets
        </Typography>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Amount</th>
              </tr>
            </thead>
            {!positions ? (null) : (
              <tbody>
                {rows.map(function(asset, index) {
                  const amount = asset?.amount;
                  const decimals = asset?.dec;
                  const symbol = asset?.asset;

                  return(
                    <tr key={index}>
                      <td>
                        {symbol}
                      </td>
                      <td>
                        {ethers.formatUnits(amount, decimals)}
                      </td>
                    </tr>
                  )}
                )}
              </tbody>
            )}
          </table>
          {!positions ? (
            <CenterLoader slim />
          ) : (null)}
        </div>

        <div className="card-actions flex flex-row justify-end">
          <Button
            color="primary"
            onClick={() => setOpen(true)}
            disabled={noStaked}
          >
            Withdraw
          </Button>
        </div>
        <StakingDecreaseModal
          stakedPositions={rows}
          handleCloseModal={handleCloseModal}
          isOpen={open}
        />
      </div>
    </Card>
  )
};

export default StakingAssets;
