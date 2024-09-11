import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReadContract,
} from "wagmi";

import {
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

import {
  useVaultAddressStore,
  useSmartVaultABIStore,
} from "../../../store/Store";

import YieldList from "./YieldList";
// import YieldRatio from "./YieldRatio";

import Card from "../../ui/Card";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";

const Vault = (props) => {
  const { yieldEnabled } = props;
  const { vaultAddress } = useVaultAddressStore();
  const { smartVaultABI } = useSmartVaultABIStore();
  // TODO TEMP
  const [ demo, setDemo ] = useState(false);

  const navigate = useNavigate();

  const { data: yieldData, refetch, isPending } = useReadContract({
    abi: smartVaultABI,
    address: vaultAddress,
    functionName: "yieldAssets",
    args: [],
  });

  // TODO TEMP
  const demoData = {
    amountA: 4135957031250000000n,
    amountB: 4043n,
    decA: 18,
    decB: 6,
    hypervisor: "0x1231231231231231231231231231231231231231",
    symbolA: "USDs",
    symbolB: "USDC",
  }
  if (demo) {
    return (
      <div className="flex-1 grow-[3]">
        <Card className="card-compact">
          <div className="card-body">
            <YieldList
              yieldData={demoData}
              yieldIsPending={false}
              setDemo={setDemo}
              demo={demo}
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {yieldEnabled ? (
        <>
          {yieldData && yieldData.length ? (
            <div className="flex-1 grow-[3]">
              <Card className="card-compact">
                <div className="card-body">
                  <YieldList
                    yieldData={yieldData}
                    yieldIsPending={isPending}
                    // TODO TEMP
                    setDemo={setDemo}
                    demo={demo}      
                  />
                  {/* <YieldRatio /> */}
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex-1 grow-[3]">
              <Card className="card-compact">
                <div className="card-body">
                  <Typography variant="h2" className="card-title flex gap-0">
                      {/* TODO TEMP */}
                      <AdjustmentsHorizontalIcon
                        className="mr-2 h-6 w-6 inline-block"
                        onClick={() => setDemo(!demo)}
                      />
                    Yield Pools
                  </Typography>
                  <Typography
                    variant="p"
                    className="mb-2"
                  >
                    Start earning tokens through a mix of volatile collateral and correlated stable asset yield strategies.
                  </Typography>
                  <Typography
                    variant="p"
                    className="mb-2"
                  >
                    Get started by placing some of your Collateral tokens into a yield pool now!
                  </Typography>
                </div>
              </Card>
            </div>  
          )}
        </>
      ) : (
        <div className="flex-1 grow-[3]">
          <Card className="card-compact">
            <div className="card-body">
              <Typography variant="h2" className="card-title flex gap-0">
                <AdjustmentsHorizontalIcon className="mr-2 h-6 w-6 inline-block"/>
                Yield Pools
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