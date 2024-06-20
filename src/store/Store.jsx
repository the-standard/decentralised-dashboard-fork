import { create } from "zustand";
import vaultManagerAbi from "../abis/vaultManager";
import erc20Abi from "../abis/erc20";
import chainlinkAbi from "../abis/priceFeeds/chainlink";
import smartVaultABI from "../abis/smartVault";
import stakingAbi from "../abis/staking";
import liquidationPoolAbi from "../abis/liquidationPool";
import stakingPoolv2Abi from "../abis/stakingPoolV2";

export const useCurrentTheme = create(
  (set) => ({
    currentTheme: 'deluxe-dark',
    setCurrentTheme: (currentTheme) => set(() => ({ currentTheme: currentTheme })),
  })
);

export const useWideBorrowModal = create(
  (set) => ({
    borrowWide: false,
    setBorrowWide: (borrowWide) => set(() => ({ borrowWide: borrowWide })),
  })
);

export const useVaultHealthUpdate = create(
  (set) => ({
    vaultHealthUpdateAmount: 0,
    vaultHealthUpdateType: '',
    setVaultHealthUpdateAmount: (vaultHealthUpdateAmount) => set(() => ({ vaultHealthUpdateAmount: vaultHealthUpdateAmount })),
    setVaultHealthUpdateType: (vaultHealthUpdateType) => set(() => ({ vaultHealthUpdateType: vaultHealthUpdateType })),
  })
);

export const useEthToUsdAddressStore = create() (
  (set) => ({
    arbitrumOneEthToUsdAddress: "0x639fe6ab55c921f74e7fac1ee960c0b6293ba612",
    arbitrumSepoliaEthToUsdAddress: "0x1DD905cb0a5aCEFF9E050eB8FAEB9b54d6C09940",
    setEthToUsdAddress: (arbitrumOneEthToUsdAddress) =>
      set(() => ({ ethToUsdAddress: arbitrumOneEthToUsdAddress })),
  })
);

export const useUSDToEuroAddressStore = create() (
  (set) => ({
    arbitrumOneUSDToEuroAddress: "0xA14d53bC1F1c0F31B4aA3BD109344E5009051a84",
    arbitrumSepoliaUSDToEuroAddress: "0x34319A7424bC39C29958d2eb905D743C2b1cAFCa",
    setUSDToEuroAddress: (arbitrumOneUSDToEuroAddress) =>
      set(() => ({ usdToEuroAddress: arbitrumOneUSDToEuroAddress })),
  })
);

export const usesEuroAddressStore = create() (
  (set) => ({
    arbitrumsEuroAddress: "0x643b34980e635719c15a2d4ce69571a258f940e9",
    arbitrumSepoliasEuroAddress: "0x5D1684E5b989Eb232ac84D6b73D783FE44114C2b",
    setsEuroAddress: (arbitrumsEuroAddress) =>
      set(() => ({ sEuroAddress: arbitrumsEuroAddress })),
  })
);

export const useTstAddressStore = create() (
  (set) => ({
    arbitrumTstAddress: "0xf5A27E55C748bCDdBfeA5477CB9Ae924f0f7fd2e",
    arbitrumSepoliaTstAddress: "0xcD2204188db24d8db2b15151357e43365443B113",
    setTstAddress: (arbitrumTstAddress) =>
      set(() => ({ tstAddress: arbitrumTstAddress })),
  })
);

export const useStakingContractsStore = create() (
  (set) => ({
    arbitrumStakingContractsAddress: "0xBe57E0d3126a1F28a2E840ECbB842cb357e56866",
    arbitrumSepoliaStakingContractsAddress: "0x367836e4E4C3624b53aE8821d5ffe85602A83C3C",
    setStakingContractsAddress: (arbitrumStakingContractsAddress) =>
      set(() => ({ stakingContractsAddress: arbitrumStakingContractsAddress })),
  })
);

