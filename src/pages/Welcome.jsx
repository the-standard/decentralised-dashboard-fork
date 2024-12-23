import TSTIconSmallBG from "../assets/TSTIconSmallBG.png";

import Card from "../components/ui/Card";
import Typography from "../components/ui/Typography";
import Button from "../components/ui/Button";

import RainbowConnect from "../components/RainbowConnectButton";

function Welcome(){

  return(
    <div className="min-h-screen bg-base-300 flex items-center justify-center mx-4">
      <Card className="card-compact">
        <div className="card-body">
          <div className="py-4 md:py-20 px-2 md:px-8">
            <div className="flex justify-center content-center mb-3">
              <img src={TSTIconSmallBG} className="w-12 inline-block mask mask-circle mr-4" alt="logo" />
              <Typography variant="h1" className="text-3xl/loose text-center font-bold">
                {import.meta.env.VITE_COMPANY_DAPP_NAME || ''}
              </Typography>
            </div>
            <Typography variant="p" className="font-semibold text-center mb-4">
              To start staking and earning with TST connect your wallet below.
            </Typography>
            <div className="flex justify-center content-center">
              <RainbowConnect />
            </div>
            <div class="divider py-3">OR</div>
            <Typography variant="p" className="text-center mb-4">
              Take a look around the dashboard below.
            </Typography>
            <div className="flex justify-center content-center">
              <Button
                className="w-full lg:w-auto"
                variant="outline"
              >
                View Guest Showcase
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Welcome;