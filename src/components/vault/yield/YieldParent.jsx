import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  useBlockNumber,
  useReadContract,
  useChainId,
  useWatchBlockNumber,
  useAccount,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useSmartVaultABIStore,
} from "../../../store/Store";

import YieldList from "./YieldList";
import YieldRatio from "./YieldRatio";

import Card from "../../ui/Card";
import Typography from "../../ui/Typography";
import CenterLoader from "../../ui/CenterLoader";
import Button from "../../ui/Button";

const Vault = (props) => {
  const { vaultType, yieldEnabled } = props;
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();

  const { data: yieldData, refetch: refetchYield, isPending: yieldIsPending } = useReadContract({
    abi: smartVaultABI,
    address: vaultAddress,
    functionName: "yieldAssets",
    args: [],
  });

  return (
    <>
      {yieldEnabled ? (
        <div className="flex-1 grow-[3]">
          <Card className="card-compact">
            <div className="card-body">
              {/* TEMP TODO */}
              <YieldList
                yieldData={yieldData}
                yieldIsPending={yieldIsPending}
              />
              <YieldRatio />
              <div className="flex flex-col mt-2">
                <div className="flex-1 flex flex-row justify-between">
                  <Typography
                    variant="p"
                  >
                    Total Yield Earned
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-right"
                  >
                    €TBC.12
                  </Typography>
                </div>
                <div className="flex-1 flex flex-row justify-between">
                  <Typography
                    variant="p"
                  >
                    Total Balance
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-right"
                  >
                    €TBC.34
                  </Typography>
                </div>

              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex-1 grow-[3]">
          <Card className="card-compact">
            <div className="card-body">
              <Typography variant="h2" className="card-title flex gap-0">
                <AdjustmentsHorizontalIcon className="mr-2 h-6 w-6 inline-block"/>
                Earn Yields
              </Typography>
              <Typography
                variant="p"
                className="mb-2"
              >
                Start earning token yields through a mix of volatile collateral and correlated stable asset yield strategies.
              </Typography>
              <Typography
                variant="p"
                className="mb-2"
              >
                Currently only available on V4 USDs vaults.
              </Typography>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                disabled={isLoading}
                className="pl-2"
              >
                View My Vaults
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
};

export default Vault;