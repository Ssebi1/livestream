import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {enableStreamerMode} from '../features/auth/authSlice'
import {createStream} from '../features/streams/streamSlice'

function CreateStream() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)

    const [title, setTitle] = useState('')

    useEffect(() => {
        if(!user || !user.streamerMode) {
            navigate('/')
        }
    }, [user])

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(createStream({title}))
        setTitle('')
    }

    return (
        <>
            <section className='form'>
                <div className='title'> Start stream</div>
                <form onSubmit={onSubmit}>
                    <label htmlFor="text">Title</label>
                    <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <button type="submit" class="button-1">Start</button>
                </form>
            </section>
        </>
    )
}

export default CreateStream