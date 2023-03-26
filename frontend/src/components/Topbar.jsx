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
            <ul className='left'>
                <Link to='/'><li className="logo">LIVESTREAM</li></Link>
                <Link to='/'><li className="topbar-link">RECENT</li></Link>
                <Link to='/'><li className="topbar-link">POPULAR</li></Link>
                <Link to='/'><li className="topbar-link">PAST STREAMS</li></Link>
                <Link to='/'><li className="topbar-link">CATEGORIES</li></Link>
            </ul>
            {user ? (
                <>
                    <ul className='right'>
                        <Link to='/account'>
                            <li className="account">
                                <div className="username">{user.name}</div>
                                <div className="icon"><FaUser size={16}/></div>
                            </li>
                        </Link>
                        <li onClick={onLogout} className="logout-button"><FaSignOutAlt size={16} /></li>
                    </ul>
                </>
            ) : (
                <>
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