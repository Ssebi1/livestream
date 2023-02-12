import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {register, reset} from '../features/auth/authSlice'

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
            console.error(message)
        }

        if(isSuccess || user) {
            navigate('/')
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
            console.error('Passwords do not match')
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
                <div className='title'> Register</div>
                <form onSubmit={onSubmit}>
                    <input type="text" className="form-input" id="name" name="name" value={name} placeholder="Enter your name" onChange={onChange} />
                    <input type="email" className="form-input" id="email" name="email" value={email} placeholder="Enter your email" onChange={onChange} />
                    <input type="password" className="form-input" id="password" name="password" value={password} placeholder="Enter your password" onChange={onChange} />
                    <input type="password" className="form-input" id="passwordConfirm" name="passwordConfirm" value={passwordConfirm} placeholder="Confirm password" onChange={onChange} />
                    <button type="submit" class="button-1">Submit</button>
                </form>
            </section>
        </>
    )
}

export default Register