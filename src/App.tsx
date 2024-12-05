import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { RegisterPage } from './pages/register/register'
import { VerifyPage } from './pages/register/verify'
import LoginPage from './pages/login/login'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/home/home'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'
import { fetchAccount } from './store/authSlice'
import FullTestSimulation from './pages/do-test/FullTestSimulation'
import TestResult from './pages/do-test/TestResult'
import UnauthorizedAccess from './pages/UnauthoriziedAccess'
import TestsPage from './pages/tests/TestsPage'
import TestDetailsPage from './pages/tests/TestDetailsPage'
import ScrollToTop from './components/ScrollToTop'
import FullTestPractice from './pages/do-test/FullTestPractice'
import AdminDashboard from './pages/admin/dashboard/AdminDashboard'
import AdminTest from './pages/admin/online test/AdminTest'
import AdminAddTest from './pages/admin/online test/AdminAddTest'

function App() {

  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.auth.loading)

  useEffect(() => {
    dispatch(fetchAccount())
  })

  if (loading) {
    return (<h1 className='text-center'>Loading...</h1>)
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path="/unauthorized" element={<UnauthorizedAccess />} />
        <Route path="home" element={<HomePage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/tests/:testIdParam/:testTitle" element={<TestDetailsPage />} />

        {/* <Route element={<ProtectedRoute allowedRoles={[]} redirectIfAuthenticated="/home" />}> */}
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/register/verify' element={<VerifyPage />} />
        <Route path='/login' element={<LoginPage />} />
        {/* </Route> */}

        {/* Protected Routes for Users */}
        {/* <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'USER']} />}> */}
        <Route path="/test/:id/:title/simulation/start" element={<FullTestSimulation />} />
        <Route path="/test/:id/:title/practice/start" element={<FullTestPractice />} />
        <Route path="/test/:testIdParam/results/:resultIdParam" element={<TestResult />} />
        {/* </Route> */}

        {/* Protected Routes for Admin */}
        {/* <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}> */}
        <Route path='/admin' element={<Navigate to='/admin/dashboard' />} />
        <Route path="admin" element={<Outlet />} >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="test" element={<AdminTest />} />
          <Route path="test/add" element={<AdminAddTest />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
