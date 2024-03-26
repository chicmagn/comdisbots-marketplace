import { Card, CardBody, CardFooter, Image, Text, Stack, ButtonGroup, Button, Flex, Tag, Spacer } from '@chakra-ui/react'
const ServerCard = () => {
    const boxShadowStyle = {
        boxShadow: '2px 2px 4px 2px #5865f2',
      };
    return (
        <Card maxW='xs' variant='outline' bg='discord.700' boxShadow={boxShadowStyle.boxShadow}>
            <CardBody padding='0px'>
                <Image
                    src='https://dbl-static.usercontent.prism.gg/a6d5c73fde1e3532031815dfd2031fc1.png'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    h='8rem'
                    w='full'
                    objectFit='cover'
                    />
                <Image
                    src='https://cdn.discordapp.com/avatars/872465937687777291/48093b086051d24fb4b6a4354a7524fc.webp'
                    alt='Green double couch with wooden legs'
                    borderRadius='full'
                    w='3.5rem'
                    h='3.5rem'
                    position='absolute'
                    top='5rem'
                    left='1rem'
                    />
                <Stack spacing='3' p={3}>
                    <Flex direction='row'><Text fontSize='md' fontWeight='500' color='white'>AI Image Generator</Text><Spacer/><Tag bg='discord.100'>Music</Tag></Flex>
                    <Text color='gray.50' fontSize='sm'>
                        This sofa is perfect for modern tropical spaces, baroque inspired
                        spaces, earthy toned spaces and for people who love a chic design with a
                        sprinkle of vintage design.
                    </Text>
                </Stack>
            </CardBody>
            <CardFooter p={1} >
                <ButtonGroup spacing='1'>
                    <Button variant='ghost' colorScheme='blue' size='sm'>
                        View
                    </Button>
                    <Button variant='ghost' colorScheme='blue' size='sm'>
                        Add
                    </Button>
                    <Button variant='ghost' colorScheme='blue' size='sm'>
                        Upvote
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
        
    )
}

export default ServerCard