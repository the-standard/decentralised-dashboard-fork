import { useAccount } from "wagmi";

import DashLayout from "../components/ui/DashLayout";
import Vaults from "./vaults/Vaults";
import Welcome from "./Welcome";

const Home = () => {
  const { address: accountAddress } = useAccount();

  if (accountAddress) {
    return (
      <DashLayout>
        <Vaults />
      </DashLayout>
    )
  }

  return (
    <Welcome />
  );
};

export default Home;