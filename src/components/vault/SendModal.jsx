import Modal from "../ui/Modal";
import CenterLoader from "../ui/CenterLoader";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Input from "../ui/Input";

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
          <Typography variant="h2" className="card-title">
            Delete Smart Vault
          </Typography>
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

          <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
            <Button
              className="w-full lg:w-64"
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </div>

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
            <Typography variant="h2" className="card-title">
              {sendType === 'BURN' ? (
                'Deleting Smart Vault'
              ) : (
                'Transferring Smart Vault NFT'
              )}
            </Typography>
            <CenterLoader />
          </>
        ) : (
          <>
            <Typography variant="h2" className="card-title">
              {sendType === 'BURN' ? (
                'Delete Smart Vault'
              ) : (
                'Transfer Smart Vault NFT'
              )}
            </Typography>

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
                <Input
                  className="w-full"
                  placeholder="Send To Address"
                  type="text"
                  onChange={(e) => setSendTo(e.target.value)}
                  value={sendTo || ''}
                  disabled={isPending}
                />
              </>
            ) : (null)}

            <div className="card-actions pt-4 flex-col-reverse lg:flex-row justify-end">
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
            </div>

          </>
        )}
      </Modal>
    </>
  )
};

export default SendModal;