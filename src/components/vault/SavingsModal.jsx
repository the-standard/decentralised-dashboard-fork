import { useEffect } from 'react';
import { useNavigate, } from "react-router-dom";
import { ethers } from "ethers";
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Typography from "../ui/Typography";

const SavingsModal = (props) => {
  const {
    open,
    closeModal,
  } = props;
    
  return (
    <>
      <Modal
        open={open}
        closeModal={closeModal}
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col flex-1">
            <Typography variant="h2" className="card-title">
              <BanknotesIcon className="mr-2 h-6 w-6 inline-block"/>
              Automatic Savings Summary
            </Typography>

            <div className="bg-base-300/40 mt-4 rounded-lg w-full flex flex-col">
              <div class="flex items-center justify-between p-4 cursor-pointer">
                <div class="flex items-center gap-3">
                  <CurrencyDollarIcon className="mr-2 h-6 w-6 inline-block"/>
                  <div>
                    <p class="font-medium">Saved $X.XX</p>
                    <p class="text-sm text-gray-500">XX/XX/XXXX, XX:XX:XX</p>
                  </div>
                </div>
                <Button
                  shape="circle"
                  color="ghost"
                >
                  <ChevronUpIcon className="w-6 h-6"/>
                </Button>
              </div>
            </div>

            <div className="card-actions flex-1 pt-4 flex-col-reverse lg:flex-row justify-end items-end">
              <Button
                className="w-full lg:w-auto"
                color="ghost"
                onClick={closeModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SavingsModal;