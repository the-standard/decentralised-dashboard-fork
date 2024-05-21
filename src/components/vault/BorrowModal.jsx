import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

import VaultHealth from "./VaultHealth";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Typography from "../ui/Typography";
import Input from "../ui/Input";

const BorrowModal = (props) => {
  const {
    open,
    closeModal,
    handleAmount,
    isPending,
    isSuccess,
    amount,
    handleDebtAction,
    borrowValues,
    inputRef,
    currentVault,
  } = props;

  const navigate = useNavigate();

  const currentDebt = ethers.formatEther(currentVault.status.minted.toString());
  
  if (isSuccess) {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
        >
          <Typography variant="h2" className="card-title">
            <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
            Borrowing EUROs
          </Typography>

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

          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
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
          </div>
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
        <Typography variant="h2" className="card-title">
          <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
          Borrowing EUROs
        </Typography>

        <div className="flex justify-between">
          <Typography
            variant="p"
          >
            Borrow Amount
          </Typography>
          <Typography
            variant="p"
            className="text-right"
          >
            Current Debt: {currentDebt}
          </Typography>
        </div>
        <Input
          className="w-full"
          placeholder="Amount of EUROs to borrow"
          type="number"
          onChange={(e) => handleAmount(e, 'BORROW')}
          disabled={isPending}
          useRef={inputRef}
        />

        <div className="mt-4">
          <VaultHealth currentVault={currentVault}/>
        </div>

        <div>
          {borrowValues.map((item) => (
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
            onClick={() => handleDebtAction('BORROW')}
            loading={isPending}
          >
            Withdraw
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default BorrowModal;