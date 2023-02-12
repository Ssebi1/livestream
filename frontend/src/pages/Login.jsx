import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {login, reset} from '../features/auth/authSlice'

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
            console.error(message)
        }

        if(isSuccess || user) {
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
                <div className='title'>Login</div>

                <form onSubmit={onSubmit}>
                    <input type="email" className="form-input" id="email" name="email" value={email} placeholder="Enter your email" onChange={onChange} />
                    <input type="password" className="form-input" id="password" name="password" value={password} placeholder="Enter your password" onChange={onChange} />
                    <button type="submit" class="button-1">Submit</button>
                </form>
            </section>
        </>
    )
}

export default Login