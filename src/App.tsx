import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { RegisterPage } from './pages/register/register';
import { VerifyPage } from './pages/register/verify';
import LoginPage from './pages/login/login';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/home/home';
import Dashboard from './pages/dashboard/dashboard';
import { useEffect } from 'react';
import { useAppDispatch } from './hooks/reduxHooks';
import { fetchAccount } from './store/authSlice';
import DoTestPage from './pages/test/do-test';

function App() {

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchAccount())
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/register/verify' element={<VerifyPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/test/:id/start" element={<DoTestPage />} />

        {/* Protected Routes for Users */}

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
