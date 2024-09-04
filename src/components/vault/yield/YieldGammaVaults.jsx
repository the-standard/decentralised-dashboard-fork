import {
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

export const ArbitrumVaults = [
  {
    asset: 'USDs',
    pair: ['USDs', 'USDC'],
    symbol: '0x5553447300000000000000000000000000000000000000000000000000000000',
    address: '0x0173184A51CF807Cc386B3F5Dc5689Cae09B81fb',
    dec: '18',
  },
  {
    asset: 'USDC',
    pair: ['USDs', 'USDC'],
    symbol: '0x5553444300000000000000000000000000000000000000000000000000000000',
    address: '0xC305a98F34feD6cfFA7B920D26031372B64Fa74E',
    dec: '18',
  },
  {
    asset: 'ETH',
    pair: ['WETH', 'WBTC'],
    symbol: '0x4554480000000000000000000000000000000000000000000000000000000000',
    address: '0x0000000000000000000000000000000000000000',
    dec: '18',
  },
  {
    asset: 'WETH',
    pair: ['WETH', 'WBTC'],
    symbol: '0x5745544800000000000000000000000000000000000000000000000000000000',
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    dec: '18',
  },
  {
    asset: 'WBTC',
    pair: ['WETH', 'WBTC'],
    symbol: '0x5742544300000000000000000000000000000000000000000000000000000000',
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    dec: '8',
  },
  {
    asset: 'ARB',
    pair: ['ARB', 'WETH'],
    symbol: '0x4152420000000000000000000000000000000000000000000000000000000000',
    address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    dec: '18',
  },
  {
    asset: 'LINK',
    pair: ['LINK', 'WETH'],
    symbol: '0x4c494e4b00000000000000000000000000000000000000000000000000000000',
    address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    dec: '18',
  },
  {
    asset: 'GMX',
    pair: ['GMX', 'WETH'],
    symbol: '0x474d580000000000000000000000000000000000000000000000000000000000',
    address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    dec: '18',
  },
  {
    asset: 'RDNT',
    pair: ['RDNT', 'WETH'],
    symbol: '0x52444e5400000000000000000000000000000000000000000000000000000000',
    address: '0x3082CC23568eA640225c2467653dB90e9250AaA0',
    dec: '18',
  },
];

export const SepoliaVaults = [
  {
    asset: 'USDs',
    pair: ['USDs', 'USDC'],
    symbol: '0x5553447300000000000000000000000000000000000000000000000000000000',
    address: '0x0173184A51CF807Cc386B3F5Dc5689Cae09B81fb',
    dec: '18',
  },
  {
    asset: 'USDC',
    pair: ['USDs', 'USDC'],
    symbol: '0x5553444300000000000000000000000000000000000000000000000000000000',
    address: '0xC305a98F34feD6cfFA7B920D26031372B64Fa74E',
    dec: '18',
  },
  {
    asset: 'ETH',
    pair: ['WETH', 'WBTC'],
    symbol: '0x4554480000000000000000000000000000000000000000000000000000000000',
    address: '0x0000000000000000000000000000000000000000',
    dec: '18',
  },
  {
    asset: 'WETH',
    pair: ['WETH', 'WBTC'],
    symbol: '0x5745544800000000000000000000000000000000000000000000000000000000',
    address: '0x081eE2A9FE23b69036C5136437Fa2426fD2d7650',
    dec: '18',
  },
  {
    asset: 'WBTC',
    pair: ['WETH', 'WBTC'],
    symbol: '0x5742544300000000000000000000000000000000000000000000000000000000',
    address: '0x36C85224ac27AccEffC8458c1E1e336C667e3bba',
    dec: '8',
  },
  {
    asset: 'USDs6',
    pair: ['USDs6', 'WETH'],
    symbol: '0x5553447336000000000000000000000000000000000000000000000000000000',
    address: '0xb7269723576B20ed2C3DaBBBe39911402669a395',
    dec: '18',
  },
  {
    asset: 'USDs18',
    pair: ['USDs18', 'WETH'],
    symbol: '0x5553447331380000000000000000000000000000000000000000000000000000',
    address: '0xA977E34e4B8583C6928453CC9572Ae032Cc3200a',
    dec: '18',
  },
];

export const ArbitrumGammaVaults = [
  {
    pair: ['USDs', 'USDC'],
    // TODO add mainnet address
    address: '0x0000000000000000000000000000000000000000'
  },
  {
    pair: ['WETH', 'WBTC'],
    address: '0x52ee1FFBA696c5E9b0Bc177A9f8a3098420EA691',
  },
  {
    pair: ['ARB', 'WETH'],
    address: '0x330DFC5Bc1a63A1dCf1cD5bc9aD3D5e5E61Bcb6C',
  },
  {
    pair: ['LINK', 'WETH'],
    address: '0xfA392dbefd2d5ec891eF5aEB87397A89843a8260',
  },
  {
    pair: ['GMX', 'WETH'],
    address: '0xf08bdbc590c59cb7b27a8d224e419ef058952b5f',
  },
  {
    pair: ['RDNT', 'WETH'],
    address: '0x2bcbdd577616357464cfe307bc67f9e820a66e80',
  },
];

export const SepoliaGammaVaults = [
  {
    pair: ['USDs', 'USDC'],
    address: '0xc5B84d2f09094f72B79FE906d21c933c2DF27448'
  },
  {
    pair: ['WETH', 'WBTC'],
    address: '0x5983C0811239ab91fB8dc72D7414257Dd8a27699',
  },
  {
    pair: ['USDs6', 'WETH'],
    address: '0xc82B4793564719b55AA645c45AD9ee0Fa574E07D',
  },
  {
    pair: ['USDs18', 'WETH'],
    address: '0x0881d58b146208230D720656320624c386661795',
  },
]

export const YieldVaults = () => {
  const chainId = useChainId();

  const useVaults = chainId === arbitrumSepolia.id
  ? SepoliaVaults
  : ArbitrumVaults;
  
  return useVaults;
};

export const YieldGammaVaults = () => {
  const chainId = useChainId();

  const useGammaVaults = chainId === arbitrumSepolia.id
  ? SepoliaGammaVaults
  : ArbitrumGammaVaults;
    
  return useGammaVaults;
};