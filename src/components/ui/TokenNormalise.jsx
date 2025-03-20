const TokenNormalise = (symbol) => {
  switch (symbol) {
    case 'ETH':
      return 'ETH';
    case 'TST':
      return 'TST';
    case 'EUROs':
    case 'EUROS':
    case 'euros':
      return 'EUROs';
    case 'WBTC':
      return 'WBTC';
    case 'LINK':
      return 'LINK';
    case 'ARB':
      return 'ARB';
    case 'PAXG':
      return 'PAXG';
    case 'GMX':
      return 'GMX';
    case 'RDNT':
      return 'RDNT';
    case 'SUSHI':
      return 'SUSHI';
    case 'USDs':
    case 'USDS':
    case 'usds':
      return 'USDs';
    case 'USDC':
      return 'USDC';
    case 'WETH':
      return 'WETH';  
    case 'USDs6':
      return 'USDs6';
    case 'USDs18':
      return 'USDs18';
    case 'USDT':
    case 'USD₮0':
      return 'USDT';    
    default:
      return (symbol);
  }  
};

export default TokenNormalise;