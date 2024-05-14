
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

import Typography from "./Typography";

const TokenIcon = ({
  symbol,
  style
}) => {
  switch (symbol) {
    case 'ETH':
      return (
        <img
          style={style}
          src={ethereumlogo}
          alt="ETH logo"
        />  
      );
    case 'TST':
      return (
        <img
          style={style}
          src={tstlogo}
          alt="TST logo"
        />  
      );
    case 'EUROs':
      return (
        <img
          style={style}
          src={seurologo}
          alt="EUROs logo"
        />  
      );
    case 'WBTC':
      return (
        <img
          style={style}
          src={wbtclogo}
          alt="WBTC logo"
        />  
      );
    case 'LINK':
      return (
        <img
          style={style}
          src={linklogo}
          alt="LINK logo"
        />  
      );
    case 'ARB':
      return (
        <img
          style={style}
          src={arblogo}
          alt="ARB logo"
        />  
      );
    case 'PAXG':
      return (
        <img
          style={style}
          src={paxglogo}
          alt="PAXG logo"
        />  
      );
    case 'GMX':
      return (
        <img
          style={style}
          src={gmxlogo}
          alt="gmx logo"
        />    
      );
    case 'RDNT':
      return (
        <img
          style={style}
          src={rdntlogo}
          alt="rdnt logo"
        />    
      );
    case 'SUSHI':
      return (
        <img
          style={style}
          src={sushilogo}
          alt="sushi logo"
        />    
      );  
    default:
      return (
        <div>
          <Typography variant="p">{symbol}</Typography>
        </div>
      );
  }  
};

export default TokenIcon;