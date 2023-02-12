import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Topbar from './components/Topbar'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Account from './pages/Account.jsx'
import CreateStream from './pages/CreateStream.jsx'

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Topbar />
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/account' element={<Account/>} />
            <Route path='/create-stream' element={<CreateStream/>} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App;
