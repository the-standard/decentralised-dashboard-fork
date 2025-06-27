import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Typography from "../ui/Typography";
import CenterLoader from "../ui/CenterLoader";

import QuestionsModal from "./QuestionsModal";

const CreateModal = ({
  isOpen,
  handleCloseModal,
  handleMintVault,
  createType,
  isPendingUsd,
  isPendingEur,
  isSuccessUsd,
  isSuccessEur,
  stage,
  setStage,
  showError,
  tokenId,
}) => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['_stquiz']);

  const quizCooldown = cookies._stquiz !== undefined;

  useEffect(() => {
    if (quizCooldown) {
      if (!isPendingEur || !isPendingUsd) {
        handleMintVault(createType);
      }
    } else {
      setStage('QUIZ');
    }
  }, [quizCooldown, isOpen]);

  const handleSetQuizCooldown = () => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    setCookie('_stquiz', true, { 
      expires,
      path: '/' 
    });
  };

  const handleQuizComplete = () => {
    console.log('handleQuizComplete');
    handleSetQuizCooldown();
    setStage('CREATE');
    if (!isPendingEur || !isPendingUsd) {
      handleMintVault(createType);
    }
  }

  if (showError) {
    return (
      <>
        <Modal
          open={isOpen}
          closeModal={() => {
            handleCloseModal();
          }}
        >
          <div className="text-center">
            <Typography variant="h2" className="mb-2">
              Vault Creation Unsuccessful
            </Typography>

            <Typography variant="p" className="my-2">
              There was a problem processing your vault creation.
            </Typography>
          </div>

          <div className="card-actions flex flex-row justify-end">
            <Button
              color="ghost"
              disabled={isPendingUsd || isPendingEur}
              loading={isPendingUsd || isPendingEur}
              onClick={() => {
                handleCloseModal();
              }}
            >
              Close
            </Button>
          </div>
        </Modal>
      </>
    )
  }

  if (stage === 'CREATE') {
    return (
      <>
        <Modal
          open={isOpen}
          closeModal={() => {
            handleCloseModal();
          }}
        >
          <div className="text-center">
            {isSuccessEur || isSuccessUsd ? (
              <>
                <Typography variant="h2" className="mb-2">
                  {createType} Vault Created
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h2" className="mb-2">
                  Creating {createType} Vault
                </Typography>
              </>
            )}

            {isSuccessEur || isSuccessUsd ? (
              <>
                <Typography variant="p" className="my-2">
                  Your {createType} vault was created successfully!
                </Typography>
                <Typography variant="p" className="mb-2">
                  If you're not automatically redirected to your new vault you can click the button below.
                </Typography>
              </>
            ) : (
              <>
                <CenterLoader />
              </>
            )}
          </div>

          <div className="card-actions flex flex-row justify-end">
            <Button
              color="ghost"
              disabled={isPendingUsd || isPendingEur}
              loading={isPendingUsd || isPendingEur}
              onClick={() => {
                handleCloseModal();
              }}
            >
              Close
            </Button>
            <Button
              color="primary"
              onClick={() => navigate(`/vault/${createType.toString()}/${tokenId.toString()}`)}
              disabled={isPendingUsd || isPendingEur }
              loading={isPendingUsd || isPendingEur}  
            >
              View Vault
            </Button>
          </div>
        </Modal>
      </>
    )
  }

  if (stage === 'QUIZ') {
    return (
      <>
        <Modal
          open={isOpen}
          closeModal={() => {
            handleCloseModal();
          }}
        >
          <QuestionsModal
            handleCloseModal={handleCloseModal}
            // isOpen={questionsOpen}
            handleQuizComplete={handleQuizComplete}
            createType={createType}
            isPendingUsd={isPendingUsd}
            isPendingEur={isPendingEur}
            isSuccessUsd={isSuccessUsd}
            isSuccessEur={isSuccessEur}
            setStage={setStage}
          />
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
        <CenterLoader />
      </Modal>
    </>
  )

};

export default CreateModal;
