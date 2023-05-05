import {useState, useEffect, useRef} from 'react'
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
    const browserEngineRef = useRef(null)
    const personalEngineRef = useRef(null)
    const personalEngineCredsServerRef = useRef(null)
    const personalEngineCredsKeyRef = useRef(null)

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [createStreamStatus, setCreateStreamStatus] = useState('idle')
    const [engine, setEngine] = useState('browser')

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
    }, [user, isErrorCategories, messageCategories, stream])

    if (isLoadingCategories || isLoadingStreams) {
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
        navigate('/stream/' + stream._id)
        toast.success('Stream created succesfully', {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            hideProgressBar: true,
            toastId: 'createSuccess1'
        })
    }

    const selectEngineOption = (option) => {
        if (option == 'browser') {
            browserEngineRef.current.style.borderColor = "#2d806f"
            personalEngineRef.current.style.borderColor = "transparent"
            personalEngineCredsServerRef.current.style.display = "none"
            personalEngineCredsKeyRef.current.style.display = "none"
        } else {
            browserEngineRef.current.style.borderColor = "transparent"
            personalEngineRef.current.style.borderColor = "#2d806f"
            personalEngineCredsServerRef.current.style.display = "flex"
            personalEngineCredsKeyRef.current.style.display = "flex"
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isLoadingStreams) {
            dispatch(createStream({title, category, engine}))
        }
    }

    return (
        <>
            <section className='form'>
            <div className='title-box'>
                    <div className="title-box-text">Start stream</div>
                </div>
                <form onSubmit={onSubmit}>
                    <div className='input-1'>
                        <input type="text" name="title" id="title" className="input-1-field" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                        <label htmlFor="title" className="input-1-label">Title</label>
                    </div>
                    <div className='input-2'>
                        <label htmlFor="category" className="input-2-label">Category</label>
                        <select name="category" id="category" className='input-select-1' onChange={(e) => setCategory(e.target.value)}>
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
                    </div>
                    <label htmlFor="category" className="input-2-label">Engine</label>
                    <div className="create-stream-options">
                        <div className="create-stream-option" ref={browserEngineRef} onClick={() => {setEngine('browser'); selectEngineOption('browser')}}>
                            <div className="create-stream-options-title">Browser engine</div>
                            <div className="create-stream-options-subtitle">For beginners</div>
                        </div>
                        <div className="create-stream-option" ref={personalEngineRef} onClick={() => {setEngine('personal'); selectEngineOption('personal')}}>
                            <div className="create-stream-options-title">Personal engine</div>
                            <div className="create-stream-options-subtitle">For advanced</div>
                        </div>
                    </div>
                    <div className='input-1 personal-engine-creds' ref={personalEngineCredsServerRef}>
                        <input type="text" name="server" id="server" className="input-1-field input-field-disabled" value={"rtmp://192.168.0.3:1935/live"} disabled/>
                        <label htmlFor="server" className="input-1-label input-label-disabled">Server</label>
                    </div>
                    <div className='input-1 personal-engine-creds' ref={personalEngineCredsKeyRef}>
                        <input type="text" name="stream-key" id="stream-key" className="input-1-field input-field-disabled" value={"63e9005e910af79245cbd188"} disabled/>
                        <label htmlFor="stream-key" className="input-1-label input-label-disabled">Stream key</label>
                    </div>
                    <button type="submit" class="button-1 create-stream-submit-button">Create</button>
                </form>
            </section>
        </>
    )
}

export default CreateStream