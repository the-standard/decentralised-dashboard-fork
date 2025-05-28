import Typography from "../ui/Typography";
import Card from "../ui/Card";
import TokenIcon from "../ui/TokenIcon";
import TokenNormalise from "../ui/TokenNormalise";

const USDsStatus = (props) => {
  const {
    usdsUsdcPrice,
    usdsRemainingToTriggerPrice,
    isLoading,
  } = props;

  let usePrice = '';
  let useRemaining = '';

  if (usdsUsdcPrice) {
    usePrice = usdsUsdcPrice;
  }

  if (usdsRemainingToTriggerPrice) {
    useRemaining = Number(usdsRemainingToTriggerPrice).toFixed(8);
  }

  return (
    <Card className="card-compact flex-1 max-w-none md:max-w-[400px]">
      <div className="card-body overflow-x-scroll">
        <div className="flex items-center w-full">
          <TokenIcon
            symbol={TokenNormalise('USDs')}
            className="h-8 w-8 p-1 rounded-full bg-base-300/50"
          />
          <TokenIcon
            symbol={TokenNormalise('USDC')}
            className="h-8 w-8 p-1 rounded-full bg-base-300/50 -ml-[8px]"
          />
          <div className="ml-2 flex justify-between">
            <div>
              <Typography variant="h2" className="card-title flex gap-0">
                USDs/USDC Status
              </Typography>
            </div>
          </div>
        </div>


        <div>
          <div className="bg-base-300/40 p-4 rounded-lg w-full">
            {isLoading ? (
              <Typography variant="h2" className="text-center">
                <span className="loading loading-spinner loading-lg"></span>
              </Typography>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center w-full">
                  <Typography variant="p">
                    Price:
                  </Typography>
                </div>
                <div className="w-full">
                  <Typography
                    variant="h2"
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {usePrice ? (
                      '$' + usePrice
                    ) : (
                      <span className="loading loading-bars loading-md mt-2"></span>
                    )}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-base-300/40 p-4 rounded-lg w-full">
            {isLoading ? (
              <Typography variant="h2" className="text-center">
                <span className="loading loading-spinner loading-lg"></span>
              </Typography>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center w-full">
                  <Typography variant="p">
                    USDs Remaining To Trigger Price:
                  </Typography>
                </div>
                <div className="w-full">
                <Typography
                  variant="h2"
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {useRemaining ? (
                    useRemaining || ''
                  ) : (
                    <span className="loading loading-bars loading-md mt-2"></span>
                  )}
                </Typography>

                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </Card>
  );
};

export default USDsStatus;