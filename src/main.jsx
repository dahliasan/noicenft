import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import '@fontsource/jua'

const theme = extendTheme({
  colors: {
    black: '#011627',
    white: '#fefefe',
    special:
      'linear-gradient(191deg, rgba(63,244,251,1) 0%, rgba(255,42,168,1) 100%);',
  },
  fonts: {
    body: 'jua, sans-serif',
    heading: 'jua, sans-serif',
    mono: 'Menlo, monospace',
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChakraProvider>
  // </React.StrictMode>
)