export const useLiquidationPoolStore = create() (
  (set) => ({
    arbitrumLiquidationPoolAddress: "0x6F3e7d650D7Fe0fd4232c76561c8022D12107c93",
    arbitrumSepoliaLiquidationPoolAddress: "0x698c8bA8879b1761A62B35f1B2141E9eDAB734d6",
    setLiquidationPoolAddress: (arbitrumLiquidationPoolAddress) =>
      set(() => ({ liquidationPoolAddress: arbitrumLiquidationPoolAddress })),
  })
);

export const useStakingPoolv2AddressStore = create()(
  (set) => ({
    arbitrumStakingPoolv2Address: "0x2b422Fafc9C5841e6dFaDB383a62406B4BF13Ece",
    arbitrumSepoliaStakingPoolv2Address: "0x87e9427c95D3a7f637fB5f3aED235ac7F4C62c19",
    getStakingPoolv2Address: (arbitrumStakingPoolv2Address) =>
      set(() => ({ stakingPoolv2Address: arbitrumStakingPoolv2Address })),
  })
);

export const useChainlinkAbiStore = create() (
  (set) => ({
    chainlinkAbi: chainlinkAbi,
    setChainlinkAbi: (chainlinkAbi) =>
      set(() => ({ chainlinkAbi: chainlinkAbi })),
  })
);

export const useSmartVaultABIStore = create() (
  () => ({
    smartVaultABI,
  })
);

export const useContractAddressStore = create() (
  (set) => ({
    arbitrumContractAddress: "0xba169cceCCF7aC51dA223e04654Cf16ef41A68CC",
    arbitrumSepoliaContractAddress: "0xBbB704f184E716410a9c00435530eA055CfAD187",
    setContractAddress: (arbitrumContractAddress) =>
      set(() => ({ contractAddress: arbitrumContractAddress })),
  })
);

export const useVaultManagerAbiStore = create() (
  (set) => ({
    vaultManagerAbi: vaultManagerAbi,
    setVaultManagerAbi: (vaultManagerAbi) =>
      set(() => ({ vaultManagerAbi: vaultManagerAbi })),
  })
);

export const useStakingAbiStore = create() (
  (set) => ({
    stakingAbi: stakingAbi,
    setStakingAbi: (stakingAbi) =>
      set(() => ({ stakingAbi: stakingAbi })),
  })
);

export const useLiquidationPoolAbiStore = create() (
  (set) => ({
    liquidationPoolAbi: liquidationPoolAbi,
    setLiquidationPoolAbi: (liquidationPoolAbi) =>
      set(() => ({ liquidationPoolAbi: liquidationPoolAbi })),
  })
);

export const useStakingPoolv2AbiStore = create()(
  (set) => ({
    stakingPoolv2Abi: stakingPoolv2Abi,
    getLiquidationPoolAbi: (stakingPoolv2Abi) =>
      set(() => ({ stakingPoolv2Abi: stakingPoolv2Abi })),
  })
);

export const useErc20AbiStore = create() (
  (set) => ({
    erc20Abi: erc20Abi,
    setErc20Abi: (erc20Abi) => set(() => ({ erc20Abi: erc20Abi })),
  })
);

export const useVaultIdStore = create() (
  (set) => ({
    vaultID: 1,
    setVaultID: (id) => set(() => ({ vaultID: id })),
  })
);

export const useVaultStore = create() (
  (set) => ({
    vaultStore: [],
    setVaultStore: (vaultStore) => set(() => ({ vaultStore: vaultStore })),
  })
);

export const useVaultAddressStore = create() (
  (set) => ({
    vaultAddress: "",
    setVaultAddress: (vaultAddress) => set({ vaultAddress: vaultAddress }),
  })
);

export const useCollateralSymbolStore = create()(
  (set) => ({
    collateralSymbol: "",
    setCollateralSymbol: (collateralSymbol) =>
      set(() => ({ collateralSymbol: collateralSymbol })),
  })
);

export const useVaultForListingStore = create(
  (set) => ({
    vaultForListing: [],
    setVaultForListing: (vaultForListing) => set({ vaultForListing }),
  })
);

export const useCurrentPageStore = create(
  (set) => ({
    currentPage: 1,
    setCurrentPage: (currentPage) => set(() => ({ currentPage: currentPage })),
  })
);
