import { 
  useReadContract,
  useAccount,
  useChainId,
  useWatchBlockNumber
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

import {
  useLiquidationPoolAbiStore,
  useLiquidationPoolStore,
} from "../../../store/Store";

import Staking from "./Staking";
import StakedAssets from "./StakedAssets";
import ClaimTokens from "./ClaimTokens";

import Select from "../../ui/Select";
import Card from "../../ui/Card";
import Typography from "../../ui/Typography";

const PoolV1 = (props) => {
  const { setActiveView, activeView } = props;
  const { liquidationPoolAbi } = useLiquidationPoolAbiStore();

  const {
    arbitrumSepoliaLiquidationPoolAddress,
    arbitrumLiquidationPoolAddress,
  } = useLiquidationPoolStore();

  const { address } = useAccount();
  const chainId = useChainId();

  const liquidationPoolAddress =
  chainId === arbitrumSepolia.id
    ? arbitrumSepoliaLiquidationPoolAddress
    : arbitrumLiquidationPoolAddress;

  const { data: liquidationPool, refetch, isLoading } = useReadContract({
    address: liquidationPoolAddress,
    abi: liquidationPoolAbi,
    functionName: "position",
    args: [address],
  });

  useWatchBlockNumber({
    onBlockNumber() {
      refetch();
    },
  })

  const positions = liquidationPool && liquidationPool[0];
  const pending = liquidationPool && liquidationPool[1];
  const rewards = liquidationPool && liquidationPool[2];

  return (
    <main className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div>
        <Staking />
      </div>
      <div className="order-first md:order-[unset]">
        <Card className="card-compact">
          <div className="card-body">
            <Typography variant="h2" className="card-title">
              Liquidity Pool Version
            </Typography>
            <Typography
              variant="p"
              className="mb-4"
            >
              Here you can select the pool version you want. Our latest versions contain the most up to date features to help you compound your rewards & more.
            </Typography>
            <Select
              value={activeView || ''}
              label="Pool Version"
              handleChange={setActiveView}
              optName="name"
              optValue="value"
              options={[
                {
                  name: 'Version 2',
                  value: 'V2',
                },
                {
                  name: 'Version 1',
                  value: 'V1',
                },
              ]}
              className="w-full mb-4"
            >
            </Select>
          </div>
        </Card>
      </div>
      <div>
        <StakedAssets
          loading={isLoading}
          positions={positions || {}}
          pending={pending || {}}
        />
      </div>
      <div>
        <ClaimTokens
          loading={isLoading}
          rewards={rewards || []}
        />
      </div>
    </main>
  );
};

export default PoolV1;