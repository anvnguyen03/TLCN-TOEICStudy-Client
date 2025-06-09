import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { RegisterPage } from './pages/register/register'
import { VerifyPage } from './pages/register/verify'
import LoginPage from './pages/login/login'
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
import AdminCategory from './pages/admin/online test/AdminCategory'
import AdminAccount from './pages/admin/user/AdminAccount'
import AdminTestResult from './pages/admin/user/AdminTestResult'
import AddFullTest from './pages/admin/online test/add test/AddFullTest'
import TestHistory from './pages/profile/TestHistory'
import ForgotPassword from './pages/forgot-password/ForgotPassword'
import ResetPassword from './pages/forgot-password/ResetPassword'
import Profile from './pages/profile/Profile'
import Courses from './pages/courses/courses'
import CourseInfo from './pages/courses/CourseInfo'
import PaymentSuccess from './pages/courses/PaymentSuccess'
import PaymentFailed from './pages/courses/PaymentFailed'
import { ProtectedAdminRoute, ProtectedUserRoute, PublicRoute } from './components/ProtectedRoute'
import CourseLearnWrapper from './components/course/CourseLearnWrapper'
import CourseTrialWrapper from './components/course/course trial/CourseTrialWrapper'
import LoadingOverlay from './components/LoadingOverlay'
import MyLearning from './pages/profile/MyLearning'

function App() {

  const dispatch = useAppDispatch()
  const loading = useAppSelector(state => state.auth.loading)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchAccount());
    }
  }, [dispatch])

  if (loading) {
    return (<LoadingOverlay visible={true} />)
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Route  */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/unauthorized" element={<PublicRoute><UnauthorizedAccess /></PublicRoute>} />
        <Route path="/home" element={<PublicRoute><HomePage /></PublicRoute>} />
        <Route path="/tests" element={<PublicRoute><TestsPage /></PublicRoute>} />
        <Route path="/tests/:testIdParam/:testTitle" element={<PublicRoute><TestDetailsPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/register/verify" element={<PublicRoute><VerifyPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/forgot-password/verify" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/courses" element={<PublicRoute><Courses /></PublicRoute>} />
        <Route path="/courses/:id" element={<PublicRoute><CourseInfo /></PublicRoute>} />
        <Route path="/courses/:id/trial" element={<PublicRoute><CourseTrialWrapper /></PublicRoute>} />
        <Route path="/payment-success" element={<PublicRoute><PaymentSuccess /></PublicRoute>} />
        <Route path="/payment-failed" element={<PublicRoute><PaymentFailed /></PublicRoute>} />

        {/* Protected Routes for User */}
        <Route path="/profile" element={<ProtectedUserRoute><Profile /></ProtectedUserRoute>} />
        <Route path="/test-history" element={<ProtectedUserRoute><TestHistory /></ProtectedUserRoute>} />
        <Route path="/my-learning" element={<ProtectedUserRoute><MyLearning /></ProtectedUserRoute>} />
        <Route path="/test/:id/:title/simulation/start" element={<ProtectedUserRoute><FullTestSimulation /></ProtectedUserRoute>} />
        <Route path="/test/:id/:title/practice/start" element={<ProtectedUserRoute><FullTestPractice /></ProtectedUserRoute>} />
        <Route path="/test/:testIdParam/results/:resultIdParam" element={<ProtectedUserRoute><TestResult /></ProtectedUserRoute>} />
        <Route path="/courses/:id/learn" element={<ProtectedUserRoute><CourseLearnWrapper /></ProtectedUserRoute>} />


        {/* Protected Routes for Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="admin/*" element={<ProtectedAdminRoute><Outlet /></ProtectedAdminRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="test-category" element={<AdminCategory />} />
          <Route path="test" element={<AdminTest />} />
          <Route path="test/add" element={<AdminAddTest />} />
          <Route path="test/add/full-test" element={<AddFullTest />} />
          <Route path="user" element={<AdminAccount />} />
          <Route path="user-result" element={<AdminTestResult />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
