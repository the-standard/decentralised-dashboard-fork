import { ethers } from "ethers";
import { useReadContracts, useChainId } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import {
  useChainlinkAbiStore,
  useUSDToEuroAddressStore,
  useVaultIdStore,
} from "../../store/Store";

import Typography from "../ui/Typography";
import VaultHealth from "./VaultHealth";

const VaultStats = ({
  currentVault,
}) => {
  const chainId = useChainId();
  const { vaultID } = useVaultIdStore();
  const { chainlinkAbi } = useChainlinkAbiStore();
  const { arbitrumOneUSDToEuroAddress, arbitrumSepoliaUSDToEuroAddress } =
    useUSDToEuroAddressStore();

  const chainlinkContract = {
    abi: chainlinkAbi,
    functionName: "latestRoundData",
  };

  const eurUsdAddress =
    chainId === arbitrumSepolia.id
      ? arbitrumSepoliaUSDToEuroAddress
      : arbitrumOneUSDToEuroAddress;

  const contracts = [
    {
      address: eurUsdAddress,
      ...chainlinkContract,
    },
  ];

  const { data: priceData } = useReadContracts({
    contracts,
  });

  const prices = priceData?.map((data) => {
    const result = data.result;
    if (result && result[1]) {
      return result[1];
    }
  });

  const statsItems = [
    {
      title: "Debt",
      value: Number(ethers.formatEther(currentVault.status.minted)).toFixed(2),
      currency: "EUROs",
    },
    {
      title: "Balance",
      value: '€' + Number(
        ethers.formatEther(currentVault.status.totalCollateralValue)
      ).toFixed(2),
      currency: "",
    },
    {
      title: "Borrow up to",
      value: (
        ((Number(ethers.formatEther(currentVault.status.maxMintable)) -
          Number(ethers.formatEther(currentVault.status.minted))) *
          (100000 - Number(currentVault.mintFeeRate))) /
        100000
      ).toFixed(2),
      currency: "EUROs",
    },
  ];

  return (
    <>
      <div className="flex flex-wrap">
        {/* <Typography
          variant="h3"
          className="mb-2"
        >
          Smart Vault #{vaultID}
        </Typography> */}
      </div>
      <div className="-mx-1 flex flex-wrap">
        {statsItems.map((item, index) => (
          <div
            className="w-1/2 px-1 my-2 sm:my-2 sm:w-1/2 lg:my-0 lg:w-1/3"
            key={index}
          >
            <Typography
              variant="p"
            >
              {item.title}
            </Typography>
            <div>
              <Typography
                variant="h2"
              >
                {item.value}&nbsp;
              </Typography>
              <Typography
                variant="p"
              >
                {item.currency}
              </Typography>
            </div>
          </div>
        ))}
        <div className="w-full px-1 mt-4">
          {currentVault.status.liquidated ? (
            <Typography variant="h1" className="text-error">
              Vault Liquidated
            </Typography>
          ) : (
            <VaultHealth currentVault={currentVault}/>
          )}
        </div>
      </div>
    </>
  )

};

export default VaultStats;