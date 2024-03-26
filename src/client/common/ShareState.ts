import {createContext} from 'react';

interface SharedState {
    curBot: any
}

const SharedStateContext = createContext<SharedState>({
    curBot: null
});

export default SharedStateContext;