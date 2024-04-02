import { Link } from 'react-router-dom';
import { Container, HStack, Flex, Image, Spacer, Text, Button } from "@chakra-ui/react";
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import discordLogo from '/discord.svg'
import communeLogo from '/logo.svg'
import githubLogo from '/github.svg'
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from "react-cookie"
import { useNavigate } from 'react-router-dom';
import { SiweMessage } from 'siwe';
import truncateEthAddress from 'truncate-eth-address';
import { web3Accounts, web3Enable, web3FromAddress, web3FromSource, web3AccountsSubscribe } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { PolkadotConnectButton } from '../polkadot/WalletConnect';
import { Profile } from '../polkadot/Profile';
import { SignIn } from '../polkadot/SignInButton';

const Header = () => {
    const url = `${import.meta.env.VITE_DISCORD_AUTH_URL}`;

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [cookie, setCookie] = useCookies(["commune_bot_marketplace"]);
    const [avatar, setAvatar] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [isEVMConnected, setIsEVMConnected] = useState(false);
    const [evmAddress, setEvmAddress] = useState('');

    // Polkadot.js
    const [polkadotSignedInWith, setPolkadotSignedInWith] = useState<InjectedAccountWithMeta | undefined>()
    const [polkadotAccounts, setPolkadotAccounts] = useState<InjectedAccountWithMeta[] | undefined>()
    const [jwtToken, setJwtToken] = useState<string | undefined>()
    const [subscribedPW, setSubscribedPW] = useState(false)
    
    const handlePolkadotSignedIn = (selectedAccount: InjectedAccountWithMeta, jwtToken: string) => {
        setJwtToken(jwtToken)
        setPolkadotSignedInWith(selectedAccount)
    }

    const handlePolkadotSignOut = useCallback(() => {
        setPolkadotSignedInWith(undefined)
        setJwtToken(undefined)
    }, [])

    const onPolkadotAccounts = useCallback((accounts: InjectedAccountWithMeta[])=> {
        setPolkadotAccounts(accounts);
    }, []);

    // subscribe to extension changes after first connect
    const subscribeToExtensions = useCallback(async () => {
        if (polkadotAccounts === undefined || subscribedPW) return
        setSubscribedPW(true)
        web3AccountsSubscribe((newAccounts) => {
            // dont update if newAccounts is same as accounts
            const newAddresses = newAccounts.map((account) => account.address).join("")
            const oldAddresses = polkadotAccounts.map((account) => account.address).join("")
            if (newAddresses === oldAddresses) return

            // update accounts list
            setPolkadotAccounts(newAccounts)
        })
    }, [polkadotAccounts, subscribedPW]);

    useEffect(() => {
        subscribeToExtensions()
    }, [subscribeToExtensions])

    // auto sign out disconnected extensions
    useEffect(() => {
        if (polkadotSignedInWith?.address && polkadotAccounts && !polkadotAccounts.find((account) => account.address === polkadotSignedInWith?.address))
            handlePolkadotSignOut()
    }, [polkadotAccounts, handlePolkadotSignOut, polkadotSignedInWith?.address])

    // EVM

    // Discord
    const logoutDiscord = useCallback(() => {
        setIsLoggedIn(false);
        setCookie('commune_bot_marketplace', null);
    }, []);

    useEffect(() => {
        let userInfo = null;
        if (cookie['commune_bot_marketplace']) {
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
                    <Link to='/home'><Text _hover={{ color: 'tomato' }} color='white'>Home</Text></Link>
                    <Link to='/bots'><Text _hover={{ color: 'tomato' }} color='white'>Bots</Text></Link>
                    <Link to='/servers'><Text _hover={{ color: 'tomato' }} color='white'>Servers</Text></Link>
                    <Link to='/emojis'><Text _hover={{ color: 'tomato' }} color='white'>Emojis</Text></Link>
                    <Link to='https://github.com/chicmagn/discord-bot-marketplace'><HStack><Image src={githubLogo} w='1rem' h='1rem' /><Text color='white'>Source Code</Text></HStack></Link>
                    {isLoggedIn ?
                        (
                            <HStack>
                                <Avatar size={'sm'} src={avatar} />
                                <Menu>
                                    <MenuButton bg={'transparent'} color={'white'} _hover={{ color: 'tomato' }}>
                                        <Text>{username}{<ChevronDownIcon />}</Text>
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={() => navigate('/bots/mine')}>My Bots</MenuItem>
                                        <MenuItem onClick={() => navigate('/servers/mine')}>My Servers</MenuItem>
                                        <MenuItem onClick={() => navigate('/bots/add')}>Submit Bot</MenuItem>
                                        <MenuItem onClick={() => navigate('/servers/add')}>Add Server</MenuItem>
                                        <MenuItem onClick={logoutDiscord}>Logout</MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        )
                        :
                        (
                            <Link to={url}>
                                <Text _hover={{ color: 'tomato' }} color='white'>Login with Discord</Text>
                            </Link>
                        )
                    }
                    {polkadotSignedInWith && !!jwtToken ? 
                        (
                            <Profile account={polkadotSignedInWith} jwtToken={jwtToken} onSignOut={handlePolkadotSignOut}/>
                        ): polkadotAccounts? (
                            <SignIn
                                accounts={polkadotAccounts}
                                onCancel={() => setPolkadotAccounts(undefined)}
                                onSignedIn={handlePolkadotSignedIn}/>
                        ) : (
                            <PolkadotConnectButton onAccounts={onPolkadotAccounts}/>
                        )
                    }
                    {/* {!isEVMConnected &&
                        <Button _hover={{ color: 'tomato' }} color='white' variant='link' size='sm' onClick={connectEVMWallet}>EVM Login</Button>
                    }
                    {isEVMConnected &&
                        <Text _hover={{ color: 'tomato' }} color='white'>{truncateEthAddress(evmAddress)}</Text>
                    }
                    {!isPolkadotConnected &&
                        <Button _hover={{ color: 'tomato' }} color='white' variant='link' size='sm' onClick={connectPolkaWallet}>Polkadot Login</Button>
                    }
                    {isPolkadotConnected &&
                        <Text _hover={{ color: 'tomato' }} color='white'>{polakdotAddress}</Text>
                    } */}
                    <ConnectButton label='EVM Connect' showBalance={false}/>
                </HStack>
            </Flex>
        </Container>
    )
}

export default Header;