import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundaries from './Components/ErrorBoundaries'
import MainPage from './Pages/MainPage'
import Login from './Components/Login'
import Register from './Components/Register'
import ProtectedRoute from './Components/ProtectedRoute'
import PublicRoute from './Components/PublicRoute'
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
            <Route path='/login' element={
              <PublicRoute> 
              <Login />
                
                </PublicRoute>
            }/>
            <Route path='/register' element={
              <PublicRoute>
                <Register />
                </PublicRoute>} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundaries>
    </>
  )
}

export default App
