import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAccount, useAccountEffect } from "wagmi";

const DisconnectHandler = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDisconnected } = useAccount();

  useAccountEffect({
    onDisconnect() {
      navigate("/");
    },
  })

  useEffect(() => {
    if (
      isDisconnected 
      && location.pathname !== '/'
    ) {
      navigate("/");
    }
  });  

  return (
    <>
      {children}
    </>
  )};

export default DisconnectHandler;