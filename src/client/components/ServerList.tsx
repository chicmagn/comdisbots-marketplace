import { useEffect } from "react"
import ServerCard from "./ServerCard";
import { Container, Center, SimpleGrid } from "@chakra-ui/react";

const ServerList = () => {
    const bots = new Array(8);
    useEffect(()=>{
    }, []);
    return (
        <Container maxW='full' mb={8} mt={8}>
            <Center>
                <SimpleGrid columns={4} spacing={10}>
                    {[...bots].map((_, index) => (
                        <ServerCard key={index}/>
                    ))}
                </SimpleGrid>
            </Center>
            
        </Container>
    )
}

export default ServerList