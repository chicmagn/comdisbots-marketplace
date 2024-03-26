import { Text, VStack } from "@chakra-ui/react"
import BotList from "../components/BotList"
const BotMyListPage =()=> {
    return (
        <VStack maxW='full' p='1.5rem' >
            <Text fontSize='4xl' color='white'>My Bots</Text>
            <BotList search='mine'/>
        </VStack>
    )
}

export default BotMyListPage