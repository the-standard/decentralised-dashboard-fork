import { useState, useEffect, useRef } from "react";
import { Box, Modal, Typography } from "@mui/material";
import {
  useWriteContract,
  useChainId,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { formatEther, parseEther } from "viem";
import Lottie from "lottie-react";
import withdrawLottie from "../../../lotties/withdrawal.json";

import {
  useSnackBarStore,
  useStakingPoolv2AddressStore,
  useStakingPoolv2AbiStore
} from "../../../store/Store";

import Button from "../../Button";

interface StakingDecreaseModalProps {
  stakedPositions;
  isOpen: boolean;
  handleCloseModal;
}

const StakingDecreaseModal: React.FC<StakingDecreaseModalProps> = ({
  stakedPositions,
  isOpen,
  handleCloseModal,
}) => {
  const {
    arbitrumSepoliaStakingPoolv2Address,
    arbitrumStakingPoolv2Address,
  } = useStakingPoolv2AddressStore();
  const { stakingPoolv2Abi } = useStakingPoolv2AbiStore();
  const { getSnackBar } = useSnackBarStore();
  const [claimLoading, setClaimLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [tstWithdrawAmount, setTstWithdrawAmount] = useState(0);
  const [eurosWithdrawAmount, setEurosWithdrawAmount] = useState(0);
  const chainId = useChainId();

  const tstInputRef = useRef<HTMLInputElement>(null);
  const eurosInputRef = useRef<HTMLInputElement>(null);

  const tstPosition = stakedPositions?.find((item) => item.asset === 'TST');
  const eurosPosition = stakedPositions?.find((item) => item.asset === 'EUROs');

  const tstStakedAmount = tstPosition?.amount;
  const eurosStakedAmount = eurosPosition?.amount;

  const useTstStakedAmount = formatEther(tstStakedAmount.toString());
  const useEurosStakedAmount = formatEther(eurosStakedAmount.toString());

  const stakingPoolv2Address = chainId === arbitrumSepolia.id ? arbitrumSepoliaStakingPoolv2Address :
  arbitrumStakingPoolv2Address;

  const { writeContract, isError, isPending, isSuccess, error } = useWriteContract();

  const handleApproveWithdraw = async () => {
    try {
      writeContract({
        abi: stakingPoolv2Abi,
        address: stakingPoolv2Address,
        functionName: "decreaseStake",
        args: [
          parseEther(tstWithdrawAmount.toString()),
          parseEther(eurosWithdrawAmount.toString()),
        ],
      });
    } catch (error) {
      let errorMessage = '';
      if (error && error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      getSnackBar('ERROR', errorMessage);
    }
  };

  useEffect(() => {
    if (isPending) {
      setClaimLoading(true);
    } else if (isSuccess) {
      getSnackBar('SUCCESS', 'Success!');
      setClaimLoading(false);
      setTstWithdrawAmount(0);
      setEurosWithdrawAmount(0);
      handleCloseModal();
    } else if (isError) {
      setShowError(true)
      setClaimLoading(false);
      setTstWithdrawAmount(0);
      setEurosWithdrawAmount(0);
    }
  }, [
    isPending,
    isSuccess,
    isError,
    error,
  ]);

  const handleTstAmount = (e) => {
    if (Number(e.target.value) < 10n ** 21n) {
      setTstWithdrawAmount(Number(e.target.value));
    }
  };

  const handleTstInputMax = () => {
    const formatBalance = formatEther(tstStakedAmount);
    tstInputRef.current.value = formatBalance;
    handleTstAmount({target: {value: formatBalance}});
  }

  const handleEurosAmount = (e) => {
    if (Number(e.target.value) < 10n ** 21n) {
      setEurosWithdrawAmount(Number(e.target.value));
    }
  };

  const handleEurosInputMax = () => {
    const formatBalance = formatEther(eurosStakedAmount);
    eurosInputRef.current.value = formatBalance;
    handleEurosAmount({target: {value: formatBalance}});
  }

  if (showError) {
    return (
      <>
        <Modal
          open={isOpen}
          onClose={() => {
            setShowError(false);
            handleCloseModal();
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <>
            <div
              sx={{
                position: { xs: "absolute", md: "" },
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: {
                  xs: "80%",
                  sm: "70%",
                  md: "60%",
                },
                background:
                  "linear-gradient(110.28deg, rgba(26, 26, 26, 0.156) 0.2%, rgba(0, 0, 0, 0.6) 101.11%)",
                borderRadius: "10px",
                padding: "0",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(13.9px)",
                WebkitBackdropFilter: "blur(13.9px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                p: 4,
                maxHeight: {
                  xs: "80vh",
                  sm: "80vh",
                },
                maxWidth: {
                  xs: "640px"
                },
                overflowY: "auto",
              }}
              className="modal-content"
            >
              <div
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {claimLoading ? (
                  <>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      Withdrawing Your Tokens
                    </Typography>
                    <div
                    sx={{
                      margin: "auto",
                      width: "250px",
                      height: "250px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                    >
                      <Lottie animationData={withdrawLottie} />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        marginBottom: "1rem",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          width: "100%",
                          marginBottom: "1rem",
                        }}                
                      >
                        Withraw Unsuccessful
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          width: "100%",
                          opacity: "0.8",
                          marginBottom: "1rem",
                        }}
                      >
                        There was a problem processing your withdraw request.
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          width: "100%",
                          opacity: "0.8",
                          marginBottom: "0.5rem",
                        }}
                      >
                        It is possible that your withdraw request exceeds the amount of tokens you have staked.
                      </Typography>

                    </div>

                    <Button
                      sx={{
                        padding: "5px",
                        height: "2rem",
                      }}
                      clickFunction={() => setShowError(false)}
                      lighter
                    >
                      Return
                    </Button>
                    <Button
                      sx={{
                        padding: "5px",
                        // height: "1rem",
                        marginTop: "1rem",
                      }}
                      clickFunction={() => {
                        setShowError(false);
                        handleCloseModal();
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        </Modal>
      </>
    )
  }

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          handleCloseModal();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <div
            sx={{
              position: { xs: "absolute", md: "" },
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: {
                xs: "80%",
                sm: "70%",
                md: "60%",
              },
              background:
                "linear-gradient(110.28deg, rgba(26, 26, 26, 0.156) 0.2%, rgba(0, 0, 0, 0.6) 101.11%)",
              borderRadius: "10px",
              padding: "0",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(13.9px)",
              WebkitBackdropFilter: "blur(13.9px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              p: 4,
              maxHeight: {
                xs: "80vh",
                sm: "80vh",
              },
              maxWidth: {
                xs: "640px"
              },
              overflowY: "auto",
            }}
            className="modal-content"
          >
            <div
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {claimLoading ? (
                <>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    Withdrawing Your Tokens
                  </Typography>
                  <div
                  sx={{
                    margin: "auto",
                    width: "250px",
                    height: "250px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                  >
                    <Lottie animationData={withdrawLottie} />
                  </div>
                </>
              ) : (
                <>
                  <div
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      marginBottom: "1rem",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.5rem",
                        width: "100%",
                        marginBottom: "0.5rem",
                      }}                
                    >
                      Withdraw Your Tokens
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        width: "100%",
                        opacity: "0.8",
                        marginBottom: "1rem",
                      }}
                    >
                      Here you can reduce your position by withdrawing your tokens.
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        width: "100%",
                        opacity: "0.8",
                      }}
                    >
                      Any withdrawals will automatically claim your existing rewards, ending your current staking period and restarting a new one.
                    </Typography>

                    <div sx={{
                      marginTop: "1rem",
                      width: "100%",
                      height: "2px",
                      backgroundImage: "linear-gradient( to right, transparent, rgba(255, 255, 255, 0.5) 15%, rgba(255, 255, 255, 0.5) 85%, transparent )",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 1px",
                      backgroundPosition: "center bottom",                    
                    }}/>

                  </div>

                  <div
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      width: "100%",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <Typography
                      sx={{
                        whiteSpace: "nowrap",
                        marginRight: "0.5rem",
                        minWidth: "180px",
                      }}
                    >
                      Available TST:
                    </Typography>
                    <Typography
                      sx={{
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {useTstStakedAmount || '0'}
                    </Typography>
                  </div>
                  <div
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      width: "100%",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <Typography
                      sx={{
                        whiteSpace: "nowrap",
                        marginRight: "0.5rem",
                        minWidth: "180px",
                      }}
                    >
                      Available EUROs:
                    </Typography>
                    <Typography
                      sx={{
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {useEurosStakedAmount || '0'}
                    </Typography>
                  </div>

                  <div sx={{
                    marginBottom: "1rem",
                    width: "100%",
                    height: "2px",
                    backgroundImage: "linear-gradient( to right, transparent, rgba(255, 255, 255, 0.5) 15%, rgba(255, 255, 255, 0.5) 85%, transparent )",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 1px",
                    backgroundPosition: "center bottom",                    
                  }}/>

                  <div
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                      flexWrap: {
                        xs: "wrap",
                        sm: "nowrap"
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        whiteSpace: "nowrap",
                        marginRight: "0.5rem",
                        width: {
                          xs: "100%",
                          sm: "auto"
                        },
                        marginBottom: {
                          xs: "1rem",
                          sm: "0px",
                        }
                      }}
                    >
                      Withdraw Amounts:
                    </Typography>
                  </div>
                  <div>
                      <div
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: "1rem",
                        }}
                      >
                        <input
                          style={{
                            background: "rgba(18, 18, 18, 0.5)",
                            border: "1px solid #8E9BAE",
                            color: "white",
                            fontSize: "1rem",
                            fontWeight: "normal",
                            fontFamily: "Poppins",
                            height: "2.5rem",
                            width: "100%",
                            borderRadius: "10px",
                            paddingLeft: "0.5rem",
                            boxSizing: "border-box",
                            MozBoxSizing: "border-box",
                            WebkitBoxSizing: "border-box",
                          }}
                          placeholder="TST Amount"
                          type="number"
                          onChange={handleTstAmount}
                          ref={tstInputRef}
                        />
                        <Button
                          sx={{
                            marginLeft: "0.5rem",
                            padding: "0px 5px",
                            minWidth: "60px",
                            height: "2.5rem",
                            fontSize: "1rem",
                            boxSizing: "border-box",
                            MozBoxSizing: "border-box",
                            WebkitBoxSizing: "border-box",
                          }}
                          clickFunction={() => handleTstInputMax()}
                          >
                          Max
                        </Button>
                      </div>
                      <div
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: "1rem",
                        }}
                      >
                        <input
                          style={{
                            background: "rgba(18, 18, 18, 0.5)",
                            border: "1px solid #8E9BAE",
                            color: "white",
                            fontSize: "1rem",
                            fontWeight: "normal",
                            fontFamily: "Poppins",
                            height: "2.5rem",
                            width: "100%",
                            borderRadius: "10px",
                            paddingLeft: "0.5rem",
                            boxSizing: "border-box",
                            MozBoxSizing: "border-box",
                            WebkitBoxSizing: "border-box",
                          }}
                          placeholder="EUROs Amount"
                          type="number"
                          onChange={handleEurosAmount}
                          ref={eurosInputRef}
                        />
                        <Button
                          sx={{
                            marginLeft: "0.5rem",
                            padding: "5px",
                            minWidth: "60px",
                            height: "2.5em",
                            fontSize: "1rem",
                            boxSizing: "border-box",
                            MozBoxSizing: "border-box",
                            WebkitBoxSizing: "border-box",
                          }}
                          clickFunction={() => handleEurosInputMax()}
                        >
                          Max
                        </Button>
                      </div>
                    </div>
                  <Button
                    sx={{
                      padding: "5px",
                      height: "2rem",
                    }}
                    clickFunction={handleApproveWithdraw}
                    isDisabled={!(tstWithdrawAmount > 0) && !(eurosWithdrawAmount > 0)}
                    lighter
                  >
                    Withdraw
                  </Button>
                  <Button
                    sx={{
                      padding: "5px",
                      // height: "1rem",
                      marginTop: "1rem",
                    }}
                    clickFunction={handleCloseModal}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      </Modal>
    </>
  )
};

export default StakingDecreaseModal;
