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
            <Link to='/'>
                <div className="logo">
                    StreamIT
                    <div className="red-dot"></div>
                </div>
            </Link>
            <ul>
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
                    <Link to='/login'><li className="button-1 login-button">Login</li></Link>
                    <Link to='/register'><li className="button-1 register-button">Register</li></Link>
                </>
            )}
            </ul>
        </div>
    )
}

export default Topbar