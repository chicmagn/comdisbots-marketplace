import { Button } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
    onAccounts: (accounts: any[]) => void
}

export const EvmConnectButton: React.FC<Props> = ({onAccounts}) => {
    const [connecting, setConnecting] = useState(false);

    const handleConnectWallet = async() => {

        if(!window.ethereum){
            console.log('Wallet not installed')
        }

        setConnecting(true);
        try {

            window.ethereum.request({method: 'eth_requestAccounts'}).then((accounts: any)=>{
                if (accounts) {
                    onAccounts(accounts);
                } else {
                    onAccounts([])
                }
            })
        } catch (e){
            console.log(e)
        } finally {
            setConnecting(false);
        }
    }

    return (
        <Button onClick={handleConnectWallet} disabled={connecting}>
            {connecting? "Connecting...":"Connect EVM"}
        </Button>
    )
}