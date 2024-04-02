import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  getDefaultWallets
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
    appName: 'Commune Discord Bot Marketplace',
    projectId: 'YOUR_PROJECT_ID',
    wallets: wallets,
    chains: [
        mainnet
    ]
});

const queryClient = new QueryClient();

export default function Web3Provider({children} : { children: React.ReactNode}){
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}