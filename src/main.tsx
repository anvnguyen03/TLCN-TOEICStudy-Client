import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import 'primereact/resources/themes/lara-light-cyan/theme.css';  
import 'primereact/resources/primereact.min.css';          
import 'primeicons/primeicons.css';                       
import 'primeflex/primeflex.css';                          


import { PrimeReactProvider } from 'primereact/api';
import { Provider } from 'react-redux';
import store from './store/store.ts';
        
const value = {
  ripple: true  // enable ripple animation
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PrimeReactProvider value={value}>
          <App />
      </PrimeReactProvider>
    </Provider>
  </StrictMode>,
)
