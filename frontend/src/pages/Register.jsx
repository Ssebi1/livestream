import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import {register, reset} from '../features/auth/authSlice'
import { toast } from 'react-toastify';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    })

    const {name, email, password, passwordConfirm} = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

    useEffect(() => {
        if(isError) {
            toast.error(message, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true
            })
        }

        if(isSuccess || user) {
            navigate('/')
            toast.success("Registered succesfully", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true
            })
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if(password !== passwordConfirm) {
            toast.error('Passwords do not match', {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true
            })
        } else {
            const userData = {
                name,
                email,
                password
            }

            dispatch(register(userData))
        }
    }

    return (
        <>
            <section className='form register-form'>
            <div className='title-box'>
                    <div className="title-box-text">Register</div>
                </div>

                <form onSubmit={onSubmit}>
                    <div className='input-1'>
                        <input type="text" className="input-1-field" id="name" name="name" value={name} onChange={onChange} required/>
                        <label className="input-1-label">Username</label>
                    </div>
                    <div className='input-1'>
                        <input type="text" className="input-1-field" id="email" name="email" value={email} onChange={onChange} required/>
                        <label className="input-1-label">Email</label>
                    </div>
                    <div className='input-1'>
                        <input type="password" className="input-1-field" id="password" name="password" value={password} onChange={onChange} required/>
                        <label className="input-1-label">Password</label>
                    </div>
                    <div className='input-1'>
                        <input type="password" className="input-1-field" id="passwordConfirm" name="passwordConfirm" value={passwordConfirm} onChange={onChange} required/>
                        <label className="input-1-label">Confirm password</label>
                    </div>
                    <button type="submit" className="login-submit-button">Submit</button>
                </form>
                <div className='info'>Already having an account? Login <Link to="/login" className="link-1">here</Link></div>
            </section>
        </>
    )
}

export default Register