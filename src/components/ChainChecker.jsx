import React from "react";
import { useLocation } from "react-router-dom";

import {
  useAccount,
  useChainId
} from "wagmi";
import {
  arbitrum,
  arbitrumSepolia
} from "wagmi/chains";


import CenterLoader from "./ui/CenterLoader";
import Card from "./ui/Card";
import Typography from "./ui/Typography";

const ChainChecker = (props) => {
  const { children } = props;
  const { status } = useAccount();
  const chainId = useChainId();
  const location = useLocation();

  const notArb = chainId !== arbitrum?.id && chainId !== arbitrumSepolia?.id;

  if (status !== 'connected') {
    return (
      <main>
        <Card className="card-compact min-w-[50%]">
          <div className="card-body">
            <CenterLoader />
          </div>
        </Card>
      </main>
    );
  }

  if (notArb && !location.pathname.includes('/dex')) {
    return (
      <main>
        <Card className="card-compact min-w-[50%]">
          <div className="card-body">
            <Typography variant="h2" className="card-title justify-between">
              Incorrect Chain
            </Typography>
            <Typography variant="p" className="mb-2">
              This is only available on Arbitrum
            </Typography>
          </div>
        </Card>
      </main>
    );
  }
  
  return (
    <>
      {children}
    </>
  )};

export default ChainChecker;