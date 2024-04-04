import { useEffect, useState} from "react"
import BotCard from "./BotCard";
import { Container, Center, SimpleGrid, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
const BotList = (props: any) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [cookie] = useCookies();
    const [bots, setBots] = useState([]);
    const botList = ()=> {
        let url = '';
        if (props.search === 'mine')
            url = `${import.meta.env.VITE_SERVER_URL}/bots/list?search=${props.search}&user=${cookie['commune_bot_marketplace']['id']}`
        else 
            url = `${import.meta.env.VITE_SERVER_URL}/bots/list?search=${props.search}`;
        axios.get(url).then((response: any)=> {
            const data = response.data;
            if (data.success){
                setBots(data.bots);
                // toast({
                //     title: 'Your bots',
                //     description: "Your bots are loaded.",
                //     status: 'success',
                //     duration: 6000,
                //     isClosable: true,
                // });
            } 
            else {
                // toast({
                //     title: 'Failure',
                //     description: data.msg,
                //     status: 'error',
                //     duration: 6000,
                //     isClosable: true,
                // });
            }
        }).catch((error:Error)=>{
            toast({
                title: 'Failure',
                description: error.message,
                status: 'error',
                duration: 6000,
                isClosable: true,
            });
        });
    }

    useEffect(()=> {
        botList();
    }, []);

    return (
        <Container maxW='full' mb={8} mt={8}>
            {props.search === 'mine' && bots.length == 0 && (
                <>
                    <Text color={'white'}>You haven't any bots.</Text>
                    <Button bg="tomato" color={'white'} onClick={()=>{navigate('/bots/add')}}>Add one!</Button>
                </>
            )}
            {bots.length > 0 && (
                <Center>
                    <SimpleGrid columns={4} spacing={10}>
                        {[...bots].map((bot: any, index: any) => (
                            <BotCard key={index} bot={bot}/>
                        ))}
                    </SimpleGrid>
                </Center>
            )}
            
        </Container>
    )
}

export default BotList