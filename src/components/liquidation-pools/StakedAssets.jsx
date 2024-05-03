import { useState } from "react";

import { ethers } from "ethers";

import {
  Button,
} from 'react-daisyui';

import WithdrawModal from "./WithdrawModal";
import Card from "../ui/Card";
import CenterLoader from "../ui/CenterLoader";

const StakedAssets = ({
  loading,
  positions,
  pending,
}) => {
  const [open, setOpen] = useState(false);

  const tstAmount = positions['TST'] || 0n;
  const eurosAmount = positions['EUROs'] || 0n;

  const isLoading = loading;

  return (
    <>
      <Card className="card-compact w-full">
        <div className="card-body">
          <h2 className="card-title">Vault List</h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
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