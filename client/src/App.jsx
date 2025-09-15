import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundaries from './Components/ErrorBoundaries'
import MainPage from './Pages/MainPage'
import Login from './Components/Login'
import Register from './Components/Register'
function App() {

  return (
    <>
      <ErrorBoundaries>
        <BrowserRouter>
          <Routes>
            <Route path='/Notesio' element={<MainPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundaries>
    </>
  )
}

export default App
