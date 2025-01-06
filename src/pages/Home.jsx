import { useAccount } from "wagmi";

import {
  useGuestShowcaseStore,
} from "../store/Store";

import DashLayout from "../components/ui/DashLayout";
import Vaults from "./vaults/Vaults";
import Welcome from "./Welcome";

const Home = () => {
  const {
    useShowcase,
    setUseShowcase,
    showcaseWallet,
  } = useGuestShowcaseStore();

  const { address: accountAddress } = useAccount();

  if (accountAddress || useShowcase) {
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