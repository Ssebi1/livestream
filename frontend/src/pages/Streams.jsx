import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStreams, reset } from '../features/streams/streamSlice'
import { getStreamers, reset as resetStreamers } from '../features/streamers/streamerSlice'
import { getCategories, reset as resetCategories } from '../features/categories/categorySlice'
import StreamItem from '../components/StreamItem'
import StreamerItem from '../components/StreamerItem'
import CategoryItem from '../components/CategoryItem'
import Spinner from '../components/Spinner'
import { FaChevronRight } from 'react-icons/fa'
import '../home-streamers.css'

function Streams() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { category } = useParams()
    const { user } = useSelector((state) => state.auth)
    const { streams, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams } = useSelector((state) => state.streams)
    const { categories, isErrorCategories, isSuccessCategories, isLoadingCategories, messageCategories } = useSelector((state) => state.categories)
    const [categoryFilter, setCategoryFilter] = useState('all')

    useEffect(() => {
        if (isErrorStreams) {
            console.log(messageStreams)
            navigate('/')
        }

        dispatch(getStreams())
        dispatch(getCategories())

        if (category !== undefined) {
            setCategoryFilter(category)
        } else {
            setCategoryFilter('all')
        }

        return () => {
            dispatch(reset())
            setCategoryFilter('all')
        }
    }, [user, navigate, isErrorStreams, messageStreams])

    if (isLoadingStreams || isLoadingCategories) {
        return <Spinner />
    }

    return (
        <>
            <select className="stream-category-filter" onChange={(e) => { setCategoryFilter(e.target.value) }} style={{ marginTop: 30, marginLeft: 20 }}>
                <option value="all">All categories</option>
                {categories.map((category) => (
                    categoryFilter === category._id ? (
                        <option value={category._id} selected>{category.name}</option>
                    ) : (
                        <option value={category._id}>{category.name}</option>
                    )
                ))}
            </select>

            <section className="streams" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginTop: 10 }}>
                {streams.filter(stream => (stream.category._id === categoryFilter || categoryFilter === "all") && stream.status === 'started').map((stream) => (
                    <StreamItem key={stream._id} stream={stream} />
                ))}

                {streams.filter(stream => (stream.category._id === categoryFilter || categoryFilter === "all") && stream.status === 'ended').map((stream) => (
                    <StreamItem key={stream._id} stream={stream} />
                ))}
            </section>
        </>
    )
}

export default Streams