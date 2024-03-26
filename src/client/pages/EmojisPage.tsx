import {  Flex, Heading, VStack } from "@chakra-ui/react"
import EmojiList from "../components/EmojiList"
import EmojiSidebar from "../components/EmojiSidebar"
import { useParams } from "react-router-dom"
import { emojis } from "../common/mock"

const EmojisPage =()=> {

    const { emojiTag } = useParams();
    const filterEmojis = (emojis: any, tag: any) => {
        if (tag) {
          return emojis.filter((emoji: any) => emoji?.tag.includes(tag));
        }
        return emojis;
    };

    const filteredEmojis = filterEmojis(emojis, emojiTag)

    return (
        <VStack maxW='full' p='1.5rem' >
            <Heading color='white' alignContent='center'>Emojis</Heading>
            <Flex maxW='full' className="emojisPage" mb={8} mt={8}>
                <EmojiSidebar></EmojiSidebar>
                {/* <Divider orientation="vertical" bg='gray'></Divider> */}
                <EmojiList emojis={filteredEmojis}></EmojiList>
            </Flex>
        </VStack>
    )
}

export default EmojisPage