// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import { Container, HStack, Flex, Image, Spacer, Text, Button} from "@chakra-ui/react";
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import discordLogo from '/discord.svg'
import communeLogo from '/logo.svg'
import githubLogo from '/github.svg'
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from "react-cookie"
import { useNavigate } from 'react-router-dom';
import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';

const Header = ()=> {
    const url = `${import.meta.env.VITE_DISCORD_AUTH_URL}`;

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [cookie, setCookie] = useCookies(["commune_bot_marketplace"]);
    const [avatar, setAvatar] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEVMConnected, setIsEVMConnected] = useState(false);

    const domain = window.location.host;
    const origin = window.location.origin;
    const provider = new BrowserProvider(window.ethereum);

    console.log(provider)

    const logout = useCallback(()=>{
        setIsLoggedIn(false);
        setCookie('commune_bot_marketplace', null);
    }, []);

    const createSiweMessage = async(address:any, statement: any)=>{
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/nonce`, {
            credentials: 'include',
        });
        const message = new SiweMessage({
            domain,
            address,
            statement,
            uri: origin,
            version: '1',
            chainId: '1',
            nonce: await res.text()
        });
        return message.prepareMessage();
    }

    const getInformation = async ()=> {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/userInfo`, {
            credentials: 'include',
        });
        console.log(await res.text());
    }

    const connectWallet = useCallback(()=> {
        provider.send('eth_requestAccounts', []).then(async (data)=>{
            console.log(data)
            setIsEVMConnected(true);
            const signer = await provider.getSigner();
            const message = await createSiweMessage(
                await signer.getAddress(),
                'Sign in with Ethereum to Commune Discord Bot Marketplace'
            );
            const signature = await signer.signMessage(message);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/verify`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, signature }),
                credentials: 'include'
            });
            console.log(await res.text());
        }).catch(() => console.log('user rejected request'));
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
                    <Link to='/home'><Text _hover={{color:'tomato'}} color='white'>Home</Text></Link>
                    <Link to='/bots'><Text _hover={{color:'tomato'}} color='white'>Bots</Text></Link>
                    <Link to='/servers'><Text _hover={{color:'tomato'}} color='white'>Servers</Text></Link>
                    <Link to='/emojis'><Text _hover={{color:'tomato'}} color='white'>Emojis</Text></Link>
                    {isLoggedIn && <Link to='/servers/add'><Text _hover={{color:'tomato'}} color='white'>Add Your Server</Text></Link>}
                    {isLoggedIn && <Link to='/bots/add'><Text _hover={{color:'tomato'}} color='white'>Add Your Bot</Text></Link>}
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
                                <Text _hover={{color:'tomato'}} color='white'>Login with Discord</Text>
                            </Link>
                        )
                    }
                    {!isEVMConnected && 
                        <Button _hover={{color:'tomato'}} color='white' variant='link' size='sm' onClick={connectWallet}>Login with Wallet</Button>
                    }
                    {isEVMConnected &&
                        <Button _hover={{color:'tomato'}} color='white' variant='link' size='sm'>Logout</Button>
                    }
                    {/* <ConnectButton label='Login with EVM' showBalance={false} accountStatus="address"/> */}
                </HStack>
            </Flex>
        </Container>
    )
}

export default Header;