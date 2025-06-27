import { useState } from "react";

import {
  Progress,
} from 'react-daisyui';

import {
  useLocalThemeModeStore,
} from "../../store/Store";

import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Typography from "../ui/Typography";

const quiz = [
  {
    header: 'Smart Vault Security',
    question: 'Who controls the private keys to your assets in a Smart Vault?',
    answer: 3,
    options: [
      {
        value: 1,
        text: 'TheStandard protocol team'
      },
      {
        value: 2,
        text: 'A third-party custodian'
      },
      {
        value: 3,
        text: 'Only YOU! - through your own wallet'
      },
    ],
    explanation: 'Your assets remain under your control at all times. Unlike centralized platforms, TheStandard team or anyone else never takes custody of your funds. This means you have true financial sovereignty - as long as you keep your wallet\'s seed phrase safe, only you can access your Smart Vault. This is the power of self-custody!'
  },
  {
    header: 'StableCore Feature',
    question: 'How does the automatic debt reduction work?',
    answer: 2,
    options: [
      {
        value: 1,
        text: 'You manually buy USDs when it\'s cheap'
      },
      {
        value: 2,
        text: 'Automatically reduces debt when USDs is below $1 (larger vaults first)'
      },
      {
        value: 3,
        text: 'The protocol randomly selects vaults to help'
      },
    ],
    explanation: 'Your Smart Vault works for you by watching for opportunities when USDs trades below $1. When this happens, it automatically uses a portion of your collateral to pay off your debt at a discount - giving you instant savings! The more you\'ve borrowed, the higher priority you get for these savings opportunities.'
  },
  {
    header: 'Borrowing Benefits',
    question: 'What\'s unique about borrowing with TheStandard?',
    answer: 3,
    options: [
      {
        value: 1,
        text: 'Just the 0% interest rate'
      },
      {
        value: 2,
        text: 'Only the automatic debt reduction'
      },
      {
        value: 3,
        text: 'Everything: 0% loans, yield options, automatic savings, AND ability to swap collateral'
      },
    ],
    explanation: 'TheStandard offers 0% interest loans, optional yield on your collateral, automatic debt reduction opportunities, AND the ability to swap your locked collateral between different assets to capture market opportunities - a combination of features not found anywhere else! You maintain full trading flexibility even while your assets are being used as collateral.'
  },
];

const QuestionsModal = ({
  isOpen,
  handleCloseModal,
  handleQuizComplete,
  createType,
  isPendingUsd,
  isPendingEur,
  isSuccessUsd,
  isSuccessEur,
  setStage,
}) => {
  const [question, setQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState(undefined);

  const { localThemeModeStore } = useLocalThemeModeStore();
  const isLight = localThemeModeStore && localThemeModeStore.includes('light');

  const useLength = quiz.length;

  const useQuestion = question + 1;

  let useProgress = Number((question / useLength) * 100).toFixed(0);

  if (userAnswer && useQuestion === quiz.length) {
    useProgress = '100';
  }

  const answerCorrect = userAnswer === quiz[question].answer;

  const questionOptions = quiz[question].options || [];

  const handleCloseQuiz = () => {
    setUserAnswer(undefined);
    setQuestion(0);
    handleCloseModal();
  }

  return (
    <>
      {/* <Modal
        open={isOpen}
        // open={true}
        closeModal={() => {
          handleCloseQuiz();
        }}
      > */}
        <div className="text-center">
          <Typography variant="h2" className="mb-2">
            Welcome to Your Smart Vault
          </Typography>
          <Typography variant="p" className="">
            Let's make sure you understand all the amazing benefits
          </Typography>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <Typography
              variant="p"
              className="opacity-75"
            >
              Question {useQuestion || ''}/{useLength || ''}
            </Typography>
            <Typography
              variant="p"
              className="opacity-75 text-right"
            >
              {useProgress || ''}
              % Complete
            </Typography>
          </div>
          <div>
            <Progress
              value={useProgress || 0}
              max="100"
            />
          </div>
        </div>

        <div className="bg-base-300/40 p-2 rounded-lg w-full mb-2">
          <div className="mb-2">
            <Typography variant="h2" className="card-title">
              {quiz[question].header || ''}
            </Typography>
            <Typography variant="p" className="">
              {quiz[question].question || ''}
            </Typography>
          </div>

          <div className="flex flex-col gap-2 mb-2">
            {questionOptions?.map((item, index) => {

              const correctAnswer = quiz[question].answer || '';
              const isCorrectAnswer = correctAnswer === item.value;

              if (userAnswer) {
                if (isCorrectAnswer) {
                  return (
                    <Button
                      color="success"
                      className="w-full text-start justify-start pointer-events-none"
                    >
                      {item.text || ''}
                    </Button>
                  );  
                }
  
                if (userAnswer === item.value) {
                  return (
                    <Button
                      color="error"
                      className="w-full text-start justify-start pointer-events-none"
                    >
                      {item.text || ''}
                    </Button>
                  );  
                }

                return (
                  <Button
                    variant="outline"
                    className="w-full text-start justify-start pointer-events-none"
                    disabled
                  >
                    {item.text || ''}
                  </Button>
                );
              }

              return (
                <Button
                  variant="outline"
                  className="w-full text-start justify-start"
                  onClick={() => setUserAnswer(item.value)}
                >
                  {item.text || ''}
                </Button>
              );
            })}
          </div>

          {userAnswer && !answerCorrect ? (
            <div
              className="border-solid border-2 border-red-500 bg-red-300/20 p-2 rounded-lg w-full mb-2"
            >
              <span>
                {quiz[question].explanation || ''}
              </span>
            </div>
          ) : null}

          {userAnswer && answerCorrect ? (
            <div
              className="border-solid border-2 border-green-500 bg-green-300/20 p-2 rounded-lg w-full mb-2"
            >
              <span>
                {quiz[question].explanation || ''}
              </span>
            </div>
          ) : null}
        </div>

        <div className="card-actions flex flex-row justify-end">
          <Button
            color="ghost"
            onClick={() => {
              handleCloseQuiz();
            }}
          >
            Cancel
          </Button>
          {useQuestion === quiz.length ? (
            <Button
              color="primary"
              onClick={() => {
                handleQuizComplete();
              }}
              disabled={!userAnswer || isPendingUsd || isPendingEur }
              loading={isPendingUsd || isPendingEur}  
            >
              Complete Setup
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                setQuestion(question + 1);
                setUserAnswer(undefined);
              }}
              disabled={!userAnswer}
            >
              Next Question
            </Button>
          )}
        </div>
      {/* </Modal> */}
    </>
  )

};

export default QuestionsModal;
