import placeholderlogo from "../../assets/circle.svg";
import ethereumlogo from "../../assets/ethereumlogo.svg";
import wbtclogo from "../../assets/wbtclogo.svg";
import linklogo from "../../assets/linklogo.svg";
import paxglogo from "../../assets/paxglogo.svg";
import arblogo from "../../assets/arblogo.svg";
import seurologo from "../../assets/EUROs.svg";
import tstlogo from "../../assets/standardiologoicon.svg";
import gmxlogo from "../../assets/gmxlogo.svg";
import rdntlogo from "../../assets/rdntlogo.svg";
import sushilogo from "../../assets/sushilogo.svg";
import susdlogo from "../../assets/usdslogo.svg";
import usdclogo from "../../assets/usdclogo.svg";
import wethlogo from "../../assets/wethlogo.svg";
import merkllogo from "../../assets/merkllogo.webp";
import usdtlogo from "../../assets/usdtlogo.svg";
import wstethlogo from "../../assets/wstethlogo.svg";

import Typography from "./Typography";

const TokenIcon = ({
  symbol,
  style,
  className,
  isMerkl,
}) => {
  switch (symbol) {
    case 'ETH':
      return (
        <img
          style={style}
          src={ethereumlogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />  
      );
    case 'TST':
      return (
        <img
          style={style}
          src={tstlogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />  
      );
    case 'EUROs':
      return (
        <img
          style={style}
          src={seurologo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />  
      );
    case 'WBTC':
      return (
        <img
          style={style}
          src={wbtclogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />  
      );
    case 'LINK':
      return (
        <img
          style={style}
          src={linklogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />  
      );
    case 'ARB':
      return (
        <img
          style={style}
          src={arblogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />  
      );
    case 'PAXG':
      return (
        <img
          style={style}
          src={paxglogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />  
      );
    case 'GMX':
      return (
        <img
          style={style}
          src={gmxlogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />    
      );
    case 'RDNT':
      return (
        <img
          style={style}
          src={rdntlogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />    
      );
    case 'SUSHI':
      return (
        <img
          style={style}
          src={sushilogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />    
      );
    case 'USDs':
      return (
        <img
          style={style}
          src={susdlogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />    
      );
    case 'USDC':
      return (
        <img
          style={style}
          src={usdclogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />    
      );
    case 'WETH':
      return (
        <img
          style={style}
          src={wethlogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />    
      );  
    case 'USDs6':
    case 'USDs18':
      return (
        <img
          style={style}
          src={placeholderlogo}
          alt={`${symbol} logo`}
          className={className ? className : ''}
        />    
      );
    case 'USDT':
    case 'USD₮0':
      return (
        <img
          style={style}
          src={usdtlogo}
          alt={`USDT logo`}
          className={className ? className : ''}
        />    
      );    
    case 'wstETH':
    case 'wsteth':
    case 'WSTETH':
          return (
          <img
            style={style}
            src={wstethlogo}
            alt={`wstETH logo`}
            className={className ? className : ''}
          />    
        ); 
    default:
      if (isMerkl) {
        return (
          <img
            style={style}
            src={merkllogo}
            alt={`${symbol} logo`}
            className={className ? className : ''}
          />
        )
      }
      return (
        <div
          className={className ? className : ''}
        >
          <Typography variant="p">{symbol}</Typography>
        </div>
      );
  }  
};

export default TokenIcon;