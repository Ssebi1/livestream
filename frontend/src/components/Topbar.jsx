import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useRef } from 'react'

function Topbar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const downbarRef = useRef(null)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    const toggleTopbar = () => {
        let downbar = downbarRef.current
        if (downbar.clientHeight < 0.1) {
            downbar.style.height = 'auto'
        } else {
            downbar.style.height = '0px'
        }
    }

    const closeTopbar = () => {
        let downbar = downbarRef.current
        downbar.style.height = '0px'
    }

    return (
        <>
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
                            <Link to='/account' className='account-link' onClick={closeTopbar}>
                                <li className="account">
                                    <div className="username">{user.name}</div>
                                    <div className="icon"><FaUser size={16} /></div>
                                </li>
                            </Link>
                            <li className="logout-button" onClick={() => { closeTopbar(); onLogout() }}><FaSignOutAlt size={16} /></li>
                            <li className='hamburger-menu' onClick={toggleTopbar}><GiHamburgerMenu size={25} /></li>
                        </ul>
                    </>
                ) : (
                    <>
                        <ul className='right'>
                            <Link to='/login' onClick={closeTopbar}><li className="login-button">Login</li></Link>
                            <Link to='/register' onClick={closeTopbar}><li className="register-button">Register</li></Link>
                            <li className='hamburger-menu' onClick={toggleTopbar}><GiHamburgerMenu size={25} /></li>
                        </ul>
                    </>
                )}
            </div>
            <div className="topbar-down" ref={downbarRef}>
                <ul className="down-items">
                    <Link to='/' onClick={closeTopbar}><li className="topbar-link">RECENT</li></Link>
                    <Link to='/' onClick={closeTopbar}><li className="topbar-link">POPULAR</li></Link>
                    <Link to='/' onClick={closeTopbar}><li className="topbar-link">PAST STREAMS</li></Link>
                    <Link to='/' onClick={closeTopbar}><li className="topbar-link">CATEGORIES</li></Link>
                    {user ? (
                        <>
                            <Link to='/account' onClick={closeTopbar}>
                                <li className="account">
                                    <div className="icon"><FaUser size={16} /></div>
                                    <div className="username">{user.name}</div>
                                </li>
                            </Link>
                            <li onClick={() => { closeTopbar(); onLogout() }} className="logout-button">Logout</li>
                        </>
                    ) : (
                        <>
                            <Link to='/login' onClick={closeTopbar}><li className="login-button">Login</li></Link>
                            <Link to='/register' onClick={closeTopbar}><li className="register-button">Register</li></Link>
                        </>
                    )}
                </ul>
            </div>
        </>
    )
}

export default Topbar