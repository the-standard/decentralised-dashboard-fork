import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
} from 'react-daisyui';

import {
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

import Modal from "../Modal.jsx";
import Typography from "../Typography.jsx";

const BorrowModal = (props) => {
  const {
    open,
    closeModal,
    handleAmount,
    isPending,
    isSuccess,
    amount,
    handleDebtAction,
    borrowValues
  } = props;

  const navigate = useNavigate();

  if (isSuccess) {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
        >
          <Card.Title tag="h2">
            <ArrowDownCircleIcon className="h-6 w-6 inline-block"/>
            Borrowing EUROs
          </Card.Title>

          <Typography
            variant="h3"
          >
            You just borrowed {amount} EUROs successfully!
          </Typography>

          <Typography
            variant="h3"
          >
            Don't forget you can buy discounted tokens by placing your EUROs into Liquidation Pools.
          </Typography>

          <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-auto"
              color="ghost"
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              className="w-full lg:w-64"
              onClick={() => navigate('/liquidation-pools')}
            >
              Get Discounted Tokens
            </Button>
          </Card.Actions>
        </Modal>
      </>
    )
  }
    
  return (
    <>
      <Modal
        open={open}
        closeModal={closeModal}
      >
        <Card.Title tag="h2">
          <ArrowDownCircleIcon className="h-6 w-6 inline-block"/>
          Borrowing EUROs
        </Card.Title>

        <input
          className="input input-bordered w-full"
          placeholder="Amount of EUROs to borrow"
          type="number"
          value={amount}
          onChange={handleAmount}
          disabled={isPending}
        />

        <div className="mt-4">
          {borrowValues.map((item) => (
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
            onClick={() => handleDebtAction('BORROW')}
            loading={isPending}
          >
            Withdraw
          </Button>
        </Card.Actions>
      </Modal>
    </>
  );
};

export default BorrowModal;