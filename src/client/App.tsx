import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import { Box } from '@chakra-ui/react'
import Servers from './pages/Servers'
import EmojisPage from './pages/EmojisPage'
import BotDetail from './pages/BotDetailPage'
import BotListPage from './pages/BotListPage'
import CallbackPage from './pages/CallbackPage'
import ServerDetail from './pages/ServerDetailPage'
import BotMyListPage from './pages/BotMyListPage'
import BotAddPage from './pages/BotAddPage'
import SharedStateContext from './common/ShareState.ts'
function App() {
  return (
    <SharedStateContext.Provider value={{curBot: ''}}>
      <Box maxW='10xl' bg='discord.900'>
        <Router>
          <Header />
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='home' element={<Home />} />
            <Route path='bots' element={<BotListPage />}/>
            <Route path='bots/mine' element={<BotMyListPage />}/>
            <Route path='bots/add' element={<BotAddPage />}/>
            <Route path='bots/:botId' element={<BotDetail />} />
            <Route path='servers' element={<Servers />} />
            <Route path='servers/mine' element={<Servers />} />
            <Route path='servers/add' element={<Servers />} />
            <Route path='servers/:serverId' element={<ServerDetail />} />
            <Route path='emojis' element={<EmojisPage />} />
            <Route path='emojis/:emojiTag' element={<EmojisPage />} />
            <Route path='/callback' element={<CallbackPage/>}/>
          </Routes>
          <Footer />
        </Router>
      </Box>
    </SharedStateContext.Provider>
  )
}

export default App
