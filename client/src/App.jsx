import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundaries from './Components/ErrorBoundaries'
import MainPage from './Pages/MainPage'
function App() {

  return (
    <>
      <ErrorBoundaries>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<MainPage />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundaries>
    </>
  )
}

export default App
