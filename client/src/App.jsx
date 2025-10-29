import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundaries from './Components/ErrorBoundaries'
import MainPage from './Pages/MainPage'
import Login from './Components/Login'
import Register from './Components/Register'
import ProtectedRoute from './Components/ProtectedRoute'
import PublicRoute from './Components/PublicRoute'
import UserDashboard from './Pages/UserDashboard'
import LandingPage from './Pages/LandingPage'
import DashBoard from './Pages/DashBoardFile/DashBoard'
import Dashboard2 from './Pages/Dashboard2'
// import Test from './Pages/Test.tsx'
function App() {

  return (
    <>
      <ErrorBoundaries>
        <BrowserRouter>
          <Routes>
            <Route path='/Notesio' element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } />
            <Route path='/UserDashboard' element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>} />
            <Route path='/login' element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path='/register' element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
              <Route path='/LandingPage'element={
                <ProtectedRoute>
                  <LandingPage/>
                </ProtectedRoute>
              } />
              <Route path='/Dashboard'element={
                <ProtectedRoute>
                  <DashBoard/>
                </ProtectedRoute>
                
              } />
              <Route path='/Dashboard2'element={
                <ProtectedRoute>
                  <Dashboard2/>
                </ProtectedRoute>
                
              } />
              {/* <Route path='/Test' element={
                <ProtectedRoute>
                  <Test/>
                  </ProtectedRoute>
              }/> */}
              
          </Routes>
        </BrowserRouter>
      </ErrorBoundaries>
    </>
  )
}

export default App
