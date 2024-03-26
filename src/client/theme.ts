import { extendTheme } from '@chakra-ui/react'

const colors = {
    brand: {
        900: '#1a365d',
        800: '#153e75',
        700: '#2a69ac',
    },
    discord: {
        900: '#2b2d31',
        800: '#202225',
        700: '#313338',
        600: '#1e1f22',
        100: '#5865f2',
    }
}

const theme = extendTheme({colors})

export default theme
