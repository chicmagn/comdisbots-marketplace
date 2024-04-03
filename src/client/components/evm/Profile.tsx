import truncateEthAddress from 'truncate-eth-address';
import Identicon from "@polkadot/react-identicon"
import { useMemo } from "react"
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react"

type Props = {
    account: any
    onSignOut: () => void
}

export const EvmProfile: React.FC<Props> = ({account, onSignOut})=> {
    const evmid = account;
    return (
        <Button colorScheme="blue" onClick={onSignOut}>
            <HStack>
                <Identicon value={account} theme="ethereum" size={32}/>    
                <Text color={'white'}>{truncateEthAddress(account)}</Text>
            </HStack>
        </Button>
    )
}