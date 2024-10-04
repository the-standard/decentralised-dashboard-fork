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

import Typography from "./Typography";

const TokenIcon = ({
  symbol,
  style,
  className,
}) => {
  switch (symbol) {
    case 'ETH':
      return (
        <img
          style={style}
          src={ethereumlogo}
          alt="ETH logo"
          className={className ? className : ''}
        />  
      );
    case 'TST':
      return (
        <img
          style={style}
          src={tstlogo}
          alt="TST logo"
          className={className ? className : ''}
        />  
      );
    case 'EUROs':
      return (
        <img
          style={style}
          src={seurologo}
          alt="EUROs logo"
          className={className ? className : ''}
        />  
      );
    case 'WBTC':
      return (
        <img
          style={style}
          src={wbtclogo}
          alt="WBTC logo"
          className={className ? className : ''}
        />  
      );
    case 'LINK':
      return (
        <img
          style={style}
          src={linklogo}
          alt="LINK logo"
          className={className ? className : ''}
        />  
      );
    case 'ARB':
      return (
        <img
          style={style}
          src={arblogo}
          alt="ARB logo"
          className={className ? className : ''}
        />  
      );
    case 'PAXG':
      return (
        <img
          style={style}
          src={paxglogo}
          alt="PAXG logo"
          className={className ? className : ''}
        />  
      );
    case 'GMX':
      return (
        <img
          style={style}
          src={gmxlogo}
          alt="gmx logo"
          className={className ? className : ''}
        />    
      );
    case 'RDNT':
      return (
        <img
          style={style}
          src={rdntlogo}
          alt="rdnt logo"
          className={className ? className : ''}
        />    
      );
    case 'SUSHI':
      return (
        <img
          style={style}
          src={sushilogo}
          alt="sushi logo"
          className={className ? className : ''}
        />    
      );
    case 'USDs':
      return (
        <img
          style={style}
          src={susdlogo}
          alt="USDs logo"
          className={className ? className : ''}
        />    
      );
    case 'USDC':
      return (
        <img
          style={style}
          src={usdclogo}
          alt="USDC logo"
          className={className ? className : ''}
        />    
      );
    case 'WETH':
      return (
        <img
          style={style}
          src={wethlogo}
          alt="WETH logo"
          className={className ? className : ''}
        />    
      );  
    case 'USDs6':
    case 'USDs18':
      return (
        <img
          style={style}
          src={placeholderlogo}
          alt="logo"
          className={className ? className : ''}
        />    
      );
    default:
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