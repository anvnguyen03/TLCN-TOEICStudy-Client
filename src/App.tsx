import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { RegisterPage } from './pages/register/register';
import { VerifyPage } from './pages/register/verify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/register/verify' element={<VerifyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
