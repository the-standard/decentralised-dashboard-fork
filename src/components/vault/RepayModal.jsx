import {
  Button,
  Card,
} from 'react-daisyui';
import { formatEther } from "viem";

import {
  ArrowUpCircleIcon,
} from '@heroicons/react/24/outline';

import Modal from "../Modal.jsx";
import Typography from "../Typography.jsx";

const RepayModal = (props) => {
  const {
    open,
    closeModal,
    handleAmount,
    handleInputMax,
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
  } = props;

  if (isSuccess) {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
        >
          <Card.Title tag="h2">
            <ArrowUpCircleIcon className="h-6 w-6 inline-block"/>
            Repaying EUROs
          </Card.Title>

          <Typography
            variant="h3"
          >
            You just repayed {amount} EUROs successfully!
          </Typography>

          <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-64"
              onClick={closeModal}
            >
              Close
            </Button>
          </Card.Actions>
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
          <Card.Title tag="h2">
            Confirm Your EUROs Spending cap
          </Card.Title>
  
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
            We suggest a cap of {formatEther(repayFee)} for this transaction. This fee ({toPercentage(burnFeeRate)}%) is rewarded to Liquidity Pool stakers, helping the DAO grow and build more features.
          </Typography>
  
          <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
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
          </Card.Actions>
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
          <Card.Title tag="h2">
            Confirm Your Loan Repayment
          </Card.Title>
  
          <Typography
            variant="p"
            className="mb-2"
          >
            The funds will repay your loan and the small fee will support the Liquidity Pool.
          </Typography>
  
          <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
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
          </Card.Actions>
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
        <Card.Title tag="h2">
          <ArrowUpCircleIcon className="h-6 w-6 inline-block"/>
          Repaying EUROs
        </Card.Title>

        <div
          className="join"
        >
          <input
            className="input input-bordered join-item w-full"
            placeholder="Amount of EUROs you want to repay"
            type="number"
            onChange={handleAmount}
            disabled={isPending}
            ref={inputRef}
          />

          <Button
            className="join-item"
            onClick={handleInputMax}
            disabled={isPending}
          >
            Max
          </Button>
        </div>

        <div className="mt-4">
          {repayValues.map((item) => (
            <div
              className="flex justify-between align-center"
              key={item.key}
            >
              <Typography
                variant="p"
              >
                {item.key}
              </Typography>
              <Typography
                variant="p"
              >
                {item.value || '0'}
              </Typography>
            </div>
          ))}
        </div>

        <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
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
        </Card.Actions>
      </Modal>
    </>
  );
};

export default RepayModal;