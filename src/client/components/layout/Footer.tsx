import { SimpleGrid, VStack, Text, Box } from "@chakra-ui/react"
const Footer = () => {
    return (
        <Box className='footer' maxW='full' bg='discord.600'  p={10}>
            <SimpleGrid columns={4}>
                <VStack>
                    <Text size='xl' color='white'>Resources</Text>
                    <Text size='md' color={'white'}>API</Text>
                    <Text size='md' color={'white'}>Privacy Policy</Text>
                    <Text size='md' color={'white'}>Cookie Policy</Text>
                    <Text size='md' color={'white'}>Terms and Conditions</Text>
                    <Text size='md' color={'white'}>Manage Cookies</Text>
                    <Text size='md' color={'white'}>Official Discord Server</Text>
                    <Text size='md' color={'white'}>Contact Us</Text>
                    <Text size='md' color={'white'}>Advertise</Text>
                </VStack>
                <VStack>
                    <Text size='xl' color='white'>Community</Text>
                    
                </VStack>
                <VStack>
                    <Text size='xl' color='white'>Tags</Text>
                    <Text size='md' color={'white'}>Discord Music Bots</Text>
                    <Text size='md' color={'white'}>Discord Verification Bots</Text>
                    <Text size='md' color={'white'}>Discord Crypto Bots</Text>
                    <Text size='md' color={'white'}>Discord Moderation Bots</Text>
                    <Text size='md' color={'white'}>Discord Levelling Bots</Text>
                </VStack>
                <VStack>
                    <Text size='xl' color='white'>Contact</Text>
                    <Text size='md' color={'white'}>mag_nate (discord)</Text>
                </VStack>
            </SimpleGrid>
        </Box>
    )

}

export default Footer