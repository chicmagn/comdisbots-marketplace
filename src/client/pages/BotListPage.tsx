import { Text, VStack } from "@chakra-ui/react"
import BotList from "../components/BotList"
const BotListPage =()=> {
    return (
        <VStack maxW='full' p='1.5rem' >
            <Text fontSize='4xl' color='white'>Top Bots</Text>
            <BotList search='top'/>
        </VStack>
    )
}

export default BotListPage