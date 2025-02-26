import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  arbitrumSepolia
} from "wagmi/chains";

import {
  ChevronDownIcon,
} from '@heroicons/react/16/solid';

import Button from "./ui/Button";

const RainbowConnect = (props) => {
  const {
    disconnectedClassName,
  } = props;

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected =
          ready &&
          account &&
          chain;
        return (
          <>
            {!ready ? (
              <Button
                color="ghost"
                variant="outline"
                className={disconnectedClassName + ' min-w-[120px]' || 'min-w-[120px]'}
                disabled
                loading={true}
              >
              </Button>
            ) : (
              <>
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        color="primary"
                        className={disconnectedClassName || ''}
                        onClick={openConnectModal}
                      >
                        Connect Wallet
                      </Button>
                    );
                  }
                  if (chain.unsupported) {
                    return (
                      <Button
                        color="error"
                        className={disconnectedClassName || ''}
                        onClick={openChainModal}
                      >
                        Wrong network
                      </Button>
                    );
                  }
                  return (
                    <div
                      className="flex join"
                    >
                      <Button
                        color="ghost"
                        onClick={openChainModal}
                        className="join-item pr-2"
                        variant="outline"
                      >
                        <div
                          className="flex items-center"
                        >
                          {chain.hasIcon ? (
                            <>
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  className={
                                    chain.id === arbitrumSepolia.id ? (
                                      'h-6 w-6 border-2 rounded-full border-yellow-400'
                                    ) : ('h-6 w-6')
                                  }
                                />
                              )}
                            </>
                          ) : (chain.name)}
                          <ChevronDownIcon className="w-6 h-6"/>
                        </div>
                      </Button>
                      <Button
                        color="ghost"
                        onClick={openAccountModal}
                        className="join-item pr-2"
                        variant="outline"
                      >
                        <div
                          className="flex items-center"
                        >
                          {account.displayName}
                          <ChevronDownIcon className="w-6 h-6"/>
                        </div>
                      </Button>
                    </div>
                  );
                })()}
              </>
            )}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default RainbowConnect;