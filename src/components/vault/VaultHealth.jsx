import {
  Progress,
  Tooltip,
} from 'react-daisyui';
import {
  useVaultHealthUpdate,
} from "../../store/Store";

import Typography from "../ui/Typography";

const VaultHealth = ({
  currentVault,
}) => {
  const {
    vaultHealthUpdateType,
    vaultHealthUpdateAmount,
  } = useVaultHealthUpdate();

  const computeProgressBar = (totalDebt, totalCollateralValue) => {
    if (totalCollateralValue === 0n) return 0;
    const safeBigIntWithNoDec = 10000n * totalDebt / totalCollateralValue;
    return parseFloat((Number(safeBigIntWithNoDec) / 100).toFixed(2));
  };

  let topMinted = currentVault.status.minted;
  let bottomMinted = currentVault.status.minted;
  if (vaultHealthUpdateType === 'BORROW') {
    topMinted = currentVault.status.minted;
    bottomMinted = currentVault.status.minted + vaultHealthUpdateAmount;
  }
  if (vaultHealthUpdateType === 'REPAY') {
    topMinted = currentVault.status.minted - vaultHealthUpdateAmount;
    bottomMinted = currentVault.status.minted;
  }

  const topHealth = computeProgressBar(
    topMinted,
    currentVault.status.totalCollateralValue
  );
  const bottomHealth = computeProgressBar(
    bottomMinted,
    currentVault.status.totalCollateralValue
  );

  let tHealthColour = 'success';
  let bHealthColour = 'neutral';
  if (topHealth >= 30) {
    tHealthColour = 'info';
  }
  if (topHealth >= 50) {
    tHealthColour = 'warning';
  }
  if (topHealth >= 75) {
    tHealthColour = 'error';
  }
  if (bottomHealth >= 30) {
    bHealthColour = 'neutral';
  }
  if (bottomHealth >= 50) {
    bHealthColour = 'warning';
  }
  if (bottomHealth >= 75) {
    bHealthColour = 'error';
  }

  let showHealth = topHealth;
  if (topHealth <= 0) {
    showHealth = 0;
  }

  return (
    <div
      className="w-full flex flex-col"
    >
      <div className="flex flex-1 flex-row justify-between min-h-[25px]">
        <Typography
          variant="p"
        >
          Health: {showHealth}%
        </Typography>
        <Typography
          variant="p"
          className="text-right"
        >
          Liquidates at 90.91%
        </Typography>
      </div>

      <div className="flex flex-1 flex-row justify-between  min-h-[25px]">
        <Tooltip
          className="w-full relative flex flex-1 flex-col justify-center items-center"
          position="top"
          message={(showHealth || 0 ) + '%'}
        >
          <Progress
            value={bottomHealth || 0}
            max="100"
            color={bHealthColour || 'primary'}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
          <Progress
            value={topHealth || 0}
            max="100"
            color={tHealthColour || 'primary'}
            className="bg-transparent"
          />
        </Tooltip>
      </div>
    </div>
  )
};

export default VaultHealth;