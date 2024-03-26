import { Box, Link, VStack } from "@chakra-ui/react"
import { emojiCategoryList } from "../common/mock"
import { useNavigate } from "react-router-dom"

const EmojiSidebar = ()=>{
    const navigate = useNavigate()

    const gotoTag = (tag: string)=> {
        navigate(`/emojis/${tag}`)
    }

    return (
        <Box width='sm'>
            <VStack>
            {emojiCategoryList.map((tag: string, index: number)=>
                <Link key={index} color='white' onClick={()=>gotoTag(tag)}>{tag}</Link>
            )}
            </VStack>
        </Box>
    )
}

export default EmojiSidebar