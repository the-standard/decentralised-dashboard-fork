import { ethers } from "ethers";

import {
  ArrowUpCircleIcon,
} from '@heroicons/react/24/outline';

import VaultHealth from "./VaultHealth";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import Input from "../ui/Input";

const RepayModal = (props) => {
  const {
    open,
    closeModal,
    handleAmount,
    handleInputMax,
    getInputMax,
    isPending,
    isSuccess,
    amount,
    handleDebtAction,
    repayValues,
    repayStep,
    repayFee,
    burnFeeRate,
    toPercentage,
    inputRef,
    currentVault,
  } = props;

  if (isSuccess) {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
        >
          <Typography variant="h2" className="card-title">
            <ArrowUpCircleIcon className="mr-2 h-6 w-6 inline-block"/>
            Repaying EUROs
          </Typography>

          <Typography
            variant="h3"
          >
            You just repayed {amount} EUROs successfully!
          </Typography>

          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-64"
              onClick={closeModal}
            >
              Close
            </Button>
          </div>
        </Modal>
      </>
    )
  }

  if (repayStep === 1) {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
        >
          <Typography variant="h2" className="card-title">
            Confirm Your EUROs Spending cap
          </Typography>
  
          <Typography
            variant="p"
            className="mb-2"
          >
            For optimal security and transparency, trustworthy DApps
            require you to set a spending limit (cap). This helps regulate
            the maximum amount your wallet can use for a fee.
          </Typography>

          <Typography
            variant="p"
          >
            We suggest a cap of {ethers.formatEther(repayFee)} for this transaction. This fee ({toPercentage(burnFeeRate)}%) is rewarded to Liquidity Pool stakers, helping the DAO grow and build more features.
          </Typography>
  
          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-auto"
              color="ghost"
              disabled
            >
              Close
            </Button>
            <Button
              className="w-full lg:w-64"
              color="success"
              loading
              disabled
            >
              Repay
            </Button>
          </div>
        </Modal>
      </>
    );  
  }

  if (repayStep === 2) {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
        >
          <Typography variant="h2" className="card-title">
            <ArrowUpCircleIcon className="mr-2 h-6 w-6 inline-block"/>
            Confirm Your Loan Repayment
          </Typography>
  
          <Typography
            variant="p"
            className="mb-2"
          >
            The funds will repay your loan and the small fee will support the Liquidity Pool.
          </Typography>
  
          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-auto"
              color="ghost"
              disabled
            >
              Close
            </Button>
            <Button
              className="w-full lg:w-64"
              color="success"
              loading
              disabled
            >
              Repay
            </Button>
          </div>
        </Modal>
      </>
    );  
  }
    
  return (
    <>
      <Modal
        open={open}
        closeModal={closeModal}
      >
        <Typography variant="h2" className="card-title">
          <ArrowUpCircleIcon className="mr-2 h-6 w-6 inline-block"/>
          Repaying EUROs
        </Typography>

        <div className="flex justify-between">
          <Typography
            variant="p"
          >
            Repay Amount
          </Typography>
          <Typography
            variant="p"
            className="text-right"
          >
            Remaining: {getInputMax()}
          </Typography>
        </div>
        <div
          className="join"
        >
          <Input
            className="join-item w-full"
            placeholder="Amount of EUROs you want to repay"
            type="number"
            onChange={(e) => handleAmount(e, 'REPAY')}
            disabled={isPending}
            useRef={inputRef}
          />

          <Button
            className="join-item"
            onClick={() => handleInputMax('REPAY')}
            disabled={isPending}
          >
            Max
          </Button>
        </div>

        <div className="mt-4">
          <VaultHealth currentVault={currentVault}/>
        </div>

        <div>
          {repayValues.map((item) => (
            <div
              className="flex justify-between align-center"
              key={item.key}
            >
              <Typography
                variant="p"
                className="flex-1"
              >
                {item.key}
              </Typography>
              <Typography
                variant="p"
                className="flex-1"
              >
                {item.value || '0'}
              </Typography>
            </div>
          ))}
        </div>

        <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
          <Button
            className="w-full lg:w-auto"
            color="ghost"
            onClick={closeModal}
            disabled={isPending}
          >
            Close
          </Button>
          <Button
            className="w-full lg:w-64"
            color="success"
            disabled={!amount || isPending}
            onClick={() => handleDebtAction('REPAY')}
            loading={isPending}
          >
            Repay
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default RepayModal;