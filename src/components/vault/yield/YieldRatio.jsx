import {
  Progress,
} from 'react-daisyui';

import Typography from "../../ui/Typography";

const YieldRatio = (props) => {

  let stableRatio = 20;

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

  return (
    <div
      className="w-full flex flex-col"
    >
      <div className="flex flex-1 flex-row justify-between min-h-[25px]">
        <Typography
          variant="p"
        >
          Stable/Volatile Ratio
        </Typography>
        <Typography
          variant="p"
          className="text-right"
        >
        </Typography>
      </div>

      <div className="flex flex-1 flex-row justify-between  min-h-[25px]">
        <Progress
          value={stableRatio}
          max="100"
          color={ratioColor}
          className="h-5 mt-2"
        />
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <Typography
            variant="p"
            className="mt-2"
          >
            {stableRatio}% Stable
          </Typography>
        </div>
        <div className="flex flex-col">
          <Typography
            variant="p"
            className="mt-2"
          >
            {100 - stableRatio}% Volatile
          </Typography>
        </div>
      </div>
    </div>
  )
};

export default YieldRatio;