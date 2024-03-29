import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import Following from './pages/Following'
import Streamers from './pages/Streamers'
import Categories from './pages/Categories'
import Streams from './pages/Streams'

function App() {
  return (
    <>
      <Router>
        <div className='.root-container'>
          <ToastContainer />
          <Topbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/streams/:category' element={<Streams />} />
            <Route path='/streams' element={<Streams />} />
            <Route path='/following' element={<Following />} />
            <Route path='/streamers' element={<Streamers />} />
            <Route path='/categories' element={<Categories />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/account' element={<Account />} />
            <Route path='/create-stream' element={<CreateStream />} />
            <Route path='/stream/:id' element={<Stream />} />
            <Route path='/profile/:id' element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App;
