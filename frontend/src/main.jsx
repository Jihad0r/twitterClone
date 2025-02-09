import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import {SocketContextProvider} from "../src/hooks/socket/useSocket.jsx"

// Create a client
const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus:true
    }
  }
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <SocketContextProvider>
         <App />
      </SocketContextProvider>
     </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
