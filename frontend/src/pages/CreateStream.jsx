import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {enableStreamerMode} from '../features/auth/authSlice'
import {createStream, reset as resetStreams} from '../features/streams/streamSlice'
import { getCategories, reset as resetCategories } from '../features/categories/categorySlice'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify';

function CreateStream() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)
    const { categories, isErrorCategories, isSuccessCategories, isLoadingCategories, messageCategories } = useSelector((state) => state.categories)
    const { stream, isErrorStreams, isLoadingStreams, isSuccessStreams, messageStreams } = useSelector((state) => state.streams)

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [createStreamStatus, setCreateStreamStatus] = useState('idle')

    useEffect(() => {
        if(!user || !user.streamerMode) {
            navigate('/')
        }

        if (isErrorCategories) {
            console.log(messageCategories)
            navigate('/')
        }

        dispatch(getCategories())
        categories.map((category) => {
            if (category.name == 'GENERAL') {
                setCategory(category._id)
            }
        })

        return () => {
            dispatch(resetCategories())
            dispatch(resetStreams())
        }
    }, [user, isErrorCategories, messageCategories])

    if (isLoadingCategories) {
        return <Spinner />
    }

    if (isErrorStreams) {
        toast.error(messageStreams, {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            hideProgressBar: true,
            toastId: 'createError1'
        })
    }

    if (isSuccessStreams && stream._id) {
        navigate('/streams/' + stream._id)
        toast.success('Stream created succesfully', {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            hideProgressBar: true,
            toastId: 'createSuccess1'
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isLoadingStreams) {
            await dispatch(createStream({title, category}))
            dispatch(resetStreams())
            setTitle('')
        }
    }

    return (
        <>
            <section className='form'>
                <div className='title'> Start stream</div>
                <form onSubmit={onSubmit}>
                    <label htmlFor="text">Title</label>
                    <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                    <select name="category" id="category" onChange={(e) => setCategory(e.target.value)}>
                        {categories.map((category) => (
                            (() => {
                                if(category.name === 'GENERAL') {
                                        return (
                                            <option key={category.name} value={category._id} selected>{category.name}</option>
                                        )
                                    } else {
                                        return (
                                            <option key={category.name} value={category._id}>{category.name}</option>
                                        )
                                    }
                            })()
                        ))}
                    </select>
                    <button type="submit" class="button-1">Start</button>
                </form>
            </section>
        </>
    )
}

export default CreateStream