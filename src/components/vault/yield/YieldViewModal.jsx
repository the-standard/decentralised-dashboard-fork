import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Typography from "../../ui/Typography";
import TokenIcon from "../../ui/TokenIcon";

import {
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

import {
  Tooltip,
} from 'react-daisyui';


const YieldViewModal = ({
  isOpen,
  handleCloseModal,
  yieldPair,
  yieldQuantities,
  yieldHypervisor,
  gammaUser,
  gammaReturns,
  gammaStats,
  openClaim,
  gammaUserLoading,
  gammaReturnsLoading,
  gammaStatsLoading,
}) => {

  const positionUser = gammaUser?.[yieldHypervisor.toLowerCase()] || {};
  const positionStats = gammaStats?.find(item => item.hypervisor.toLowerCase() === yieldHypervisor.toLowerCase());
  const positionReturns = gammaReturns?.find((item) => item.hypervisor.toLowerCase() === yieldHypervisor.toLowerCase());

  const initialUSD = positionUser?.returns?.initialTokenUSD || 0;
  const initialTokenCurrentUSD = positionUser?.returns?.initialTokenCurrentUSD || 0;
  const currentUSD = positionUser?.returns?.currentUSD || 0;
  const hypervisorReturnsUSD = positionUser?.returns?.hypervisorReturnsUSD;
  const hypervisorReturnsPercentage = positionUser?.returns?.hypervisorReturnsPercentage;
  const netMarketReturnsUSD = positionUser?.returns?.netMarketReturnsUSD;
  const netMarketReturnsPercentage = positionUser?.returns?.netMarketReturnsPercentage;
  const tvlUSD = Number(positionStats?.tvlUSD) || 0;
  const showApy = Number(positionReturns?.feeApy * 100).toFixed(2);

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
                  symbol={yieldPair[0] || ''}
                  className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                />
                <TokenIcon
                  symbol={yieldPair[1] || ''}
                  className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
                />
              </div>

              {yieldPair[0] || ''}/{yieldPair[1] || ''} Yield Pool
            </Typography>
          </div>
          <div className="mb-2">
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <Typography variant="p">
                  TVL
                </Typography>
                <Typography variant="h2">
                {gammaStatsLoading ? (
                  <>
                    <span class="loading loading-bars loading-xs"></span>
                  </>
                ) : (
                  <>
                    ${tvlUSD?.toFixed(2) || ''}
                  </>
                )}
                </Typography>
              </div>
              <div className="flex-1">
                <Typography variant="p">
                  APY
                </Typography>
                <Typography variant="h2">
                {gammaReturnsLoading ? (
                  <>
                    <span class="loading loading-bars loading-xs"></span>
                  </>
                ) : (
                  <>
                    {showApy || ''}%
                  </>
                )}
                </Typography>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex flex-row gap-4 mb-4">
              <div className="flex-1">
                <Typography variant="p">
                  Principle at Deposit
                </Typography>
                <Typography variant="h2">
                  {gammaUserLoading ? (
                    <>
                      <span class="loading loading-bars loading-xs"></span>
                    </>
                  ) : (
                    <>
                      ${initialUSD?.toFixed(2) || ''}
                    </>
                  )}
                </Typography>
              </div>
              <div className="flex-1">
                <Typography variant="p">
                  Principle Currently
                </Typography>
                <Typography variant="h2">
                  {gammaUserLoading ? (
                    <>
                      <span class="loading loading-bars loading-xs"></span>
                    </>
                  ) : (
                    <>
                      ${initialTokenCurrentUSD?.toFixed(2) || ''}
                    </>
                  )}
                </Typography>
              </div>
            </div>
            <div className="flex flex-row gap-4 mb-4">
              <div className="flex-1">
                <Typography variant="p">
                  Total Yield
                </Typography>
                <Typography variant="h2">
                  {gammaUserLoading ? (
                    <>
                      <span class="loading loading-bars loading-xs"></span>
                    </>
                  ) : (
                    <>
                      {hypervisorReturnsUSD ? (
                        <>
                          {hypervisorReturnsUSD < 0 ? (
                            '-$'
                          ) : (
                            '$'
                          )}
                          {
                            Math.abs(
                              hypervisorReturnsUSD
                            )?.toFixed(2) || ''
                          }
                        </>
                      ) : (
                        ''
                      )}
                      <Typography variant="p" className="inline-block text-xs">
                      &nbsp; {hypervisorReturnsPercentage}
                      </Typography>
                    </>
                  )}
                </Typography>
              </div>
              <div className="flex-1">
                <Typography variant="p">
                  Total Yield (Market)
                  <Tooltip
                    className="flex-col justify-center items-center cursor-pointer before:w-[12rem]"
                    position="left"
                    message={'Your total yield earned, including market changes since your deposit.'}
                  >
                    <QuestionMarkCircleIcon
                      className="mb-1 ml-1 h-5 w-5 inline-block opacity-60"
                    />
                  </Tooltip>
                </Typography>
                <Typography variant="h2">
                  {gammaUserLoading ? (
                    <>
                      <span class="loading loading-bars loading-xs"></span>
                    </>
                  ) : (
                    <>
                      {netMarketReturnsUSD ? (
                        <>
                          {netMarketReturnsUSD < 0 ? (
                            '-$'
                          ) : (
                            '$'
                          )}
                          {
                            Math.abs(
                              netMarketReturnsUSD
                            )?.toFixed(2) || ''
                          }
                        </>
                      ) : (
                        ''
                      )}
                      <Typography variant="p" className="inline-block text-xs">
                      &nbsp; {netMarketReturnsPercentage}
                      </Typography>
                    </>
                  )}
                </Typography>
              </div>

            </div>
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <Typography variant="p">
                  Net Value
                </Typography>
                <Typography variant="h2">
                  {gammaUserLoading ? (
                    <>
                      <span class="loading loading-bars loading-xs"></span>
                    </>
                  ) : (
                    <>
                    ${currentUSD?.toFixed(2) || ''}
                    </>
                  )}
                </Typography>
              </div>
              <div className="flex-1">
              </div>
            </div>
            <div className="mt-4">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th className="pl-0">Token</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                  <tbody>
                    <tr>
                      <td className="pl-0">
                        <div className="h-full w-full flex flex-row">
                          <div className="flex items-center">
                            <TokenIcon
                              symbol={yieldPair[0]}
                              className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                            />
                          </div>
                          <div className="pl-2 pt-2 table-cell">
                            {yieldPair[0]}
                          </div>
                        </div>
                      </td>
                      <td>
                        {yieldQuantities[0]}<br/>
                      </td>
                    </tr>
                    <tr>
                      <td className="pl-0">
                        <div className="h-full w-full flex flex-row">
                          <div className="flex items-center">
                            <TokenIcon
                              symbol={yieldPair[1]}
                              className="h-8 w-8 p-1 rounded-full bg-base-300/50"
                            />
                          </div>
                          <div className="pl-2 pt-2 table-cell">
                            {yieldPair[1]}
                          </div>
                        </div>
                      </td>
                      <td>
                        {yieldQuantities[1]}
                      </td>
                    </tr>
                  </tbody>
              </table>
            </div>

          </div>

          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-auto"
              variant="outline"
              onClick={handleCloseModal}
            >
              Return to Vault
            </Button>
            <Button
              className="w-full lg:w-64"
              color="error"
              onClick={() => openClaim()}
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