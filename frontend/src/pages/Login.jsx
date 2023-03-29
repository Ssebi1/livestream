import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import {login, reset} from '../features/auth/authSlice'
import { toast } from 'react-toastify';

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const {name, email, password} = formData
    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        if(isError) {
            toast.error(message, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                toastId: 'loginSuccess',
                hideProgressBar: true
            })
        }

        if(isSuccess || user) {
            toast.success("Logged in succesfully", {
                toastId: 'loginSuccess',
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                toastId: 'loginError',
                hideProgressBar: true
            })
            navigate('/')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password
        }

        dispatch(login(userData))
    }

    return (
        <>
            <section className='form login-form'>
                <div className='title-box'>
                    <div className="title-box-text">Login</div>
                </div>

                <form onSubmit={onSubmit}>
                    <div className='input-1'>
                        <input type="text" className="input-1-field" id="email" name="email" value={email} onChange={onChange} required/>
                        <label className="input-1-label">Email</label>
                    </div>
                    <div className='input-1'>
                        <input type="password" className="input-1-field" id="password" name="password" value={password} onChange={onChange} required/>
                        <label className="input-1-label">Password</label>
                    </div>
                    <button type="submit" className="login-submit-button">Submit</button>
                </form>
                <div className='info'>Not having an account yet? Create one <Link to="/register" className="link">here</Link></div>
            </section>
        </>
    )
}

export default Login