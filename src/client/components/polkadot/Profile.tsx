import truncateMiddle from "truncate-middle"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import Identicon from "@polkadot/react-identicon"
import { useMemo } from "react"
import { useAzeroID } from "../../common/AzeroIDResolver"
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react"

type Props = {
    account: InjectedAccountWithMeta
    jwtToken: string
    onSignOut: () => void
}

export const PolkadotProfile: React.FC<Props> = ({account, jwtToken, onSignOut})=> {
    const { resolve } = useAzeroID();
    const a0id = useMemo(() => resolve(account.address)?.a0id, [account.address, resolve]);
    return (
        <Button colorScheme="blue" onClick={onSignOut}>
            <HStack>
                <Identicon value={account.address} theme="polkadot" size={32}/>    
                <Text color={'white'}>{truncateMiddle(account.address, 5, 5, "...")}</Text>
            </HStack>
        </Button>
    )
}