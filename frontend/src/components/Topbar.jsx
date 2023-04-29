import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import {AiFillVideoCamera} from 'react-icons/ai'
import { useRef } from 'react'

function Topbar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const downbarRef = useRef(null)
    const accountDropdownRef = useRef(null)

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

    const toggleAccountDropdown = () => {
        let accountDropdown = accountDropdownRef.current
        if (accountDropdown.clientHeight < 0.1) {
            accountDropdown.style.height = 'auto'
        } else {
            accountDropdown.style.height = '0px'
        } 
    }

    const closeTopbar = () => {
        let downbar = downbarRef.current
        downbar.style.height = '0px'
    }

    const closeAccount = () => {
        let accountDropdown = accountDropdownRef.current
        accountDropdown.style.height = '0px'
    }

    return (
        <>
            <div className='topbar'>
                <ul className='left'>
                    <Link to='/' onClick={() => { closeTopbar(); closeAccount() }}><li className="logo">LIVESTREAM</li></Link>
                    <Link to='/' onClick={() => { closeTopbar(); closeAccount() }}><li className="topbar-link">RECENT</li></Link>
                    <Link to='/' onClick={() => { closeTopbar(); closeAccount() }}><li className="topbar-link">POPULAR</li></Link>
                    <Link to='/' onClick={() => { closeTopbar(); closeAccount() }}><li className="topbar-link">PAST STREAMS</li></Link>
                    <Link to='/' onClick={() => { closeTopbar(); closeAccount() }}><li className="topbar-link">CATEGORIES</li></Link>
                </ul>
                {user ? (
                    <>
                        <ul className='right'>
                            <div className='account-link' onClick={() => {closeTopbar(); toggleAccountDropdown()}}>
                                <li className="account">
                                    <div className="username">{user.name}</div>
                                    <div className="icon"><FaUser size={16} /></div>
                                </li>
                                <ul className="account-dropdown" ref={accountDropdownRef}>
                                    <a href="/account" onClick={() => { closeTopbar(); closeAccount() }}>Account</a>
                                    <Link to={{pathname: `/profile/${user._id}`}} onClick={() => { closeTopbar(); closeAccount() }}>Profile</Link>
                                    <li onClick={() => { closeTopbar(); closeAccount(); onLogout() }}>Logout</li>
                                </ul>
                            </div>
                            <Link to="/create-stream" className="button-start-stream" onClick={() => { closeTopbar(); closeAccount() }}><AiFillVideoCamera size={16} /></Link>
                            <li className='hamburger-menu' onClick={() => { toggleTopbar(); closeAccount() }}><GiHamburgerMenu size={25} /></li>
                        </ul>
                    </>
                ) : (
                    <>
                        <ul className='right'>
                            <Link to='/login' onClick={() => { closeTopbar(); closeAccount() }}><li className="login-button">Login</li></Link>
                            <Link to='/register' onClick={() => { closeTopbar(); closeAccount() }}><li className="register-button">Register</li></Link>
                            <li className='hamburger-menu' onClick={() => { toggleTopbar(); closeAccount() }}><GiHamburgerMenu size={25} /></li>
                        </ul>
                    </>
                )}
            </div>
            <div className="topbar-down" ref={downbarRef}>
                <ul className="down-items">
                    <Link to='/' onClick={() => { closeTopbar(); closeAccount() }}><li className="topbar-link">RECENT</li></Link>
                    <Link to='/' onClick={() => { closeTopbar(); closeAccount() }}><li className="topbar-link">POPULAR</li></Link>
                    <Link to='/' onClick={() => { closeTopbar(); closeAccount() }}><li className="topbar-link">PAST STREAMS</li></Link>
                    <Link to='/' onClick={() => { closeTopbar(); closeAccount() }}><li className="topbar-link">CATEGORIES</li></Link>
                    <div className="horizontal-line"></div>
                    {user ? (
                        <>
                            <Link to='/account' onClick={() => { closeTopbar(); closeAccount() }} className="topbar-link">Account</Link>
                            <Link to={{pathname: `/profile/${user._id}`}} onClick={() => { closeTopbar(); closeAccount() }} className="topbar-link">Profile</Link>
                            <div onClick={() => { closeTopbar(); closeAccount(); onLogout() }} className="topbar-link">Logout</div>
                            <Link to="/create-stream" className='start-stream-link topbar-link' onClick={() => { closeTopbar(); closeAccount() }}>Start stream</Link>
                        </>
                    ) : (
                        <>
                            <Link to='/login' onClick={() => { closeTopbar(); closeAccount() }}><li className="login-button">Login</li></Link>
                            <Link to='/register' onClick={() => { closeTopbar(); closeAccount() }}><li className="register-button">Register</li></Link>
                        </>
                    )}
                </ul>
            </div>
        </>
    )
}

export default Topbar