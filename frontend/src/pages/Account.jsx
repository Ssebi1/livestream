import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {enableStreamerMode} from '../features/auth/authSlice'

function Account() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

    useEffect(() => {
        if(!user) {
            navigate('/')
        }

        if(isError) {
            console.error(message)
        }

        if(isSuccess) {
            navigate('/account')
        }
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(enableStreamerMode(user))
    }

    return (
        <>
            <section className='form register-form'>
                <div className='title'> Account</div>
                { user && user.streamerMode ?
                    (<div className='subtitle'>Streamer</div>) :
                    (<></>)
                }
                <form onSubmit={onSubmit}>
                    <input className="form-input" placeholder="Enter your name" value={user.name} disabled/>
                    <input className="form-input" placeholder="Enter your email" value={user.email} disabled/>
                    { user && !user.streamerMode ?
                        (<button type="submit" className="button-1">Enable streamer mode</button>) :
                        (<></>)
                    }
                </form>
            </section>
        </>
    )
}

export default Account