import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Topbar from './components/Topbar'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Account from './pages/Account.jsx'
import CreateStream from './pages/CreateStream.jsx'
import Stream from './pages/Stream.jsx'
import Profile from './pages/Profile.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './topbar.css'

function App() {
  return (
    <>
      <Router>
        <div className='.root-container'>
          <ToastContainer />
          <Topbar />
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/account' element={<Account/>} />
            <Route path='/create-stream' element={<CreateStream/>} />
            <Route path='/streams/:id' element={<Stream/>} />
            <Route path='/profile/:id' element={<Profile/>} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App;
