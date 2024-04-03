import { useEffect, useState } from "react"
import { SiweMessage } from 'siwe';
import { BrowserProvider } from 'ethers';
import Account from "./Account"
import {
    Box, Button, useDisclosure,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    ButtonGroup,
} from '@chakra-ui/react'
import axios from "axios";

type Props = {
    accounts: any[]
    onCancel: () => void
    onSignedIn: (account: any) => void
}

export const EvmSignIn: React.FC<Props> = ({ accounts, onCancel, onSignedIn }) => {
    // const { dismiss, toast } = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const domain = window.location.host;
    const origin = window.location.origin;
    const evmProvider = new BrowserProvider(window.ethereum);
    // auto select if only 1 account is connected
    const [selectedAccount, setSelectedAccount] = useState<any | undefined>(
        accounts.length === 1 ? accounts[0] : undefined
    )
    const [signingIn, setSigningIn] = useState(false)

    const createSiweMessage = async (address: any, statement: any) => {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/nonce`, {
            credentials: 'include',
        });
        const message = new SiweMessage({
            domain,
            address,
            statement,
            uri: origin,
            version: '1',
            chainId: 1,
            nonce: await res.text()
        });
        return message.prepareMessage();
    }

    const getInformation = async () => {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/userInfo`, {
            credentials: 'include',
        });
        console.log(await res.text());
    }

    const handleSignIn = async () => {
        try {
            // dismiss()
            if (!selectedAccount) throw new Error("No account selected!")
            const address = selectedAccount;
            if (!address) {
                //   return toast({
                //     title: "Invalid address",
                //     description: "Your address is not a valid Substrate address.",
                //   })
                console.log("Your address is not a valid EVM address.")
                return;
            }
            setSigningIn(true);
            const signer = await evmProvider.getSigner();
            const message = await createSiweMessage(
                await signer.getAddress(),
                'Sign in with Ethereum to Commune Discord Bot Marketplace'
            );
            const signature = await signer.signMessage(message);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/verifyEVM`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, signature }),
                credentials: 'include'
            });

            // Hooray we're signed in!
            onSignedIn(selectedAccount)

            onClose();
        } catch (e: any) {
            console.log(e)
            // toast({
            //   title: "Uh oh! Couldn't sign in.",
            //   description: e?.message ?? "An error occurred",
            //   variant: "destructive",
            //   action: (
            //     <ToastAction altText="Try Again" onClick={handleSignIn}>
            //       Try Again
            //     </ToastAction>
            //   ),
            // })
        } finally {
            setSigningIn(false)
        }
    }

    // dismiss toast when sign in flow is exited
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // () => dismiss()
    }, [])

    

    return (
        <Box>
            <Button onClick={onOpen} colorScheme="blue">Sign In with EVM</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={'discord.800'}>
                    <ModalHeader color={'white'}>Select your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody p={0}>
                        {accounts.length > 0 ? (
                            accounts.map((account) => (
                                <Account
                                    key={account}
                                    account={account}
                                    selected={selectedAccount === account}
                                    onSelect={() => {
                                        // dismiss()
                                        setSelectedAccount(account);
                                    }}
                                />
                            ))
                        ) : (
                            <Text color={'white'}>
                                Connect at least 1 account to sign in with.
                            </Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup>
                            <Button colorScheme="blue" disabled={!selectedAccount || signingIn} onClick={handleSignIn}>
                                {signingIn ? "Signing In..." : "Sign In"}
                            </Button>
                            <Button colorScheme="blue" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        </ButtonGroup>
                        
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}
