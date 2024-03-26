import { Box, Code , Heading, VStack, Text, Center, Spacer, Divider, Input, useToast , Textarea, HStack, Button} from "@chakra-ui/react"
import { useCallback, useState, useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const BotAddPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [cookie] = useCookies(["commune_bot_marketplace"]);
    const userInfo = cookie['commune_bot_marketplace'];
    const [botToken, setBotToken] = useState('');
    const [clientID, setClientID] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [desc, setDesc] = useState('');
    const [cmdPrefix, setCmdPrefix] = useState('');
    const [website, setWebsite] = useState('');
    const [inviteLink, setInviteLink] = useState('');
    const [serverInvite, setServerInvite] = useState('');
    // const [tags, setTags] = useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=> {
        let userInfo = null;
        console.log(cookie)
        if (!cookie['commune_bot_marketplace']){
            navigate('/home');
        }
    }, []);

    const handleBotToken = (e: any)=> {
        const v = e.target.value;
        setBotToken(v);
    };

    const handleClientId = (e: any) => {
        const v = e.target.value;
        setClientID(v);
    }

    const handleShortDesc = (e: any) => {
        const v = e.target.value;
        setShortDesc(v);
    }

    const handleDesc = (e: any) => {
        const v = e.target.value;
        setDesc(v);
    }

    const handleCmdPrefix = (e: any) => {
        const v = e.target.value;
        setCmdPrefix(v);
    }

    const handleWebsite = (e: any) => {
        const v = e.target.value;
        setWebsite(v);
    }

    const handleInviteLink = (e: any) => {
        const v = e.target.value;
        setInviteLink(v);
    }

    const handleServerInvite = (e: any) => {
        const v = e.target.value;
        setServerInvite(v);
    }

    // const handleTags = (e: any) => {
    //     const v = e.target.value;
    //     const newTags = [...tags];
    //     newTags.push(v);
    //     setTags(newTags);
    // }

    const submit = useCallback(()=>{
        
        const options = {
            botToken, clientID, shortDesc, desc, cmdPrefix, website, inviteLink, serverInvite,// tags,
        }
        // console.log(options)
        axios.post( `${import.meta.env.VITE_SERVER_URL}/bot/add`, options).then((data: any)=>{
            const success = data.data.success;
            if (success){
                toast({
                    title: 'Bot added',
                    description: "We've added your bot.",
                    status: 'success',
                    duration: 6000,
                    isClosable: true,
                });
                navigate('/bots/mine');
            }
            else {
                toast({
                    title: 'Failure',
                    description: "Failed to add your bot.",
                    status: 'error',
                    duration: 6000,
                    isClosable: true,
                });
            }

        }).catch((error: Error)=>{
            console.log(error)
        })
    }, [botToken, clientID, shortDesc, desc, cmdPrefix, website, inviteLink, serverInvite, userInfo]);

    return (
        <Box maxW='full' p='1.5rem' >
            <Center>
                <VStack align={'start'}>
                    <Heading color='white' mb={8}>Add Bot</Heading>
                    <Text color={'white'}>Thank you for starting to submit your bot to ComDisBots!</Text>
                    <Text color={'white'}>1. You must own the bot or be part owner of the bot</Text>
                    <Text color={'white'}>2. You must not mention any <Code children='NSFW' colorScheme="red"/> features of the bot on this site - This will lead to permanent ban</Text>
                    <Text color={'white'}>3. The bot must not respond to other bots</Text>
                    <Text color={'white'}>4. The bot must have a <Code children='help' colorScheme="teal"/> command - or as an alias to another command</Text>
                    <Text color={'white'}>5. The bot must not be a clone or running a pre-made bot</Text>
                    <Text color={'white'}>6. You must only select tags relevant to your bots features</Text>
                    <Spacer/>
                    <Divider mt={5} mb={5} colorScheme="whatsapp"></Divider>
                    <HStack w={'full'}>
                        <Text color={'red'}>*</Text>
                        <Text w={200} size={'md'} color={'white'}>Bot Token</Text>
                        <Input placeholder='MTIyMTgwODg2MDU4Nzc1MzU0NA.Gx4iG6.WeyXUuXo0ZwGkvZkRElNDWIaZzHrbh-PGH6ZUA' color={'white'} bg={'gray.700'} onChange={handleBotToken}/>
                    </HStack>
                    <Divider mt={5} mb={5}></Divider>
                    <HStack w={'full'}>
                        <Text color={'red'}>*</Text>
                        <Text w={200} size={'md'} color={'white'}>Client ID</Text>
                        <Input placeholder='Client ID: 1221808860587753544' color={'white'} bg={'gray.700'} onChange={handleClientId}/>
                    </HStack>
                    <Divider mt={5} mb={5}></Divider>
                    <HStack w={'full'}>
                        <Text color={'red'}>*</Text>
                        <Text w={200} size={'md'} color={'white'}>Short Description</Text>
                        <Textarea placeholder='Short Description' color={'white'} bg={'gray.700'} onChange={handleShortDesc}/>
                    </HStack>
                    <Divider mt={5} mb={5}></Divider>
                    <HStack w={'full'}>
                        <Text color={'red'}>*</Text>
                        <Text w={200} size={'md'} color={'white'}>Long Description</Text>
                        <Textarea placeholder='## Writing a good long description' color={'white'} bg={'gray.700'} onChange={handleDesc}/>
                    </HStack>
                    <Divider mt={5} mb={5}></Divider>
                    <HStack w={'full'}>
                        <Text color={'red'}>*</Text>
                        <Text w={200} size={'md'} color={'white'}>Command Prefix</Text>
                        <Input placeholder='Command Prefix' color={'white'} bg={'gray.700'} onChange={handleCmdPrefix}/>
                    </HStack>
                    <Divider mt={5} mb={5}></Divider>
                    <HStack w={'full'}>
                        <Text color={'red'}>&nbsp;</Text>
                        <Text w={200} size={'md'} color={'white'}>Website</Text>
                        <Input placeholder='Website (Optional)' color={'white'} bg={'gray.700'} onChange={handleWebsite}/>
                    </HStack>
                    <Divider mt={5} mb={5}></Divider>
                    <HStack w={'full'}>
                        <Text color={'red'}>*</Text>
                        <Text w={200} size={'md'} color={'white'}>Invite Link</Text>
                        <Input placeholder='Invite Link' color={'white'} bg={'gray.700'} onChange={handleInviteLink}/>
                    </HStack>
                    <Divider mt={5} mb={5}></Divider>
                    <HStack w={'full'}>
                        <Text color={'red'}>*</Text>
                        <Text w={200} size={'md'} color={'white'}>Server Invite</Text>
                        <Input placeholder='Server Invite' color={'white'} bg={'gray.700'} onChange={handleServerInvite}/>
                    </HStack>
                    <Divider mt={5} mb={5}></Divider>
                    {/* <HStack w={'full'}>
                        <Text color={'red'}>*</Text>
                        <Text w={170} size={'md'} color={'white'}>Tags</Text>
                        <VStack align={'start'}>
                            <Select placeholder='Select a Tag' size='md' color={'white'} bg={'gray.700'} sx={{'> option': {background: '#2D3748'}}} onChange={handleTags}>
                                <option value='option1'>Option 1</option>
                                <option value='option2'>Option 2</option>
                                <option value='option3'>Option 3</option>
                            </Select>
                            <SimpleGrid columns={8}>
                                {tags.map((tag: any, index: any)=> 
                                    <Tag key={index}>{tag}</Tag>
                                )}
                                
                            </SimpleGrid>
                        </VStack>
                    </HStack>
                    <Divider mt={5} mb={5}></Divider> */}
                    <Button colorScheme="blue" onClick={submit}>Submit</Button>
                </VStack>
            </Center>
        </Box>
    )
}

export default BotAddPage