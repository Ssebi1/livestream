import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {logout, reset} from '../features/auth/authSlice'
import {FaUser, FaSignOutAlt} from 'react-icons/fa'

function Topbar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <div className='topbar'>
            
            {user ? (
                <>
                    <li>
                        <Link to='/account'><li classname="acount-button"><FaUser size={20} /></li></Link>
                    </li>
                    <li>
                        <div onClick={onLogout} className="logout-button"><FaSignOutAlt size={20} /></div>
                    </li>
                </>
            ) : (
                <>
                <ul className='left'>
                    <Link to='/'><li className="logo">LIVESTREAM</li></Link>
                    <Link to='/'><li className="topbar-link">RECENT</li></Link>
                    <Link to='/'><li className="topbar-link">POPULAR</li></Link>
                    <Link to='/'><li className="topbar-link">PAST STREAMS</li></Link>
                    <Link to='/'><li className="topbar-link">CATEGORIES</li></Link>
                </ul>
                <ul className='right'>
                    <Link to='/login'><li className="login-button">Login</li></Link>
                    <Link to='/register'><li className="register-button">Register</li></Link>
                </ul>
                </>
            )}
        </div>
    )
}

export default Topbar