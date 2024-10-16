import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import 'primereact/resources/themes/lara-light-cyan/theme.css';  
import 'primereact/resources/primereact.min.css';          
import 'primeicons/primeicons.css';                       
import 'primeflex/primeflex.css';                          


import { PrimeReactProvider } from 'primereact/api';
        
const value = {
  ripple: true  // enable ripple animation
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={value}>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
