import { Box, HStack, Heading, VStack, Image, Container, Button, Text, ButtonGroup, useToast, Link } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import SharedStateContext from "../common/ShareState"
import axios from "axios"
const BotDetailPage = () => {
    const sharedBot = useContext(SharedStateContext);
    const [avatar, setAvatar] = useState('');
    const [inviteUrl, setInviteUrl] = useState('');
    const toast = useToast();
    
    const upVote = ()=> {
        axios.post( `${import.meta.env.VITE_SERVER_URL}/bot/upvote`, {botId: sharedBot.curBot.clientID}).then((data: any)=>{
            const success = data.data.success;
            if (success) {
                toast({
                    title: 'Upvoted',
                    description: "We've upvoted the bot.",
                    status: 'success',
                    duration: 6000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Failure',
                    description: "We couldn't upvote the bot.",
                    status: 'error',
                    duration: 6000,
                    isClosable: true,
                });
            }
        });
    }

    useEffect(()=>{
        const bot = sharedBot.curBot;
        setAvatar(`https://cdn.discordapp.com/avatars/${bot.clientID}/${bot.bot.avatar}?size=1024`);
        setInviteUrl(bot.inviteLink);
    }, []);

    return (
        <Box maxW='full' p='1.5rem' >
            <Container maxW={'5xl'}>
                <HStack bg={'discord.800'} p='1.5rem' mb={4} mt={4} spacing={10}>
                    <Image src={avatar} alt='bot' w={150}></Image>
                    <VStack align={'start'}>
                        <HStack><Heading color='white'>{sharedBot.curBot.name}</Heading><Button colorScheme="teal">{sharedBot.curBot.vote}</Button></HStack>
                        <Text color={'white'}>{sharedBot.curBot.shortDesc}</Text>
                    </VStack>
                </HStack>
                <HStack bg={'discord.800'} p='1.5rem' mb={4} mt={4}>
                    <ButtonGroup>
                        
                            <Link href={inviteUrl}>
                            <Button colorScheme="blue">
                            Invite {sharedBot.curBot.name}
                            </Button>
                            </Link>
                            
                        <Button colorScheme="teal" onClick={upVote}>
                            Upvote {sharedBot.curBot.name}
                        </Button>
                    </ButtonGroup>
                </HStack>
                <HStack bg={'discord.800'} p='1.5rem' mb={4} mt={4}>
                    <Text color={'white'}>{sharedBot.curBot.desc}</Text>
                </HStack>
            </Container>
        </Box>
    )
}

export default BotDetailPage