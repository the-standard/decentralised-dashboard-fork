import TSTIconSmallBG from "../assets/TSTIconSmallBG.png";

import Typography from "../components/ui/Typography";

function Welcome(){

  return(
    <div className="min-h-screen bg-base-300 flex items-center">
      <div className="card mx-auto w-full max-w-xl shadow-xl">
        <div className="bg-base-100 rounded-xl">
          <div className="py-24 px-10">
            <div className="flex justify-center content-center mb-3">
              <img src={TSTIconSmallBG} className="w-12 inline-block mask mask-circle mr-4" alt="logo" />
              <Typography variant="p" className="text-3xl/loose text-center font-bold">
                {import.meta.env.VITE_COMPANY_DAPP_NAME || ''}
              </Typography>
            </div>
            <Typography variant="p" className="font-semibold text-center mb-8">
              To start staking and earning with TST connect your wallet below.
            </Typography>
            <div className="flex justify-center content-center">
              <w3m-button />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome;