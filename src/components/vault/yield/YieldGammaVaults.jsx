import {
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

const ArbitrumVaults = [
  {
    asset: 'ETH',
    pair: ['WETH', 'WBTC'],
  },
  {
    asset: 'WETH',
    pair: ['WETH', 'WBTC'],
  },
  {
    asset: 'WBTC',
    pair: ['WETH', 'WBTC'],
  },
  {
    asset: 'ARB',
    pair: ['ARB', 'WETH'],
  },
  {
    asset: 'LINK',
    pair: ['LINK', 'WETH'],
  },
  {
    asset: 'GMX',
    pair: ['GMX', 'WETH'],
  },
  {
    asset: 'RDNT',
    pair: ['RDNT', 'WETH'],
  },
];

const SepoliaVaults = [
  {
    asset: 'ETH',
    pair: ['WETH', 'WBTC'],
  },
  {
    asset: 'WETH',
    pair: ['WETH', 'WBTC'],
  },
  {
    asset: 'WBTC',
    pair: ['WETH', 'WBTC'],
  },
  {
    asset: 'USDs6',
    pair: ['USDs6', 'WETH'],
  },
  {
    asset: 'USDs18',
    pair: ['USDs18', 'WETH'],
  },
];

const ArbitrumGammaVaults = [
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

const SepoliaGammaVaults = [
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