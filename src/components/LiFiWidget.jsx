import { LiFiWidget as LiFi } from '@lifi/widget';

import {
  useLocalThemeModeStore,
} from "../store/Store";

const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

const LiFiWidget = (props) => {
  const { buyUSDs } = props;

  const { localThemeModeStore } = useLocalThemeModeStore();
  const isLight = localThemeModeStore && localThemeModeStore.includes('light');

  const widgetConfig = {
    buildUrl: true,
    // fromChain,
    // toChain,
    // toToken,
    // fromToken,
    walletConnect: {
      projectId: projectId,
    },
    integrator: 'the-standard',
    appearance: isLight ? 'light' : 'dark',
    theme: {
      container: {
        border: `1px solid rgb(234, 234, 234)`,
        borderRadius: '16px',
      },
    },
    tokens: {
      featured: [
        {
          address: '0xa0b93b9e90ab887e53f9fb8728c009746e989b53',
          symbol: 'TST',
          decimals: 18,
          chainId: 1,
          name: 'The Standard Token',
          logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/22108.png',
        },
        {
          address: '0xe342ebb6a56cd3dbf0fe01a447fe367b9290ecf8',
          symbol: 'TST',
          decimals: 18,
          chainId: 137,
          name: 'The Standard Token',
          logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/22108.png',
        },
        {
          address: '0xf5A27E55C748bCDdBfeA5477CB9Ae924f0f7fd2e',
          symbol: 'TST',
          decimals: 18,
          chainId: 42161,
          name: 'The Standard Token',
          logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/22108.png',
        },
        {
          address: '0x2Ea0bE86990E8Dac0D09e4316Bb92086F304622d',
          symbol: 'USDs',
          decimals: 18,
          chainId: 42161,
          name: 'The Standard USD',
          logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/33452.png',
        },
        {
          address: '0x643b34980e635719c15a2d4ce69571a258f940e9',
          symbol: 'EUROs',
          decimals: 18,
          chainId: 42161,
          name: 'The Standard EURO',
          logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/22588.png',
        },
      ],
    }  
  }

  return (
    <LiFi
      integrator={widgetConfig.integrator}
      config={widgetConfig}
    />
  );
}

export default LiFiWidget;