import { useState } from "react";

import { ethers } from "ethers";

import {
  Button,
  Card,
} from 'react-daisyui';

import WithdrawModal from "./WithdrawModal";
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
      <Card
        compact
        className="bg-base-100 shadow-md w-full"
      >
        <Card.Body>
          <Card.Title tag="h2" className="justify-between">
            Staked Assets
          </Card.Title>

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

          <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              onClick={() => setOpen(true)}
              disabled={tstAmount <= 0 && eurosAmount <= 0}
            >
              Withdraw
            </Button>
          </Card.Actions>

        </Card.Body>
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