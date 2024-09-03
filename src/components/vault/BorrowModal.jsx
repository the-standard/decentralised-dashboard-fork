import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

import {
  useWideBorrowModal,
} from "../../store/Store";

import VaultHealth from "./VaultHealth";
import EurosCompare from "./EurosCompare";

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
    vaultType,
  } = props;

  const { borrowWide } = useWideBorrowModal();

  const navigate = useNavigate();

  const currentDebt = ethers.formatEther(currentVault.status.minted.toString());
  
  if (isSuccess) {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
          wide={true}
        >
          <Typography
            variant="h1"
            className="card-title text-center"
          >
            Congratulations on Borrowing {vaultType}!
          </Typography>

          <Typography
            variant="h3"
            className="text-center mb-4"
          >
            You just borrowed {amount} {vaultType} successfully! Here's what you can do now:
          </Typography>

          <div className="flex gap-4 flex-col md:flex-row">

            <div className="flex-1">
              <Typography
                variant="h2"
                className="mb-2"
              >
                Leverage with Lynx.finance
              </Typography>
              <Typography
                variant="p"
                className="mb-2"
              >
                Why sell {vaultType} direct for 1x ETH when you can get 
                price exposure to 100 times more ETH or BTC with the
                same amount of {vaultType}!
              </Typography>
              <Typography
                variant="p"
                className="mb-4"
              >
                - Use {vaultType} to trade with up to 100x leverage!<br/>
                - Go long or short on various assets<br/>
                - All on chain, you keep your private keys!<br/>
              </Typography>

              <Button
                className="w-full lg:w-64"
                color="primary"
                onClick={() => window.open('https://app.lynx.finance/portfolio?chainId=42161', '_blank')?.focus()}
                >
                Get to Lynx.finance
              </Button>

            </div>
            <div class="divider md:divider-horizontal">OR</div>
            <div className="flex-1">
              <Typography
                variant="h2"
                className="mb-2"
              >
                Earn in TheStandard staking pools
              </Typography>
              <Typography
                variant="p"
                className="mb-2"
              >
                Why sell {vaultType} direct for 1x ETH when you can get 
                price exposure to 100 times more ETH or BTC with the
                same amount of {vaultType}!
              </Typography>
              <Typography
                variant="p"
                className="mb-4"
              >
                - Use {vaultType} to trade with up to 100x leverage!<br/>
                - Go long or short on various assets<br/>
                - All on chain, you keep your private keys!<br/>
              </Typography>

              <Button
                className="w-full lg:w-64"
                color="primary"
                onClick={() => navigate('/liquidation-pools')}
              >
                Earn by staking
              </Button>

            </div>

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
        wide={borrowWide}
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col flex-1">
            <Typography variant="h2" className="card-title">
              <ArrowDownCircleIcon className="mr-2 h-6 w-6 inline-block"/>
              Borrowing {vaultType}
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
              placeholder={`Amount of ${vaultType} to borrow`}
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

            <div className="card-actions flex-1 pt-4 flex-col-reverse lg:flex-row justify-end items-end">
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
          </div>
          {vaultType === 'EUROs' ? (
            <EurosCompare vaultType={vaultType}/>
          ) : null}
        </div>
      </Modal>
    </>
  );
};

export default BorrowModal;