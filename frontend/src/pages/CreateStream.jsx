import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {enableStreamerMode} from '../features/auth/authSlice'
import {createStream} from '../features/streams/streamSlice'
import { getCategories, reset as resetCategories } from '../features/categories/categorySlice'
import Spinner from '../components/Spinner'

function CreateStream() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)
    const { categories, isErrorCategories, isSuccessCategories, isLoadingCategories, messageCategories } = useSelector((state) => state.categories)

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')

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
            if (category.name == 'general') {
                setCategory(category._id)
            }
        })

        return () => {
            dispatch(resetCategories())
        }

    }, [user, isErrorCategories, messageCategories])

    if (isLoadingCategories) {
        return <Spinner />
    }

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(createStream({title, category}))
        setTitle('')
    }

    const getDropdownOption = (category) => {
        if (category.name == 'GENERAL')
            return "<option key={category.name} value={category.name} selected>{category.name}</option>"
        return "<option key={category.name} value={category.name}>{category.name}</option>"
    }

    return (
        <>
            <section className='form'>
                <div className='title'> Start stream</div>
                <form onSubmit={onSubmit}>
                    <label htmlFor="text">Title</label>
                    <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
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