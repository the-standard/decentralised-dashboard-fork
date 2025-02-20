import {
  Tooltip,
} from 'react-daisyui';

import {
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

import {
  useSelectedYieldPoolStore,
  useGuestShowcaseStore,
} from "../../../store/Store";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Typography from "../../ui/Typography";
import TokenIcon from "../../ui/TokenIcon";

import YieldPoolChart from "./PoolChart";

const YieldViewModal = ({
  isOpen,
  handleCloseModal,
  openClaim,
  getYieldColor,
  isPositive,
  yieldRange,
  setYieldRange,
  allYieldRanges,
  modalDataObj,
}) => {
  const {
    useShowcase,
  } = useGuestShowcaseStore();

  const {
    selectedYieldPool,
    selectedYieldPoolDataLoading,
  } = useSelectedYieldPoolStore();

  const {
    yieldPair,
    hypervisor,
    hypervisorData,
    hypervisorDataLoading,
    gammaPosition,
    holdA,
    holdB,
    dataPeriod,
    apyTotal,
    showBalance,
  } = modalDataObj;

  const formatTVL = (num) => {
    if (num) {
      const k = num / 1000;
      return `$${k.toFixed(2)}k`;  
    } else {
      return '';
    }
   }
 
   return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          handleCloseModal();
        }}
        closeModal={() => {
          handleCloseModal();
        }}
        wide={false}
      >
        <>
          <div>
            <Typography variant="h2" className="card-title">
              <div className="flex items-center">
                <TokenIcon
                  symbol={yieldPair?.[0] || ''}
                  className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                />
                <TokenIcon
                  symbol={yieldPair?.[1] || ''}
                  className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                />
              </div>

              {yieldPair?.[0] || ''}/{yieldPair?.[1] || ''} Yield Pool
            </Typography>
          </div>
          <div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="bg-base-300/40 p-2 rounded-lg w-full">
                <Typography variant="p" className="opacity-40">
                  TVL
                </Typography>
                {hypervisorDataLoading ? (
                  <>
                    <span className="loading loading-bars loading-md"></span>
                  </>
                ) : (
                  <>
                    <Typography variant="h1" className="font-bold">
                      {formatTVL(hypervisor?.tvlUSD)}
                    </Typography>
                  </>
                )}
              </div>
              <div className="bg-base-300/40 p-2 rounded-lg w-full">
                <Typography variant="p" className="opacity-40">
                Total APY (24h)
                </Typography>
                <Typography variant="h1" className="font-bold">
                  {apyTotal?.toFixed(2)}%
                </Typography>
              </div>
              <div className="bg-base-300/40 p-2 rounded-lg w-full">
                <Typography variant="p" className="opacity-40">
                  Your Balance
                </Typography>
                <Typography variant="h1" className="font-bold flex items-center">
                  {showBalance}
                </Typography>
              </div>
            </div>

            <div className="bg-base-300/40 p-2 rounded-lg w-full mb-2">
            <>
                  <div className="flex justify-end w-full -mb-4 relative z-10">
                    <div className="join">
                      {allYieldRanges.map((item, index) => (
                        <Button
                          key={index}
                          size="sm"
                          className={yieldRange === item.value ? 'join-item btn-primary' : 'join-item'}
                          variant={yieldRange === item.value? '' : 'outline'}
                          active={yieldRange === item.value}
                          onClick={() => setYieldRange(item.value)}
                        >
                          {item.short || ''}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <YieldPoolChart
                    hypervisorData={hypervisorData}
                    yieldPair={yieldPair}
                  />
                </>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-base-300/40 p-2 rounded-lg">
                <Tooltip
                  className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                  position="top"
                  message={`USD return of total fees + liquidity mining rewards accrued for ${dataPeriod}d`}
                >
                  <Typography variant="p" className="opacity-40 text-sm">
                    Position
                    <QuestionMarkCircleIcon
                      className="mb-0.5 ml-0.5 h-3 w-3 inline-block"
                    />
                  </Typography>
                </Tooltip>
                {selectedYieldPoolDataLoading ? (
                  <>
                    <span className="block loading loading-bars loading-xs"></span>
                  </>
                ) : (
                  <>
                    <Typography variant="p" className={`text-sm ${getYieldColor(gammaPosition)}`}>
                      {isPositive(gammaPosition) ? ('+') : null}
                      {Math.abs(gammaPosition) >= 0 ? (`${gammaPosition?.toFixed(3)}%`) : ('')}
                    </Typography>
                  </>
                )}
              </div>
              <div className="bg-base-300/40 p-2 rounded-lg">
                <Tooltip
                  className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                  position="top"
                  message={`USD return of holding 100% of ${yieldPair?.[0]} ${dataPeriod}d ago`}
                >
                  <Typography variant="p" className="opacity-40 text-sm">
                  If Held {yieldPair?.[0]}
                    <QuestionMarkCircleIcon
                      className="mb-0.5 ml-0.5 h-3 w-3 inline-block"
                    />
                  </Typography>
                </Tooltip>
                {selectedYieldPoolDataLoading ? (
                  <>
                    <span className="block loading loading-bars loading-xs"></span>
                  </>
                ) : (
                  <>
                    <Typography variant="p" className={`text-sm ${getYieldColor(holdA)}`}>
                      {isPositive(holdA) ? ('+') : null}
                      {Math.abs(holdA) >= 0 ? (`${holdA?.toFixed(3)}%`) : ('')}
                    </Typography>
                  </>
                )}
              </div>
              <div className="bg-base-300/40 p-2 rounded-lg">
                <Tooltip
                  className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                  position="top"
                  message={`USD return of holding 100% of ${yieldPair?.[1]} ${dataPeriod}d ago`}
                >
                  <Typography variant="p" className="opacity-40 text-sm">
                  If Held {yieldPair?.[1]}
                    <QuestionMarkCircleIcon
                      className="mb-0.5 ml-0.5 h-3 w-3 inline-block"
                    />
                  </Typography>
                </Tooltip>
                {selectedYieldPoolDataLoading ? (
                  <>
                    <span className="block loading loading-bars loading-xs"></span>
                  </>
                ) : (
                  <>
                    <Typography variant="p" className={`text-sm ${getYieldColor(holdB)}`}>
                      {isPositive(holdB) ? ('+') : null}
                      {Math.abs(holdB) >= 0 ? (`${holdB?.toFixed(3)}%`) : ('')}
                    </Typography>
                  </>
                )}
              </div>
            </div>

          </div>

          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-auto"
              variant="outline"
              onClick={handleCloseModal}
            >
              Back
            </Button>
            <Button
              className="w-full lg:w-64"
              variant="outline"
              onClick={() => openClaim(selectedYieldPool, modalDataObj, 'CLAIM')}
              disabled={useShowcase}
            >
              Stop Earning Yield
            </Button>
          </div>
        </>
      </Modal>
    </>
  )
};

export default YieldViewModal;