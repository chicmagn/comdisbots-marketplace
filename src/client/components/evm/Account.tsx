import truncateEthAddress from 'truncate-eth-address';
import Identicon from "@polkadot/react-identicon"
import { useMemo, useState } from "react"
import { Box, HStack, Text, VStack } from "@chakra-ui/react"

type Props = {
    onSelect: ()=>void
    account: any
    selected: boolean
}

const EvmAccount: React.FC<Props> = ({account, selected, onSelect}) => {
    const addressString = account;
    console.log(addressString)

    return (
        <Box onClick={onSelect} p={4} _hover={{bg: 'discord.700'}} bg={selected? 'discord.700' : 'discord.800'}>
            <HStack>
                <Identicon value={account} theme="ethereum" size={32}/>    
                <VStack align={'start'} spacing={0}>
                    {/* <Text color={'white'}>{account.meta.name}</Text> */}
                    <Text color={'white'}>{addressString?? truncateEthAddress(account)}</Text>
                </VStack>
            </HStack>
        </Box>
    )
}

export default EvmAccount;