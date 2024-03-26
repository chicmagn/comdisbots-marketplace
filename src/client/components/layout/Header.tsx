import { Link } from 'react-router-dom';
import { Container, HStack, Flex, Image, Spacer, Text} from "@chakra-ui/react";
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import discordLogo from '/discord.svg'
import communeLogo from '/logo.svg'
import githubLogo from '/github.svg'
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from "react-cookie"
import { useNavigate } from 'react-router-dom';

const Header = ()=> {
    const url = `${import.meta.env.VITE_DISCORD_AUTH_URL}`;

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [cookie, setCookie] = useCookies(["commune_bot_marketplace"]);
    const [avatar, setAvatar] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logout = useCallback(()=>{
        setIsLoggedIn(false);
        setCookie('commune_bot_marketplace', null);
    }, []);

    useEffect(()=> {
        let userInfo = null;
        console.log(cookie)
        if (cookie['commune_bot_marketplace']){
            setIsLoggedIn(true);
            userInfo = cookie['commune_bot_marketplace'];
            setUsername(userInfo.username);
            if (userInfo.avatar) {
                const avatarSrc = `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png?size=256`;
                setAvatar(avatarSrc);
            } else {
                const defaultAvatarIndex = Math.abs(Number(userInfo.id) >> 22) % 6;
                setAvatar(`https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`);
            }
        }
    }, [cookie]);

    return (
        <Container className='header' maxW='full' h='5.5rem' bg='discord.700' p='1.5rem' boxShadow='base'>
            <Flex>
                <HStack>
                    <Image src={communeLogo} w='2rem' h='2rem'></Image>
                    <Image src={discordLogo} w='2rem' h='2rem'></Image>
                    <Text fontSize='3xl' color='white'>ComDisBots</Text>
                </HStack>
                <Spacer></Spacer>
                <HStack spacing='1.5rem' >
                    <Link to='/home'><Text color='white'>Home</Text></Link>
                    <Link to='/bots'><Text color='white'>Bots</Text></Link>
                    <Link to='/servers'><Text color='white'>Servers</Text></Link>
                    <Link to='/emojis'><Text color='white'>Emojis</Text></Link>
                    {isLoggedIn && <Link to='/servers/add'><Text color='white'>Add Your Server</Text></Link>}
                    {isLoggedIn && <Link to='/bots/add'><Text color='white'>Add Your Bot</Text></Link>}
                    <Link to='https://github.com/chicmagn/discord-bot-marketplace'><HStack><Image src={githubLogo} w='1rem' h='1rem'/><Text color='white'>Source Code</Text></HStack></Link>
                    {isLoggedIn?
                        (
                            <HStack>
                                <Avatar size={'sm'} src={avatar} />
                                <Menu>
                                    <MenuButton bg={'transparent'} color={'white'}  _hover={{color:'tomato'}}>
                                        <Text>{username}{<ChevronDownIcon/>}</Text>
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={()=> navigate('/bots/mine')}>My Bots</MenuItem>
                                        <MenuItem onClick={()=> navigate('/servers/mine')}>My Servers</MenuItem>
                                        <MenuItem onClick={()=> navigate('/bots/add')}>Submit Bot</MenuItem>
                                        <MenuItem onClick={logout}>Logout</MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        )
                        :
                        (
                            <Link to={url}>
                                <Text color='white'>Login with Discord</Text>
                            </Link>
                        )
                    }
                </HStack>
            </Flex>
        </Container>
    )
}

export default Header;