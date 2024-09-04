import { useState } from "react";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Typography from "../../ui/Typography";
import CenterLoader from "../../ui/CenterLoader";

const YieldClaimModal = ({
  isOpen,
  handleCloseModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          handleCloseModal();
        }}
      >
        <>
          {isLoading ? (
            <>
              <Typography variant="h2" className="card-title">
                Claiming Your Yield
              </Typography>
              <CenterLoader />
            </>
          ) : (
            <>
              <div>
                <Typography variant="h2" className="card-title">
                  Claim Your Yields
                </Typography>
                <Typography variant="p" className="mb-2">
                  Claiming your yields will withdraw <b>all</b> of the assets in this pair.
                </Typography>
              </div>
              <Button
                color="primary"
                onClick={handleCloseModal}
              >
                Claim All Yields
              </Button>
              <Button
                color="ghost"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </>
          )}
        </>
      </Modal>
    </>
  )
};

export default YieldClaimModal;