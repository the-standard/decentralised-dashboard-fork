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
} from "../../store/Store";

import Staking from "../../components/liquidation-pools/Staking";
import StakedAssets from "../../components/liquidation-pools/StakedAssets";
import ClaimTokens from "../../components/liquidation-pools/ClaimTokens";

const LiquidationPools = () => {
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

export default LiquidationPools;