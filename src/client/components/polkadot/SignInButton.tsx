import { useEffect, useState } from "react"
import { web3FromSource } from "@polkadot/extension-dapp"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import { useAzeroID } from "../../common/AzeroIDResolver"
import { Address, SiwsMessage } from "@talismn/siws"
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
    accounts: InjectedAccountWithMeta[]
    onCancel: () => void
    onSignedIn: (account: InjectedAccountWithMeta, jwtToken: string) => void
}

export const SignIn: React.FC<Props> = ({ accounts, onCancel, onSignedIn }) => {
    // const { dismiss, toast } = useToast()
    const { resolve } = useAzeroID()
    const { isOpen, onOpen, onClose } = useDisclosure()

    // auto select if only 1 account is connected
    const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | undefined>(
        accounts.length === 1 ? accounts[0] : undefined
    )
    const [signingIn, setSigningIn] = useState(false)

    const handleSignIn = async () => {
        try {
            // dismiss()
            if (!selectedAccount) throw new Error("No account selected!")

            const address = Address.fromSs58(selectedAccount.address ?? "")
            if (!address) {
                //   return toast({
                //     title: "Invalid address",
                //     description: "Your address is not a valid Substrate address.",
                //   })
                console.log("Your address is not a valid Substrate address.")
                return;
            }
            setSigningIn(true)
            // request nonce from server
            // const nonceRes = await fetch("/api/nonce")
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/nonce`, {
                credentials: 'include',
            });
            const nonce = await res.text();

            const siwsMessage = new SiwsMessage({
                domain: window.location.host,
                uri: `https://${window.location.host}`,
                address: address.toSs58(0),
                nonce,
                statement: "Welcome to SIWS! Sign in to see how it works.",
                chainName: "Polkadot",
                // expires in 2 mins
                expirationTime: new Date().getTime() + 2 * 60 * 1000,
                azeroId: resolve(address.toSs58())?.a0id,
            })

            const injectedExtension = await web3FromSource(selectedAccount.meta.source)
            const signed = await siwsMessage.sign(injectedExtension)
            const verifyRes = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/verifyPolkadot`, {
                ...signed, address: address.toSs58(0), nonce: nonce
            })
            
            const verified = verifyRes.data
            console.log(verified)
            if (verified.error) throw new Error(verified.error)

            // Hooray we're signed in!
            onSignedIn(selectedAccount, verified.jwtToken)

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
            <Button onClick={onOpen} colorScheme="blue">Sign In with Polkadot</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={'discord.800'}>
                    <ModalHeader color={'white'}>Select your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody p={0}>
                        {accounts.length > 0 ? (
                            accounts.map((account) => (
                                <Account
                                    key={account.address}
                                    account={account}
                                    selected={selectedAccount?.address === account.address}
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
