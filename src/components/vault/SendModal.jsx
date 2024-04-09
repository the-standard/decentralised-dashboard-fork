import {
  Button,
  Card
} from 'react-daisyui';

import Modal from "../ui/Modal.jsx";
import CenterLoader from "../ui/CenterLoader.jsx";
import Typography from "../ui/Typography.jsx";

const SendModal = ({
  isOpen,
  sendType,
  handleCloseModal,
  vaultActive,
  isPending,
  setSendTo,
  sendTo,
  handleSendVault
}) => {

  if (vaultActive && (sendType === 'BURN')) {
    return (
      <>
        <Modal
          open={isOpen}
          closeModal={() => {
            handleCloseModal();
          }}
        >
          <Card.Title tag="h2">
            Delete Smart Vault
          </Card.Title>
          <Typography
            variant="p"
            className="mb-2"
          >
            You still have collateral locked in this vault.
          </Typography>
          <Typography
            variant="p"
          >
            Please pay back any debt and remove collateral before deleting your vault.
          </Typography>

          <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-64"
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </Card.Actions>

        </Modal>
      </>
    )  
  }

  return (
    <>
      <Modal
        open={isOpen}
        closeModal={() => {
          handleCloseModal();
        }}
      >
        {isPending ? (
          <>
            <Card.Title tag="h2">
              {sendType === 'BURN' ? (
                'Deleting Smart Vault'
              ) : (
                'Transferring Smart Vault NFT'
              )}
            </Card.Title>
            <CenterLoader />
          </>
        ) : (
          <>
            <Card.Title tag="h2">
              {sendType === 'BURN' ? (
                'Delete Smart Vault'
              ) : (
                'Transfer Smart Vault NFT'
              )}
            </Card.Title>

            {sendType === 'BURN' ? (
              <>
                <Typography
                  variant="p"
                  className="mb-2"
                >
                  This action sends this smart vault to a burn address.
                </Typography>
                <Typography
                  variant="p"
                  className="mb-2"
                >
                  You will no longer have access to this vault.
                </Typography>
                <Typography
                  variant="p"
                >
                  <b>This action is irreversible.</b>
                </Typography>
              </>
            ) : (null)}

            {sendType === 'SEND' ? (
              <>
                <Typography
                  variant="p"
                  className="mb-2"
                >
                  This action transfers this smart vault, including it's collateral and debt, to a new address.
                </Typography>
                <Typography
                  variant="p"
                  className="mb-2"
                >
                  <b>This action is irreversible.</b>
                </Typography>
                <input
                  className="input input-bordered w-full"
                  placeholder="Send To Address"
                  type="text"
                  onChange={(e) => setSendTo(e.target.value)}
                  value={sendTo || ''}
                  disabled={isPending}
                />
              </>
            ) : (null)}

            <Card.Actions className="pt-4 flex-col-reverse lg:flex-row justify-end">
              <Button
                className="w-full lg:w-auto"
                color="ghost"
                onClick={handleCloseModal}
              >
                Close
              </Button>

              <Button
                className="w-full lg:w-64"
                color={sendType === 'BURN' ? 'error' : 'neutral'}
                onClick={() => handleSendVault()}
                disabled={
                  sendType === 'SEND' &&
                  !sendTo
                }
              >
                {sendType === 'BURN' ? (
                  'Delete My Vault'
                ) : (
                  'Transfer My Vault'
                )}
              </Button>
            </Card.Actions>

          </>
        )}
      </Modal>
    </>
  )
};

export default SendModal;