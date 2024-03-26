import { Card, CardBody, CardFooter, Image, Text, Stack, ButtonGroup, Button, HStack, Tag, Link, useToast } from '@chakra-ui/react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SharedStateContext from '../common/ShareState';
import axios from 'axios';
const BotCard = (props: any) => {
    const navigate = useNavigate();
    const sharedBot = useContext(SharedStateContext);
    const toast = useToast();
    
    const bot = props.bot;

    const gotoDetail = ()=>{
        sharedBot.curBot = bot;
        navigate(`/bots/${bot.clientID}`);
    }

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

    const boxShadowStyle = {
        boxShadow: '2px 2px 4px 2px #5865f2',
    };

    const coverImage = `https://cdn.discordapp.com/banners/${bot.clientID}/${bot.bot.banner}?size=4096`;
    const avatarImage = `https://cdn.discordapp.com/avatars/${bot.clientID}/${bot.bot.avatar}?size=1024`;

    return (
        <Card maxW='xs' variant='outline' bg='discord.700' boxShadow={boxShadowStyle.boxShadow}>
            <CardBody padding='0px'>
                <Image
                    src={coverImage}
                    alt={bot.name}
                    borderRadius='lg'
                    h='8rem'
                    w='full'
                    objectFit='cover'
                    />
                <Image
                    src={avatarImage}
                    alt={bot.owner.username}
                    borderRadius='full'
                    w='3.5rem'
                    h='3.5rem'
                    position='absolute'
                    top='5rem'
                    left='1rem'
                    />
                <Stack spacing='3' p={3}>
                    <Text fontSize='md' fontWeight='500' color='white'>{bot.name}</Text>
                    <HStack>
                        {[...bot.tags].splice(0, 2).map((item: any, index: any)=> (
                            <Tag key={index} bg='discord.100' color='white'>{item}</Tag>
                        ))}
                    </HStack>
                    <Text color='gray.50' fontSize='sm'>
                        {bot.appDesc}
                    </Text>
                </Stack>
            </CardBody>
            <CardFooter p={1} >
                <ButtonGroup spacing='1'>
                    <Button variant='ghost' colorScheme='blue' size='sm' onClick={gotoDetail}>
                        View
                    </Button>
                    <Button variant='ghost' colorScheme='blue' size='sm'>
                        <Link href={sharedBot.curBot.inviteLink}>Add</Link>
                    </Button>
                    <Button variant='ghost' colorScheme='blue' size='sm' onClick={upVote}>
                        Upvote
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}

export default BotCard