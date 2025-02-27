import { useState } from "react";

import { ethers } from "ethers";

import {
  Tooltip,
} from 'react-daisyui';

import {
  useGuestShowcaseStore,
} from "../../store/Store";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Typography from "../ui/Typography";
import CenterLoader from "../ui/CenterLoader";

import StakingDecreaseModal from "./StakingDecreaseModal";

const StakingSummary = ({
  positions,
  rawStakedSince,
}) => {
  const {
    useShowcase,
  } = useGuestShowcaseStore();
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

  let noStaked = true;
  if (tstAmount > 0) {
    noStaked = false;
  }

  // formatted amount
  const stakedAmount = ethers.formatUnits(tstAmount.toString(), 18);

  const handleCloseModal = () => {
    setOpen(false)
  };

  if (!rawStakedSince) {
    return (
      <Card className="card-compact w-full">
        <div className="card-body">
          <Typography variant="h2" className="card-title justify-between">
            TST Staking
          </Typography>
  
          <div className="grid grid-cols-1 gap-4 mb-2">
            <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
              <div className="w-full">
                <Typography variant="p">
                  Total TST Staked
                </Typography>
                <Typography variant="h2">
                  0 TST
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="card-compact w-full">
      <div className="card-body">
        <Typography variant="h2" className="card-title justify-between">
          TST Staking
        </Typography>

        <div className="grid grid-cols-1 gap-4 mb-2">
          <div className="bg-base-300/40 p-4 rounded-lg w-full flex items-center">
            <div className="w-full">
              <Typography variant="p">
                Total TST Staked
              </Typography>
              <Tooltip
                className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                position="top"
                message={`${stakedAmount} TST`}
              >
                <Typography variant="h2">
                  {stakedAmount ? (
                    Number.parseFloat(Number(stakedAmount).toFixed(4))
                  ) : ('0')}
                  &nbsp;TST
                </Typography>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="card-actions pt-2 flex-col lg:flex-row">
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            disabled={useShowcase || noStaked}
            className="w-full flex-1"
          >
            Stop Staking TST
          </Button>
        </div>
        <StakingDecreaseModal
          tstAmount={tstAmount}
          handleCloseModal={handleCloseModal}
          isOpen={open}
        />
      </div>
    </Card>
  )
};

export default StakingSummary;
