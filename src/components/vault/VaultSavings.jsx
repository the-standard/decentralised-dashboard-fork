import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import {
  useReadContract,
  useChainId
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  BanknotesIcon
} from '@heroicons/react/24/outline';

import Card from "../ui/Card";
import Button from "../ui/Button";
import Typography from "../ui/Typography";

import SavingsModal from "./SavingsModal";

const VaultSavings = ({
  vaultId,
  vaultType,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card className="card-compact mb-4 success-card">
        <div className="card-body">
          <Typography variant="h2" className="card-title flex gap-0">
            <BanknotesIcon
              className="mr-2 h-6 w-6 inline-block"
            />
            Your Smart Vault Has Saved You $XX.XX Total!
          </Typography>
          <Typography variant="p" className="sm:mr-[100px]">
            X automatic savings events have been captured
          </Typography>
          <div className="card-actions flex-1 flex-col-reverse lg:flex-row justify-end items-end">
            <Button
              onClick={() => setModalOpen(true)}
              variant="outline"
              className="w-full sm:w-auto sm:btn-sm mt-[4px] sm:-mt-[2rem]"
            >
              More Info
            </Button>
          </div>
        </div>
      </Card>
      <SavingsModal
        open={modalOpen}
        closeModal={() => setModalOpen(false)}
      />
    </>
  )
};

export default VaultSavings;