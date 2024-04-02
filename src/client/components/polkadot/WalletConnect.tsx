import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { web3Enable, web3Accounts } from "@polkadot/extension-dapp";

type Props = {
    onAccounts: (accounts: InjectedAccountWithMeta[]) => void
}

export const PolkadotConnectButton: React.FC<Props> = ({onAccounts}) => {
    const [connecting, setConnecting] = useState(false);

    const handleConnectWallet = async() => {
        setConnecting(true);
        try {
            const extensions = await web3Enable("Sign in with Polkadot Substrate to Commune Discord Bot Marketplace");

            if (extensions.length == 0){
                onAccounts([]);
            } else {
                const accounts = await web3Accounts();
                onAccounts(accounts);
            }
        } catch (e){

        } finally {
            setConnecting(false);
        }
    }

    return (
        <Button onClick={handleConnectWallet} disabled={connecting}>
            {connecting? "Connecting...":"Connect Polkadot"}
        </Button>
    )
}