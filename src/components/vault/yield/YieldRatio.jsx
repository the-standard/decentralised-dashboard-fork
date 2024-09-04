import {
  Progress,
  Tooltip,
} from 'react-daisyui';

import Typography from "../../ui/Typography";

const YieldRatio = ({
  currentVault,
}) => {

  return (
    <div
      className="w-full flex flex-col"
    >
      <div className="flex flex-1 flex-row justify-between min-h-[25px]">
        <Typography
          variant="p"
        >
          Stable/Volatile Asset Ratio
        </Typography>
        <Typography
          variant="p"
          className="text-right"
        >
          {/* Liquidates at 90.91% */}
        </Typography>
      </div>

      <div className="flex flex-1 flex-row justify-between  min-h-[25px]">
        <Tooltip
          className="w-full relative flex flex-1 flex-col justify-center items-center"
          position="top"
        >
          <Progress
            value={50}
            max="100"
            color={'primary'}
            className="
              h-5 mt-2
              [&::-webkit-progress-value]:bg-primary
              [&::-moz-progress-bar]:bg-primary
            "
            // className="
            //   h-5 mt-2
            //   [&::-webkit-progress-bar]:rounded-lg
            //   [&::-webkit-progress-value]:rounded-lg
            //   [&::-webkit-progress-bar]:bg-[#660eb8]
            //   [&::-webkit-progress-value]:bg-primary
            //   [&::-moz-progress-bar]:bg-primary
            // "
          />
        </Tooltip>

      </div>
    </div>
  )
};

export default YieldRatio;