import truncateMiddle from "truncate-middle"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import Identicon from "@polkadot/react-identicon"
import { useAzeroID } from "../../common/AzeroIDResolver"
import { useMemo, useState } from "react"
import { Box, HStack, Text, VStack } from "@chakra-ui/react"

type Props = {
    onSelect: ()=>void
    account: InjectedAccountWithMeta
    selected: boolean
}

const PolkadotAccount: React.FC<Props> = ({account, selected, onSelect}) => {
    const addressString = account.address;
    const { resolve } = useAzeroID();
    const a0id = useMemo(()=>
        resolve(addressString)?.a0id, [addressString, resolve]
    );

    return (
        <Box onClick={onSelect} p={4} _hover={{bg: 'discord.700'}} bg={selected? 'discord.700' : 'discord.800'}>
            <HStack>
                <Identicon value={account.address} theme="polkadot" size={32}/>    
                <VStack align={'start'} spacing={0}>
                    <Text color={'white'}>{account.meta.name}</Text>
                    <Text color={'white'}>{a0id?? truncateMiddle(account.address, 5, 5, "...")}</Text>
                </VStack>
            </HStack>
        </Box>
    )
}

export default PolkadotAccount;