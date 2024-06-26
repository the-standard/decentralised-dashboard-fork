import { useState } from "react";

import { ethers } from "ethers";

import WithdrawModal from "./WithdrawModal";
import Card from "../ui/Card";
import Button from "../ui/Button";
import CenterLoader from "../ui/CenterLoader";
import Typography from "../ui/Typography";

const StakedAssets = ({
  loading,
  positions,
  pending,
}) => {
  const [open, setOpen] = useState(false);

  const tstAmount = positions['TST'] || 0n;
  const eurosAmount = positions['EUROs'] || 0n;

  const isLoading = loading;

  console.log('DEBUGGING')

  return (
    <>
      <Card className="card-compact w-full">
        <div className="card-body">
          <Typography variant="h2" className="card-title">Staked Liquidation Pool Assets</Typography>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Amount</th>
                </tr>
              </thead>
              {isLoading ? (null) : (
                <tbody>
                  <tr>
                    <td>
                      TST
                    </td>
                    <td>
                      {ethers.formatEther(tstAmount.toString())}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      EUROs
                    </td>
                    <td>
                      {ethers.formatEther(eurosAmount.toString())}
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
            {isLoading ? (
              <CenterLoader slim />
            ) : (null)}
          </div>

          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              onClick={() => setOpen(true)}
              color="primary"
              disabled={tstAmount <= 0 && eurosAmount <= 0}
            >
              Withdraw
            </Button>
          </div>

        </div>
      </Card>
      <WithdrawModal
        tstAmount={tstAmount}
        eurosAmount={eurosAmount}
        pending={pending}
        handleCloseModal={() => setOpen(false)}
        isOpen={open}
      />
    </>
  )
};

export default StakedAssets;