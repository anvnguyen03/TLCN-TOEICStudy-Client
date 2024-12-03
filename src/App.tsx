import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { RegisterPage } from './pages/register/register'
import { VerifyPage } from './pages/register/verify'
import LoginPage from './pages/login/login'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/home/home'
import Dashboard from './pages/dashboard/dashboard'
import { useEffect } from 'react'
import { useAppDispatch } from './hooks/reduxHooks'
import { fetchAccount } from './store/authSlice'
import FullTestSimulation from './pages/do-test/FullTestSimulation'
import TestResult from './pages/do-test/TestResult'
import UnauthorizedAccess from './pages/UnauthoriziedAccess'
import TestsPage from './pages/tests/TestsPage'
import TestDetailsPage from './pages/tests/TestDetailsPage'
import ScrollToTop from './components/ScrollToTop'
import FullTestPractice from './pages/do-test/FullTestPractice'

function App() {

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchAccount())
  })

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path="/unauthorized" element={<UnauthorizedAccess />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/register/verify' element={<VerifyPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/tests/:testIdParam/:testTitle" element={<TestDetailsPage />} />

        {/* Protected Routes for Users */}
        <Route path="/test/:id/:title/simulation/start" element={<FullTestSimulation />} />
        <Route path="/test/:id/:title/practice/start" element={<FullTestPractice />} />
        <Route path="/test/:testIdParam/results/:resultIdParam" element={<TestResult />} />

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
