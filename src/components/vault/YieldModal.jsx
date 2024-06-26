import { useEffect, useState } from "react";
import { ethers } from "ethers";

import {
  QueueListIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

import CenterLoader from "../ui/CenterLoader";
import TokenIcon from "../ui/TokenIcon";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Typography from "../ui/Typography";

// TODO TEMP
const yieldPools = [
  {
    assetA: 'ARB',
    assetB: 'LINK',
    APY: '4%',
    TVL: '1234',
  },
  {
    assetA: 'WBTC',
    assetB: 'PAXG',
    APY: '4%',
    TVL: '1234',
  },
  {
    assetA: 'ARB',
    assetB: 'SUSHI',
    APY: '4%',
    TVL: '1234',
  },
  {
    assetA: 'EUROs',
    assetB: 'TST',
    APY: '4%',
    TVL: '1234',
  }
]

const YieldModal = (props) => {
  const {
    open,
    closeModal,
  } = props;
  const [ selectedPool, setSelectedPool ] = useState();
  const [ stableRatio, setStableRatio ] = useState(50);

  // TEMP TODO
  const [ poolsLoading, setPoolsLoading ] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setPoolsLoading(false)
    }, "1000");
  }, []);
  // TEMP TODO

  const allowedRatio = stableRatio >= 10 && stableRatio <= 100;

  let ratioColor = 'success';

  if (stableRatio < 75) {
    ratioColor = 'info'
  }
  if (stableRatio < 50) {
    ratioColor = 'warning'
  }
  if (stableRatio < 25) {
    ratioColor = 'error'
  }


 
  if (selectedPool) {
    return (
      <>
        <Modal
          open={open}
          closeModal={closeModal}
          wide={false}
        >
          <Typography variant="h2" className="card-title">
            <AdjustmentsHorizontalIcon className="mr-2 h-6 w-6 inline-block"/>
            Choose Stable Ratio
          </Typography>

          <Typography
            variant="p"
            className="mb-2"
          >
            Choose how much volatile collateral you want to use to earn a yield, and what percentage you would like in safer, correlated, stable asset yield strategies.
            <br/>
            A minimum of 10% stable is required. 
          </Typography>

  
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <Typography
                variant="p"
                className="mb-2"
              >
                Stable
              </Typography>
              <Typography
                variant="p"
                className="mb-2 text-right"
              >
                Unstable
              </Typography>
            </div>
            <div>
              <input
                type="range"
                min={0}
                max="100"
                value={stableRatio}
                className={`range ${ratioColor ? 'range-' + ratioColor : ''}`}
                onChange={(e) => setStableRatio(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-between">
              <Typography
                variant="p"
                className="mt-2"
              >
                {stableRatio}%
              </Typography>
              <Typography
                variant="p"
                className="mt-2 text-right"
              >
                {100 - stableRatio}%
              </Typography>
            </div>
          </div>
  
          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-auto"
              color="ghost"
              onClick={() => setSelectedPool(null)}
            >
              Back
            </Button>
            <Button
              className="w-full lg:w-64"
              color="success"
              disabled={!allowedRatio}
              onClick={() => setSelectedPool(null)}
            >
              Confirm
            </Button>
          </div>
        </Modal>
      </>
    );  
  }

  return (
    <>
      <Modal
        open={open}
        closeModal={closeModal}
        wide={true}
      >
        <Typography variant="h2" className="card-title">
          <QueueListIcon className="mr-2 h-6 w-6 inline-block"/>
          Choose a Yield Pool
        </Typography>

        <div className="flex flex-col">
          <table className="table">
            <thead>
              <tr>
                <th>Earning Yield</th>
                <th>APY</th>
                <th>TVL</th>
              </tr>
            </thead>
            {poolsLoading ? (null) : (
              <tbody>
                {yieldPools.map(function(pool, index) {
                  return (
                    <>
                      <tr
                        key={index}
                        className="cursor-pointer hover"
                        onClick={() => setSelectedPool(pool)}
                      >
                        <td>
                          <div className="h-full w-full flex flex-col">
                            <div className="flex items-center">
                              <TokenIcon
                                symbol={pool.assetA}
                                className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                              />
                              <TokenIcon
                                symbol={pool.assetB}
                                className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                              />
                            </div>
                            <div className="pt-2 hidden md:table-cell">
                              {pool.assetA}/{pool.assetB}
                            </div>
                          </div>
                        </td>
                        <td>
                          {pool.APY}
                        </td>
                        <td>
                          €{pool.TVL}
                        </td>
                      </tr>
                    </>
                  )}
                )}
              </tbody>
            )}
          </table>
          {poolsLoading ? (
            <CenterLoader />
          ) : (null)}
        </div>

        <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
          <Button
            className="w-full lg:w-64"
            color="ghost"
            onClick={closeModal}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );

};

export default YieldModal;