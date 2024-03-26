import { Grid, Image, Text, Center, VStack } from "@chakra-ui/react"

const EmojiList = (props: any) => {
    const emojis = props.emojis;
    const wrapText = {
        'overflow': 'hidden',
        'textOverflow': 'ellipsis',
        'whiteSpace': 'nowrap',
        'display': 'block'
    }
    return (
        <Grid templateColumns='repeat(6, 1fr)' gap={12}>
            {emojis.map((emoji: any, index:any)=>(
                <Center w='7rem' h='7rem' boxShadow='base' bg='discord.700' key={index}>
                    <VStack>
                        <Image src={emoji.url} w={50} h={50} objectFit='cover'/>
                        <Text color='white' maxW='5rem' fontSize={12} style={wrapText} >{emoji.usage}</Text>
                    </VStack>
                </Center>
                
            ))}
        </Grid>
    )

}

export default EmojiList